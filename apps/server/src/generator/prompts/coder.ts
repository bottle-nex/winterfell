import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { gemini_coder } from "../models/models";


const coder_prompt = new PromptTemplate({
    template: `
    You're a coding agent. Given user request + plan + code, return updated code patch (diff only).
    
    User request:
    {input}

    Plan:
    {plan}

    Context:
    {context}
    `,
    inputVariables: ["input", "plan", "context"],
});

export const coder_chain = RunnableSequence.from([
    coder_prompt,
    gemini_coder,
]);