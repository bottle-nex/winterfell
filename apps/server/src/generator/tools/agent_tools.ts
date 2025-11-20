import { MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import Tool from './tool';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import env from '../../configs/config.env';
import { AIMessage } from '@langchain/core/messages';

const coder = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0.2,
    apiKey: env.SERVER_GEMINI_API_KEY,
    streaming: true,
}).bindTools([Tool.get_rule]);

async function llm_call(state: typeof MessagesAnnotation.State) {
    const stream = await coder.stream([
        {
            role: 'system',
            content: `
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
`,
        },

        ...state.messages,
    ]);

    let final_content = '';
    let tool_calls: string | any[] | undefined = [];

    for await (const chunk of stream) {
        if (chunk.content) {
            console.log(chunk.content);
            final_content += chunk.content;
        }

        if (chunk.tool_calls) {
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

function has_tool_calls(msg: any): msg is { tool_calls: any[] } {
    return Array.isArray(msg?.tool_calls);
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
    const lastMessage = state.messages.at(-1);

    if (lastMessage && has_tool_calls(lastMessage)) return 'toolNode';
    return '__end__';
}

const agentBuilder = new StateGraph(MessagesAnnotation)
    .addNode('llmCall', llm_call)
    .addNode('toolNode', Tool.node)
    .addEdge('__start__', 'llmCall')
    .addConditionalEdges('llmCall', shouldContinue, ['toolNode', '__end__'])
    .addEdge('toolNode', 'llmCall')
    .compile();

const messages = [
    {
        role: 'user',
        content: 'create a todo contract',
    },
];

export const final = async () => {
    console.log('here comes the ai call and response.');
    const result = await agentBuilder.invoke({ messages });
    console.log(result);
};
