import z from 'zod';

export const continueChatSchema = z.object({
    instruction: z.string().min(1).max(200),
    contractId: z.uuid(),
})