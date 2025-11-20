import { prisma } from '@repo/database';
import { CustomWebSocket } from '../types/socket_types';
import { ParsedMessage } from '../ws/socket.server';
import BuildCache from './services.build_cache';
import { WSServerIncomingPayload, TerminalSocketData } from '@repo/types';

export default class CommandService {
    static async handle_incoming_build(
        ws: CustomWebSocket,
        message: ParsedMessage,
    ): Promise<WSServerIncomingPayload<string>> {
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

        return {
            type: TerminalSocketData.INFO,
            payload: 'Starting new build',
        };
    }
}
