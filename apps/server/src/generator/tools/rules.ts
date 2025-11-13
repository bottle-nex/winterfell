import path from "path";
import fs, { readFileSync } from "fs";
import { tool } from "@langchain/core/tools";
import { tool_schema } from "../schema/tool_schema";
import chalk from "chalk";

const RULES_DIR: string = '../rules';

export default class Rules {
    /**
     * for fetching rule files from tool calls
     * @returns dynamic structured tool
     */
    public static get() {
        const get_tool = tool(
            async ({ rule_name }: { rule_name: string }) => {

                console.log(chalk.red('tool called for rule: '), rule_name);

                const file_path = path.join(RULES_DIR, `${rule_name}.md`);
                if (!fs.existsSync(file_path)) throw new Error('rule file not found');

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

    public static get_rules_name() {
        let docs: string[] = [];

        const rules_dir = fs.readdirSync(RULES_DIR);

        rules_dir.forEach((doc: string) => {
            docs.push(doc.split('.')[0]);
        });

        console.log({ docs });
        return docs;
    }

}
