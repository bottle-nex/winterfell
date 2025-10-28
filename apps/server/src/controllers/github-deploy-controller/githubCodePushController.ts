import { Request, Response } from 'express';
import { get_github_owner } from '../../services/git_services';
import { github_worker_queue } from '../../services/init';

export async function githubCodePushController(req: Request, res: Response) {
    const user_id = req.user?.id;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { repo_name, contract_id } = req.body;

    if (!repo_name || !contract_id) {
        return res.status(400).json({
            error: 'repo_name and contract_id are required',
        });
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(repo_name)) {
        return res.status(400).json({
            error: 'Invalid repo name. Use only alphanumeric characters, dash, underscore, or dot.',
        });
    }

    const github_access_token = req.user?.githubAccessToken;
    if (!github_access_token) {
        return res.status(400).json({
            error: 'GitHub authentication required. Please login with GitHub.',
        });
    }

    try {
        const owner = await get_github_owner(github_access_token);

        const job = await github_worker_queue.enqueue({
            github_access_token,
            owner,
            repo_name,
            user_id,
            contract_id,
        });

        return res.status(202).json({
            success: true,
            message: 'Export job queued successfully',
            job_id: job.id,
            status_url: `/api/github/status/${job.id}`,
        });
    } catch (error) {
        console.error('Error in github-push-controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to queue export job',
        });
    }
}
