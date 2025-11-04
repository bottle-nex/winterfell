import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { command_schema } from '../../schemas/command_schema';
import { prisma } from '@repo/database';
import { BuildCacheCheck } from '@repo/types';
import CommandService from '../../class/build';

export default async function runCommandsController(req: Request, res: Response) {
    try {
        const user = req.user;

        if (!user || !user.id) {
            ResponseWriter.unauthorized(res);
            return;
        }

        const { command, contractId } = req.body;

        const parsed_command = command_schema.safeParse(command);

        if (!parsed_command.success) {
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

        const cache_check: BuildCacheCheck = await CommandService.check_build_cache(
            contractId,
            contract.code,
        );
        
        console.log('cache check: ', cache_check);

        if (cache_check.isCached && cache_check.canReuseBuild) {
            ResponseWriter.success(res, {}, 'the build is cached and no changes found', 200);
            return;
        }

        const job_id = await CommandService.queue_anchor_commands(
            parsed_command.data,
            contractId,
            user.id,
            contract.title,
        );

        if (job_id) {
            ResponseWriter.success(res, {}, 'Build has started', 200);
            return;
        }

        throw new Error();
    } catch (err) {
        console.error('error occured in running a command', err);
        ResponseWriter.server_error(res, 'error occured in running a command');
    }
}
