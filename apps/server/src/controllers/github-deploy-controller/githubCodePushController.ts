import { Request, Response } from 'express';
import { get_github_owner } from '../../services/git_services';
import { github_worker_queue } from '../../services/init';

export default async function githubCodePushController(req: Request, res: Response) {
    const user_id = req.user?.id;
    if (!user_id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { repo_name, contract_id } = req.body;
    const github_access_token = req.user?.githubAccessToken;

    if (!github_access_token) {
        res.status(400).json({
            error: 'Login with github',
        });
        return;
    }

    try {
        const owner = await get_github_owner(github_access_token);
        // check owner here

        const jobData = {
            github_access_token,
            owner,
            repo_name,
            user_id,
            contract_id,
        };

        await github_worker_queue.enqueue(jobData);

        res.status(200).json({
            success: true,
            message: 'Code pushed successfully',
        });
        return;
    } catch (error) {
        console.error('Error in run-command-controller: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}
