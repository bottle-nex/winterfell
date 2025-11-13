import { Job, Queue, Worker } from 'bullmq';
import { Octokit } from '@octokit/rest';
import { FileContent, GithubPushJobData } from '../types/github_worker_queue_types';
import { get_s3_codebase } from '../services/git_services';
import queue_config from '../configs/config.queue';

export class GithubWorkerQueue {
    private queue: Queue<GithubPushJobData>;
    private worker: Worker<GithubPushJobData>;

    constructor(queue_name: string) {
        this.queue = new Queue(queue_name, queue_config);
        this.worker = new Worker(queue_name, this.processJob.bind(this), queue_config);

        console.log(`GitHub push queue initialized: ${queue_name}`);
    }

    private async processJob(job: Job<GithubPushJobData>) {
        const { github_access_token, owner, repo_name, user_id, contract_id } = job.data;
        const octokit = new Octokit({ auth: github_access_token });

        try {
            await this.ensureRepository(octokit, owner, repo_name);

            const files = await get_s3_codebase(contract_id);
            if (!files || files.length === 0) {
                throw new Error('No files found in codebase');
            }

            await this.pushFilesToRepository(octokit, owner, repo_name, files, user_id);
            const repo_url = `https://github.com/${owner}/${repo_name}`;

            return {
                success: true,
                repo_url,
                files_count: files.length,
            };
        } catch (error) {
            const err = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`GitHub push failed: ${err}`);
        }
    }

    private async ensureRepository(
        octokit: Octokit,
        owner: string,
        repo_name: string,
    ): Promise<void> {
        try {
            await octokit.repos.get({ owner, repo: repo_name });
            console.log(`Repository ${repo_name} already exists`);
        } catch (err: any) {
            if (err.status === 404) {
                console.log(`Creating repository ${repo_name} with initial commit...`);

                await octokit.repos.createForAuthenticatedUser({
                    name: repo_name,
                    private: false,
                    auto_init: true,
                    description: `Deployed from Winterfell`,
                });

                console.log(`Repository ${repo_name} created successfully`);

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
        console.log(`getting main branch reference...`);
        const { data: refData } = await octokit.git.getRef({
            owner,
            repo: repo_name,
            ref: 'heads/main',
        });
        const baseCommitSha = refData.object.sha;

        console.log(`getting base comit`);
        const { data: baseCommit } = await octokit.git.getCommit({
            owner,
            repo: repo_name,
            commit_sha: baseCommitSha,
        });

        console.log(`Creating ${files.length} blobs...`);
        const blobs = await Promise.all(
            files.map(async (file, index) => {
                console.log(`  Creating blob ${index + 1}/${files.length}: ${file.path}`);
                return octokit.git.createBlob({
                    owner,
                    repo: repo_name,
                    content: file.content,
                    encoding: 'utf-8',
                });
            }),
        );

        console.log(`Creating tree with ${files.length} files...`);
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

        console.log(`creating commit...`);
        const { data: commit } = await octokit.git.createCommit({
            owner,
            repo: repo_name,
            message: `Deployed from winterfell \n\nUser: ${user_id}\nFiles: ${files.length}`,
            tree: tree.sha,
            parents: [baseCommitSha],
        });

        console.log(`Updating main branch`);
        await octokit.git.updateRef({
            owner,
            repo: repo_name,
            ref: 'heads/main',
            sha: commit.sha,
            force: true,
        });

        console.log(`Successfully pushed ${files.length} files to ${repo_name}`);
    }

    public async enqueue(job_data: GithubPushJobData): Promise<Job<GithubPushJobData>> {
        const jobId = `${job_data.user_id}-${job_data.repo_name}-${Date.now()}`;
        return this.queue.add('github-push', job_data, {
            jobId,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
            removeOnComplete: false,
            removeOnFail: false,
        });
    }

    public async getJob(job_id: string): Promise<Job<GithubPushJobData> | null | undefined> {
        return this.queue.getJob(job_id);
    }

    public async close(): Promise<void> {
        await this.queue.close();
    }
}
