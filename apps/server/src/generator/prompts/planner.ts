import { PromptTemplate } from '@langchain/core/prompts';

export const planner_prompt = new PromptTemplate({
    template: `
You're a planning agent for Solana Anchor smart contract generation.

Return JSON like this:
{{
  "tasks": ["...", "...", "..."],
  "files_likely_affected": [
    {{ file: "...", context: "..." }},
    {{ file: "...", context: "..." }},
  ]
}}

Goal: {goal}
`,
    inputVariables: ['goal'],
});
