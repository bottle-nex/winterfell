import { prisma } from '@repo/database';
import { Request, Response } from 'express';
import { server_orchestrator_queue } from '../../services/init';
import { COMMAND } from '../../types/contract_types';
import { command_schema } from '../../schemas/command_schema';

export default async function runCommandController(req: Request, res: Response) {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const { command, contractId } = req.body;

        const data = command_schema.safeParse(command);

        const contract = await prisma.contract.findUnique({
            where: {
                id: contractId,
                userId: user.id,
            },
        });

        if (!contract) {
            res.status(404).json({
                success: false,
                message: 'Contract not found',
            });
            return;
        }

        switch (data.data as COMMAND) {
            case COMMAND.ANCHOR_BUILD:
                server_orchestrator_queue.run_anchor_build_command(
                    user.id,
                    contractId,
                    contract.title,
                );
                break;

            case COMMAND.ANCHOR_TEST:
                server_orchestrator_queue.run_anchor_test_command(
                    user.id,
                    contractId,
                    contract.title,
                );
                break;

            case COMMAND.ANCHOR_DEPLOY:
                server_orchestrator_queue.run_anchor_deploy_command(
                    user.id,
                    contractId,
                    contract.title,
                );
                break;

            default:
                res.status(422).json({
                    success: false,
                    message: 'Invalid command!',
                });
                return;
        }

        // stream the response of the running command in the pod

        // remove this after adding streaming response
        res.status(200).json({
            success: false,
            message: 'command execution started',
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
