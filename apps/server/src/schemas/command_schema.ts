import z from 'zod';
import { COMMAND } from '../types/contract_types';

export const command_schema = z.enum([
    COMMAND.ANCHOR_BUILD,
    COMMAND.ANCHOR_DEPLOY,
    COMMAND.ANCHOR_TEST,
]);
