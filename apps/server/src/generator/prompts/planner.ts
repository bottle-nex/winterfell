import { PromptTemplate } from "@langchain/core/prompts";

export const planner_prompt = new PromptTemplate({
  template: `
You're a planning agent for Solana Anchor smart contract generation.

Return JSON like this:
{{
  "goal": "...",
  "tasks": ["...", "...", "..."],
  "files_likely_affected": ["...", "..."]
}}

Goal: {goal}
Tasks: {tasks}
Files likely affected: {files_likely_affected}
`,
  inputVariables: ["goal", "tasks", "files_likely_affected"],
});

