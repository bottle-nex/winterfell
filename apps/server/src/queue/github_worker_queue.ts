import Bull, { Job } from 'bull';
import { Octokit } from '@octokit/rest';
import { logger } from '../utils/logger';
import { GithubPushJobData } from '../types/github_worker_queue_types';
import { get_s3_codebase } from '../services/git_services';

export class GithubWorkerQueue {
    private queue: Bull.Queue;

    constructor(queue_name: string) {
        this.queue = new Bull(queue_name, { redis: 'redis://localhost:6379' });
        this.setup_processors();
    }

    private setup_processors() {
        this.queue.process(this.process_job.bind(this));
        logger.info(`github push queue initialized on ${this.queue.name}`);
    }

    private async process_job(job: Job<GithubPushJobData>) {
        const { github_access_token, owner, repo_name, user_id, contract_id } = job.data;
        const octokit = new Octokit({ auth: github_access_token });

        try {
            let repo_exists = true;
            try {
                await octokit.repos.get({ owner, repo: repo_name });
            } catch (err: any) {
                if (err.status === 404) repo_exists = false;
            }

            if (!repo_exists) {
                logger.info(`Creating repo ${repo_name} for user ${user_id}`);
                await octokit.repos.createForAuthenticatedUser({
                    name: repo_name,
                    private: false,
                });
            }

            const files = await get_s3_codebase(contract_id);

            const blobs = await Promise.all(
                files.map((f: any) =>
                    octokit.git.createBlob({
                        owner,
                        repo: repo_name,
                        content: f.content,
                        encoding: 'utf-8',
                    }),
                ),
            );

            let base_tree_sha: string | undefined;
            try {
                const ref_data = await octokit.git.getRef({
                    owner,
                    repo: repo_name,
                    ref: 'heads/main',
                });
                const commit_data = await octokit.git.getCommit({
                    owner,
                    repo: repo_name,
                    commit_sha: ref_data.data.object.sha,
                });
                base_tree_sha = commit_data.data.tree.sha;
            } catch {
                base_tree_sha = undefined;
            }

            const tree = await octokit.git.createTree({
                owner,
                repo: repo_name,
                tree: files.map((f: any, i: number) => ({
                    path: f.path,
                    mode: '100644',
                    type: 'blob',
                    sha: blobs[i].data.sha,
                })),
                base_tree: base_tree_sha,
            });

            const commit = await octokit.git.createCommit({
                owner,
                repo: repo_name,
                message: `Initial commit from user ${user_id}`,
                tree: tree.data.sha,
                parents: base_tree_sha ? [base_tree_sha] : [],
            });

            await octokit.git.updateRef({
                owner,
                repo: repo_name,
                ref: 'heads/main',
                sha: commit.data.sha,
                force: true,
            });

            logger.info(`Repo ${repo_name} successfully updated for user ${user_id}`);
            return { success: true, repo_url: `https://github.com/${owner}/${repo_name}` };
        } catch (error) {
            logger.error(`Failed pushing repo ${repo_name} for user ${user_id}`, error);
            throw error;
        }
    }

    public async enqueue(job_data: GithubPushJobData) {
        return this.queue.add(job_data, { attempts: 3, backoff: 5000 });
    }

    public async close() {
        await this.queue.close();
        logger.info(`GithubPushService queue ${this.queue.name} closed`);
    }
}
