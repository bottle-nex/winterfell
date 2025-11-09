import { PromptTemplate } from '@langchain/core/prompts';

export const coder_prompt = new PromptTemplate({
    template: `
    You're a coding agent for solana anchor smart contract. Given user request + plan + code, return updated code patch (diff only).
    
    User request:
    {input}

    Plan:
    {plan}

    Context:
    {context}
    `,
    inputVariables: ['input', 'plan', 'context'],
});
