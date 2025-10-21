import z from 'zod';

export const startChatSchema = z.object({
    message: z.string().min(1).max(200),
    chatId: z.uuid(),
});
