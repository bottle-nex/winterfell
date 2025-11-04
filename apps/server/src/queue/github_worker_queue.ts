import Bull, { Job } from 'bull';
import { Octokit } from '@octokit/rest';
import { logger } from '../utils/logger';
import { FileContent, GithubPushJobData } from '../types/github_worker_queue_types';
import { get_s3_codebase } from '../services/git_services';

export class GithubWorkerQueue {
    private queue: Bull.Queue<GithubPushJobData>;

    constructor(queue_name: string, redis_url: string = 'redis://localhost:6379') {
        this.queue = new Bull(queue_name, { redis: redis_url });
        this.queue.process(this.processJob.bind(this));

        this.queue.on('completed', (job) => {
            logger.info(`Job ${job.id} completed successfully`);
        });

        this.queue.on('failed', (job, err) => {
            logger.error(`Job ${job?.id} failed with error: ${err.message}`);
        });

        logger.info(`GitHub push queue initialized: ${queue_name}`);
    }

    private async processJob(job: Job<GithubPushJobData>) {
        const { github_access_token, owner, repo_name, user_id, contract_id } = job.data;
        const octokit = new Octokit({ auth: github_access_token });

        try {
            await job.progress(10);
            logger.info(`[Job ${job.id}] Step 1: Ensuring repository exists...`);

            await this.ensureRepository(octokit, owner, repo_name);

            await job.progress(30);
            logger.info(`[Job ${job.id}] Step 2: Fetching files from S3...`);
            const files = await get_s3_codebase(contract_id);

            if (!files || files.length === 0) {
                throw new Error('No files found in codebase');
            }

            logger.info(`[Job ${job.id}] Found ${files.length} files to push`);

            await job.progress(50);
            logger.info(`[Job ${job.id}] Step 3: Pushing files to repository...`);

            await this.pushFilesToRepository(octokit, owner, repo_name, files, user_id);

            await job.progress(100);
            const repo_url = `https://github.com/${owner}/${repo_name}`;
            logger.info(`[Job ${job.id}] Successfully pushed to ${repo_url}`);

            return { success: true, repo_url, files_count: files.length };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : '';

            logger.error(`[Job ${job.id}] Failed:`, {
                message: errorMessage,
                stack: errorStack,
            });

            throw new Error(`GitHub push failed: ${errorMessage}`);
        }
    }

    private async ensureRepository(
        octokit: Octokit,
        owner: string,
        repo_name: string,
    ): Promise<void> {
        try {
            await octokit.repos.get({ owner, repo: repo_name });
            logger.info(`Repository ${repo_name} already exists`);
        } catch (err: any) {
            if (err.status === 404) {
                logger.info(`Creating repository ${repo_name} with initial commit...`);

                await octokit.repos.createForAuthenticatedUser({
                    name: repo_name,
                    private: false,
                    auto_init: true,
                    description: `Deployed from Winterfell`,
                });

                logger.info(`Repository ${repo_name} created successfully`);

                await new Promise((resolve) => setTimeout(resolve, 3000));
            } else {
                throw err;
            }
        }
    }

    private async pushFilesToRepository(
        octokit: Octokit,
        owner: string,
        repo_name: string,
        files: FileContent[],
        user_id: string,
    ): Promise<void> {
        logger.info(`getting main branch reference...`);
        const { data: refData } = await octokit.git.getRef({
            owner,
            repo: repo_name,
            ref: 'heads/main',
        });
        const baseCommitSha = refData.object.sha;

        logger.info(`getting base comit`);
        const { data: baseCommit } = await octokit.git.getCommit({
            owner,
            repo: repo_name,
            commit_sha: baseCommitSha,
        });

        logger.info(`Creating ${files.length} blobs...`);
        const blobs = await Promise.all(
            files.map(async (file, index) => {
                logger.info(`  Creating blob ${index + 1}/${files.length}: ${file.path}`);
                return octokit.git.createBlob({
                    owner,
                    repo: repo_name,
                    content: file.content,
                    encoding: 'utf-8',
                });
            }),
        );

        logger.info(`Creating tree with ${files.length} files...`);
        const { data: tree } = await octokit.git.createTree({
            owner,
            repo: repo_name,
            tree: files.map((file, i) => ({
                path: file.path,
                mode: '100644' as const,
                type: 'blob' as const,
                sha: blobs[i].data.sha,
            })),
            base_tree: baseCommit.tree.sha,
        });

        logger.info(`Creating commit...`);
        const { data: commit } = await octokit.git.createCommit({
            owner,
            repo: repo_name,
            message: `Deploy from Lovable for Anchor\n\nUser: ${user_id}\nFiles: ${files.length}`,
            tree: tree.sha,
            parents: [baseCommitSha],
        });

        logger.info(`Updating main branch`);
        await octokit.git.updateRef({
            owner,
            repo: repo_name,
            ref: 'heads/main',
            sha: commit.sha,
            force: true,
        });

        logger.info(`Successfully pushed ${files.length} files to ${repo_name}`);
    }

    public async enqueue(job_data: GithubPushJobData): Promise<Bull.Job<GithubPushJobData>> {
        const jobId = `${job_data.user_id}-${job_data.repo_name}-${Date.now()}`;
        return this.queue.add(job_data, {
            jobId,
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: false,
            removeOnFail: false,
        });
    }

    public async getJob(job_id: string): Promise<Bull.Job<GithubPushJobData> | null> {
        return this.queue.getJob(job_id);
    }

    public async close(): Promise<void> {
        await this.queue.close();
        logger.info('GitHub worker queue closed');
    }
}
