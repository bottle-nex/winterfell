import z from 'zod';

export const planner_output_schema = z.object({
    goal: z.string(),
    workflow: z.array(z.string()),
    files_likely_affected: z.array(z.string()),
});
