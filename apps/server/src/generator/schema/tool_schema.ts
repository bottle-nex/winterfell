import z from "zod";

export const tool_schema = z.object({
    rule_name: z.string().describe("the rule file should be named without .md"),
});