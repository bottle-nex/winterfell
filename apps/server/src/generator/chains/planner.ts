import { RunnableSequence } from "@langchain/core/runnables";
import { planner_prompt } from "../prompts/planner";
import { gemini_planner } from "../models/models";
import { planner_output_schema } from "../schema/planner_output_schema";

export const gemini_planner_chain = RunnableSequence.from([
    planner_prompt,
    // gemini_planner.bindTools([Rules.get()]),
    gemini_planner.withStructuredOutput(planner_output_schema),
]);
