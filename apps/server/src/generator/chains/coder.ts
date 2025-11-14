import { RunnableSequence } from "@langchain/core/runnables";
import { coder_prompt } from "../prompts/coder";
import { claude_coder, gemini_coder } from "../models/models";
import Tool from "../tools/tool";

export const gemini_coder_chain = RunnableSequence.from([
    coder_prompt,
    gemini_coder.bindTools([Tool.get_rules()]),
    Tool.runner(),
]);

export const claude_coder_chain = RunnableSequence.from([
    coder_prompt,
    claude_coder.bindTools([Tool.get_rules()]),
    Tool.runner(),
])
