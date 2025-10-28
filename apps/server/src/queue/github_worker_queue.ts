import Bull, { Job } from 'bull';
import { Octokit } from '@octokit/rest';
import { logger } from '../utils/logger';
import { GithubPushJobData } from '../types/github_worker_queue_types';
import { get_s3_codebase } from '../services/git_services';

export class GithubWorkerQueue {
    private queue: Bull.Queue<GithubPushJobData>;

    constructor(queue_name: string, redis_url: string = 'redis://localhost:6379') {
        this.queue = new Bull(queue_name, { redis: redis_url });
        this.queue.process(this.processJob.bind(this));
        logger.info(`GitHub push queue initialized: ${queue_name}`);
    }

    private async processJob(job: Job<GithubPushJobData>) {
        const { github_access_token, owner, repo_name, user_id, contract_id } = job.data;
        const octokit = new Octokit({ auth: github_access_token });

        try {
            // Step 1: Ensure repository exists
            await this.ensureRepositoryExists(octokit, owner, repo_name, user_id);

            // Step 2: Get files from S3
            const files = await get_s3_codebase(contract_id);
            if (!files || files.length === 0) {
                throw new Error('No files found in codebase');
            }

            // Step 3: Create blobs for all files
            const blobs = await this.createBlobs(octokit, owner, repo_name, files);

            // Step 4: Get base commit SHA if main branch exists
            const baseCommitSha = await this.getBaseCommitSha(octokit, owner, repo_name);

            // Step 5: Create tree with base tree to preserve existing files
            const tree = await this.createTree(
                octokit,
                owner,
                repo_name,
                files,
                blobs,
                baseCommitSha,
            );

            // Step 6: Create commit
            const commit = await this.createCommit(
                octokit,
                owner,
                repo_name,
                user_id,
                tree.data.sha,
                baseCommitSha,
            );

            // Step 7: Update main branch reference
            await this.updateMainBranch(octokit, owner, repo_name, commit.data.sha);

            const repo_url = `https://github.com/${owner}/${repo_name}`;
            logger.info(`Successfully pushed to ${repo_url} for user ${user_id}`);

            return { success: true, repo_url };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`Failed to push repo ${repo_name} for user ${user_id}:`, error);
            throw new Error(`GitHub push failed: ${errorMessage}`);
        }
    }

    private async ensureRepositoryExists(
        octokit: Octokit,
        owner: string,
        repo_name: string,
        user_id: string,
    ): Promise<void> {
        try {
            await octokit.repos.get({ owner, repo: repo_name });
            logger.info(`Repository ${repo_name} already exists`);
        } catch (err: any) {
            if (err.status === 404) {
                logger.info(`Creating repository ${repo_name} for user ${user_id}`);
                await octokit.repos.createForAuthenticatedUser({
                    name: repo_name,
                    private: false,
                    auto_init: false,
                });
            } else {
                throw err;
            }
        }
    }

    private async createBlobs(
        octokit: Octokit,
        owner: string,
        repo_name: string,
        files: FileContent[],
    ) {
        return Promise.all(
            files.map((file) =>
                octokit.git.createBlob({
                    owner,
                    repo: repo_name,
                    content: file.content,
                    encoding: 'utf-8',
                }),
            ),
        );
    }

    private async getBaseCommitSha(
        octokit: Octokit,
        owner: string,
        repo_name: string,
    ): Promise<string | undefined> {
        try {
            const ref = await octokit.git.getRef({
                owner,
                repo: repo_name,
                ref: 'heads/main',
            });
            return ref.data.object.sha;
        } catch (err: any) {
            if (err.status === 409 || err.status === 404) {
                return undefined;
            }
            throw err;
        }
    }

    private async createTree(
        octokit: Octokit,
        owner: string,
        repo_name: string,
        files: FileContent[],
        blobs: any[],
        baseCommitSha?: string,
    ) {
        let baseTreeSha: string | undefined;

        if (baseCommitSha) {
            const commit = await octokit.git.getCommit({
                owner,
                repo: repo_name,
                commit_sha: baseCommitSha,
            });
            baseTreeSha = commit.data.tree.sha;
        }

        return octokit.git.createTree({
            owner,
            repo: repo_name,
            tree: files.map((file, i) => ({
                path: file.path,
                mode: '100644' as const,
                type: 'blob' as const,
                sha: blobs[i].data.sha,
            })),
            base_tree: baseTreeSha,
        });
    }

    private async createCommit(
        octokit: Octokit,
        owner: string,
        repo_name: string,
        user_id: string,
        tree_sha: string,
        baseCommitSha?: string,
    ) {
        return octokit.git.createCommit({
            owner,
            repo: repo_name,
            message: `Deploy from Lovable for Anchor - User: ${user_id}`,
            tree: tree_sha,
            parents: baseCommitSha ? [baseCommitSha] : [],
        });
    }

    private async updateMainBranch(
        octokit: Octokit,
        owner: string,
        repo_name: string,
        commit_sha: string,
    ) {
        try {
            await octokit.git.updateRef({
                owner,
                repo: repo_name,
                ref: 'heads/main',
                sha: commit_sha,
                force: true,
            });
        } catch (err: any) {
            if (err.status === 422 || err.status === 404) {
                await octokit.git.createRef({
                    owner,
                    repo: repo_name,
                    ref: 'refs/heads/main',
                    sha: commit_sha,
                });
            } else {
                throw err;
            }
        }
    }

    public async enqueue(job_data: GithubPushJobData): Promise<Bull.Job<GithubPushJobData>> {
        const jobId = `${job_data.user_id}-${job_data.repo_name}`;

        return this.queue.add(job_data, {
            jobId,
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: true,
            removeOnFail: false,
        });
    }

    public async getJob(job_id: string): Promise<Bull.Job<GithubPushJobData> | null> {
        return this.queue.getJob(job_id);
    }

    public async close(): Promise<void> {
        await this.queue.close();
        logger.info(`GitHub worker queue closed`);
    }
}
