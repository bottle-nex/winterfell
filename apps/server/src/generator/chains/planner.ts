import { RunnableSequence } from '@langchain/core/runnables';
import { planner_prompt } from '../prompts/planner';
import { gemini_planner } from '../models/models';
import { planner_output_schema } from '../schema/planner_output_schema';
import Tool from '../tools/tool';

export const gemini_planner_chain = RunnableSequence.from([
    planner_prompt,
    gemini_planner.bindTools([Tool.get_rule]),
    gemini_planner.withStructuredOutput(planner_output_schema),
]);
