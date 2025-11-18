import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { gemini_coder } from "../models/models";
import Tool from "./tool";

async function llm_call(state: typeof MessagesAnnotation.State) {
    const result = await gemini_coder.invoke([
        {
            role: 'system',
            content: `you're a expert anchor solana contract writer.`
        },
        ...state.messages,
    ]);

    return {
        messages: [result]
    }
}

function has_tool_calls(msg: any): msg is { tool_calls: any[] } {
    return Array.isArray(msg?.tool_calls);
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
    const lastMessage = state.messages.at(-1);

    if(lastMessage && has_tool_calls(lastMessage)) return "toolNode";
    return "__end__";
}

const agentBuilder = new StateGraph(MessagesAnnotation)
    .addNode("llmCall", llm_call)
    .addNode("toolNode", Tool.node)
    .addEdge("__start__", "llmCall")
    .addConditionalEdges(
        "llmCall",
        shouldContinue,
        ["llmCall", "__end__"],
    )
    .addEdge("toolNode", "llmCall")
    .compile();