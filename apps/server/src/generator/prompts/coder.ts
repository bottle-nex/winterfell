import { PromptTemplate } from '@langchain/core/prompts';

export const coder_prompt = new PromptTemplate({
    template: `
    You're a coding agent for solana anchor smart contract. Given user request + plan + code, return updated code patch (diff only).
    
    User request:
    {input}

    rules: (need to be fetched by tool-calling)
    {rules}
    do study rules before generation

    files_likely_affected:
    {files_likely_affected}

    Context:
    {context}
    `,
    inputVariables: ['input', 'rules', 'files_likely_affected', 'context'],
});
