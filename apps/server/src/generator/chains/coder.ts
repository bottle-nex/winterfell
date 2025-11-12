import { RunnableSequence } from "@langchain/core/runnables";
import { coder_prompt } from "../prompts/coder";
import { claude_coder, gemini_coder } from "../models/models";
import Rules from "../tools/rules";

export const gemini_coder_chain = RunnableSequence.from([
    coder_prompt,
    gemini_coder.bindTools([Rules.get()]),
]);

export const claude_coder_chain = RunnableSequence.from([
    coder_prompt,
    claude_coder.bindTools([Rules.get()]),
])