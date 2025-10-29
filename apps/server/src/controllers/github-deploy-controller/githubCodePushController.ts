import { Request, Response } from 'express';
import { get_github_owner } from '../../services/git_services';
import { github_worker_queue } from '../../services/init';

export default async function githubCodePushController(req: Request, res: Response) {
    const user_id = req.user?.id;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { repo_name, contract_id } = req.body;

    console.log('repo name is ', repo_name);
    console.log('contract id is ', contract_id);

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
    console.log('github at is ', github_access_token);
    
    if (!github_access_token) {
        return res.status(400).json({
            error: 'GitHub authentication required. Please login with GitHub.',
        });
    }

    try {
        const owner = await get_github_owner(github_access_token);
        console.log('got the owner');

        const job = await github_worker_queue.enqueue({
            github_access_token,
            owner,
            repo_name,
            user_id,
            contract_id,
        });

        console.log('------------------------------------------------------------------>');
        console.log('job is ', job.data);

        console.log('job id is ', job.id);
        return res.status(200).json({
            success: true,
            message: 'Export job queued successfully',
            job_id: job.id,
        });
    } catch (error) {
        console.error('Error in github-push-controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to queue export job',
        });
    }
}
