import { Request, Response } from 'express';
import { get_github_owner } from '../../services/git_services';
import { github_worker_queue } from '../../services/init';

export default async function githubCodePushController(req: Request, res: Response) {
    const user_id = req.user?.id;
    const github_access_token = req.user?.githubAccessToken;

    if (!user_id) {
        return res.status(401).json({ 
            success: false,
            error: 'Unauthorized' 
        });
    }

    console.log('github access token is ', github_access_token);
    console.log('user id is: ', user_id);

    if (!github_access_token) {
        return res.status(400).json({
            success: false,
            error: 'Please connect your GitHub account.',
            requiresGithub: true,
        });
    }

    const { repo_name, contract_id } = req.body;

    if (!repo_name || !contract_id) {
        return res.status(400).json({
            success: false,
            error: 'Insufficient creds',
        });
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(repo_name)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid repo name. Use only alphanumeric characters, dash, underscore, or dot.',
        });
    }

    console.log('another attempt');

    try {
        const owner = await get_github_owner(github_access_token);

        const job = await github_worker_queue.enqueue({
            github_access_token,
            owner,
            repo_name,
            user_id,
            contract_id,
        });

        return res.status(200).json({
            success: true,
            message: 'Export job queued successfully',
            job_id: job.id,
        });
    } catch (error: any) {
        // Handle expired token
        if (error.status === 401) {
            return res.status(401).json({
                success: false,
                error: 'GitHub token expired. Please reconnect your GitHub account.',
                requiresGithub: true,
            });
        }

        console.error('Error in github-push-controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to queue export job',
        });
    }
}