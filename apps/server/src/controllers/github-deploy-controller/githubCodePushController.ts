import { Request, Response } from 'express';
import { get_github_owner } from '../../services/git_services';
import { github_worker_queue } from '../../services/init';
import ResponseWriter from '../../class/response_writer';

export default async function githubCodePushController(req: Request, res: Response) {
    const user_id = req.user?.id;
    const github_access_token = req.user?.githubAccessToken;

    if (!user_id) {
        ResponseWriter.unauthorized(res, 'Unauthorized');
        return;
    }

    if (!github_access_token) {
        ResponseWriter.unauthorized(res, 'GitHub authentication required');
        return;
    }

    const { repo_name, contract_id } = req.body;

    if (!repo_name || !contract_id) {
        ResponseWriter.not_found(res, 'Insufficient credentials');
        return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(repo_name)) {
        ResponseWriter.validation_error(res, 'Invalid repo name');
        return;
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

        const repo_url = `https://github.com/${owner}/${repo_name}`;

        ResponseWriter.success(res, repo_url, 'Export job queued successfully', 200);
        return res.status(400).json({
            success: false,
            error: 'GitHub authentication required.',
            requiresGithub: true,
        });
    } catch (error: any) {
        if (error.status === 401) {
            ResponseWriter.not_found(res, 'GitHub token expired. Reconnect your GitHub account');
        }

        ResponseWriter.server_error(res, 'Failed to export to GitHub');
    }
}
