import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { command_schema } from '../../schemas/command_schema';
import BuildService from '../../class/build';
import { prisma } from '@repo/database';
import { BuildCacheCheck, COMMAND } from '@repo/types';

export default async function runCommandsController(req: Request, res: Response) {
    try {
        const user = req.user;

        if (!user || !user.id) {
            ResponseWriter.unauthorized(res);
            return;
        }

        const { command, contractId } = req.body;

        const data = command_schema.safeParse(command);

        if (!data.success) {
            ResponseWriter.validation_error(res, 'certain commands are not accepted');
            return;
        }

        if (typeof contractId !== 'string' || !contractId) {
            ResponseWriter.validation_error(res, 'contractId is invalid or not found');
            return;
        }

        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
        });

        if (!contract || !contract.code) {
            ResponseWriter.not_found(res, 'contract code has not been generated');
            return;
        }

        const cache_check: BuildCacheCheck = await BuildService.check_build_cache(
            contractId,
            contract.code,
        );

        if (cache_check.isCached && cache_check.canReuseBuild) {
            ResponseWriter.success(res, {}, 'the build is cached and no change found', 200);
            return;
        }

        switch (data.data as COMMAND) {
            case COMMAND.WINTERFELL_BUILD:
                BuildService.queue_build_job(contractId, user.id, contract.title);
                return;
        }
    } catch (err) {
        console.error('error occured in running a command', err);
        ResponseWriter.server_error(res, 'error occured in running a command');
    }
}
