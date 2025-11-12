import path from "path";
import fs, { readFileSync } from "fs";
import { tool } from "@langchain/core/tools";
import { tool_schema } from "../schema/tool_schema";

const RULES_DIR: string = '../rules';

export default class Rules {

    /**
     * for fetching rule files from tool calls
     * @returns dynamic structured tool
     */
    public static get() {
        const get_tool = tool(
            async ({ rule_name }: { rule_name: string }) => {
                const file_path = path.join(RULES_DIR, `${rule_name}.md`);
                if(!fs.existsSync(file_path)) throw new Error('rule file not found');

                return readFileSync(file_path, 'utf-8');
            },
            {
                name: 'get_rule',
                description: 'fetches a rule document by name',
                schema: tool_schema,
            },
        );
        return get_tool;
    }
}