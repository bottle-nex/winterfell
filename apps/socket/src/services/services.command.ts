import { prisma } from '@repo/database';
import { CustomWebSocket } from '../types/socket_types';
import { ParsedMessage } from '../ws/socket.server';
import BuildCache from './services.build_cache';
import { WSServerIncomingPayload, TerminalSocketData, BuildJobPayload } from '@repo/types';
import { socket_orchestrator_queue } from './services.init';

export default class CommandService {
    static async handle_incoming_build<T>(
        ws: CustomWebSocket,
        message: ParsedMessage<T>,
    ): Promise<WSServerIncomingPayload<string>> {
        try {
            const contractId = message.payload;
            if (!contractId || typeof contractId !== 'string') {
                return {
                    type: TerminalSocketData.VALIDATION_ERROR,
                    payload: 'Invalid or missing contract ID',
                };
            }

            const contract = await prisma.contract.findUnique({
                where: { id: contractId },
            });

            if (!contract) {
                return {
                    type: TerminalSocketData.VALIDATION_ERROR,
                    payload: `Contract with ID ${contractId} not found`,
                };
            }

            const is_cached = BuildCache.check_build_cache(contract);

            if (is_cached) {
                return {
                    type: TerminalSocketData.INFO,
                    payload: 'Build retrieved from cache',
                };
            }

            const data: BuildJobPayload = {
                jobId: '',
                contractId: ws.contractId,
                contractName: '',
                userId: ws.user.id,
                timestamp: Date.now(),
                command: message.type,
            };

            const job_id = await socket_orchestrator_queue.queue_command(message.type, data);
            if (!job_id) {
                return {
                    type: TerminalSocketData.SERVER_MESSAGE,
                    payload: `Internal server error while running your command`,
                };
            }

            await prisma.buildJob.create({
                data: {
                    contractId: contract.id,
                    jobId: job_id,
                    status: 'QUEUED',
                    command: message.type,
                    startedAt: new Date(),
                },
            });

            return {
                type: TerminalSocketData.INFO,
                payload: 'Starting new build',
            };
        } catch (err) {
            console.error('error while running command', err);
            return {
                type: TerminalSocketData.SERVER_MESSAGE,
                payload: `Internal server error while running your command`,
            };
        }
    }
}
