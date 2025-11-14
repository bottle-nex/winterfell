import path from 'path';
import fs, { readFileSync } from 'fs';
import { tool } from '@langchain/core/tools';
import { tool_schema } from '../schema/tool_schema';
import chalk from 'chalk';
import { RunnableLambda } from '@langchain/core/runnables';

const RULES_DIR = path.resolve(process.cwd(), 'dist/rules');

export default class Tool {
    /**
     * for fetching rule files from tool calls
     * @returns dynamic structured tool
     */
    public static get_rules() {
        const get_tool = tool(
            async ({ rule_name }: { rule_name: string }) => {
                console.log(chalk.red('tool called for rule: '), rule_name);

                const file_path = path.join(RULES_DIR, `${rule_name}.md`);

                console.log(chalk.yellow('requested rule name path: '), file_path);

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

    /**
     * creates a runnable-lambda that executes tool-calling by using specific paths
     * @returns tool-runner with ai-message and tool-results
     */
    public static runner() {
        const tool_runner = new RunnableLambda({
            func: async (aiMessage: any) => {
                const tool_calls = aiMessage.tool_calls ?? aiMessage.tool_call_chunks ?? [];
                const tool = Tool.get_rules();
                const results: Record<string, any>[] = [];

                for (const tc of tool_calls) {
                    const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;
                    const result = await tool.invoke({ rule_name: args.rule_name });
                    results.push({ name: tc.name, args, result });
                }
                return {
                    aiMessage,
                    toolResults: results,
                };
            },
        });
        return tool_runner;
    }

    /**
     * finds all the rules file and remover their extension and return the name
     * @returns {string[]} containing rules name inside rules folder
     */
    public static get_rules_name(): string[] {
        let docs: string[] = [];

        const rules_dir = fs.readdirSync(RULES_DIR);

        if (!rules_dir) {
            console.log('rules dir not found');
            return [];
        }

        rules_dir.forEach((doc: string) => {
            docs.push(doc.split('.')[0]);
        });

        console.log({ docs });
        return docs;
    }
}
