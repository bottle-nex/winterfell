import { COMMAND } from '@repo/types';
import z from 'zod';

export const command_schema = z.enum([
    COMMAND.WINTERFELL_BUILD,
    COMMAND.WINTERFELL_TEST,
    COMMAND.WINTERFELL_DEPLOY_DEVNET,
    COMMAND.WINTERFELL_DEPLOY_MAINNET,
]);
