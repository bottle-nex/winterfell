import { Request, Response } from 'express';
import { get_github_owner } from '../../services/git_services';
import { github_worker_queue } from '../../services/init';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@repo/database';

export default async function githubCodePushController(req: Request, res: Response) {
    const user_id = req.user?.id;

    if (!user_id) {
        ResponseWriter.unauthorized(res, 'Unauthorized');
        return;
    }

    const { repo_name, contract_id, hasGithub } = req.body;

    if (!hasGithub || hasGithub === null) {
        ResponseWriter.unauthorized(res, 'GitHub authentication required');
        return;
    }

    const user = await prisma.user.findUnique({
        where: { id: user_id },
    });

    if (!user || !user.githubAccessToken) {
        ResponseWriter.not_found(res, 'Github authentication failed.');
        return;
    }

    if (!repo_name || !contract_id) {
        ResponseWriter.not_found(res, 'Insufficient credentials');
        return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(repo_name)) {
        ResponseWriter.validation_error(res, 'Invalid repo name');
        return;
    }

    try {
        const owner = await get_github_owner(user?.githubAccessToken);

        await github_worker_queue.enqueue({
            github_access_token: user.githubAccessToken,
            owner,
            repo_name,
            user_id,
            contract_id,
        });

        const repo_url = `https://github.com/${owner}/${repo_name}`;

        ResponseWriter.success(res, repo_url, 'Export job queued successfully', 200);
    } catch (error) {
        ResponseWriter.server_error(res, 'Failed to export to GitHub');
        return;
    }
}
