import { PromptTemplate } from "@langchain/core/prompts";

export const planner_prompt = new PromptTemplate({
    template: `
    You're a planning agent for solana anchor smart contract generator. Given user request + context, return a structured plan,

    Return JSON:
    {
        "goal": "...",
        "tasks": ["...", "...", "..."],
        "files_likely_affected": ["...", "..."],
    }

    User request:
    {input}
    `,
    inputVariables: ["input"]
});
