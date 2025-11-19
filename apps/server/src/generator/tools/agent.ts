import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import env from "../../configs/config.env";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import Tool from "./tool";
import { AIMessage } from "@langchain/core/messages";


export default class Agent {

    private llm;

    constructor() {
        this.llm = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash',
            temperature: 0.2,
            streaming: true,
            apiKey: env.SERVER_GEMINI_API_KEY,
        });
        // add the clause llm too
    }

    public final_call() {
        const messages = [{
            role: 'user',
            content: 'create a todo contract',
        }];
        
        const final = async () => {
            console.log('here comes the ai call and response');
            const result = await this.agent_builder.invoke({ messages });
            console.log(result);
        }
        final();
    }

    private async llm_call(state: typeof MessagesAnnotation.State) {
        const stream = await this.llm.stream([
            {
                role: "system",
                content: this.coder_content,
            },
            ...state.messages,
        ]);

        let final_content: string = "";
        let tool_calls: string | any[] | undefined = [];

        for await (const chunk of stream) {
            if(chunk.content) {
                console.log(chunk.content);
                final_content += chunk.content;
            }
            if(chunk.tool_calls) {
                tool_calls = chunk.tool_calls;
            }
        }

        const message = new AIMessage({
            content: final_content,
            tool_calls: tool_calls.length > 0 ? tool_calls : undefined,
        });

        return {
            messages: [message],
        };
    }

    private has_tool_calls(msg: any): msg is { tool_calls: any[] } {
        return Array.isArray(msg?.tool_calls);
    }

    private should_continue(state: typeof MessagesAnnotation.State) {
        const last_message = state.messages.at(-1);
        if(last_message && this.has_tool_calls(last_message)) return "toolNode";
        return "__end__";
    }

    public agent_builder = new StateGraph(MessagesAnnotation)
        .addNode("llmCall", this.llm_call)
        .addNode("toolNode", Tool.node)
        .addEdge("__start__", "llmCall")
        .addConditionalEdges(
            "llmCall",
            this.should_continue,
            ["toolNode", "__end__"],
        )
        .addEdge("toolNode", "llmCall")
        .compile();

    private coder_content = `
You are a senior Anchor Solana smart contract developer.

IF YOU need rules, CALL get_rule({ rule_name }) **using ONLY EXACT NAMES from above**.
NEVER invent your own rule names.


TOOLS:
- You can call "get_rule" anytime you need coding guidelines.
- The argument is: { rule_name: string }

RULE:
If user asks for a contract, and you need any rule, ALWAYS call the tool.
Do not guess rules.

AVAILABLE RULES:
at first do fetch staging_schema for understanding the staging structure
${Tool.get_rules_name()}

Process:
1. Think if rules are needed. If yes → call the tool.
2. Wait for tool output.
3. Continue generating the contract with correct rules.
`

}
