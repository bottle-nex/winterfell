import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MODEL } from "../types/model_types";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { planner_prompt } from "../prompts/planner";
import { coder_prompt } from "../prompts/coder";


export default class Models {

    private gemini_planner: ChatGoogleGenerativeAI;
    private gemini_coder: ChatGoogleGenerativeAI;
    private claude_coder: ChatAnthropic;

    constructor() {
        this.gemini_planner = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-pro',
            temperature: 0.2,
        });
        this.gemini_coder = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-pro',
            temperature: 0.2,
        });
        this.claude_coder = new ChatAnthropic({
            model: 'claude-sonnet-4-5-20250929',
        })
    }

    /**
     * applies switch-case logic to give correct chosen output
     * @param {"planner" | "coder"} role 
     * @param {MODEL} model 
     * @returns a model based on params
     */
    public get_model(role: "planner" | "coder", model: MODEL = MODEL.GEMINI) {
        switch(role) {
            case "planner":
                return this.gemini_planner;
            
            case "coder":
                switch(model) {
                    case MODEL.CLAUDE:
                        return this.claude_coder;
                    case MODEL.GEMINI:
                    default:
                        return this.gemini_coder;
                }
        }
    }

    /**
     * applies switch-case logic to give correct chosen output
     * @param {"planner" | "coder"} role 
     * @param {MODEL} model 
     * @returns 
     */
    public get_chain(role: "planner" | "coder", model: MODEL = MODEL.GEMINI) {
        switch(role) {
            case "planner":
                return this.create_chain(planner_prompt, this.get_model(role, model));

            case "coder":
                return this.create_chain(coder_prompt, this.get_model(role, model));

        }
    }

    /**
     * creates a runnable sequence based of prompt and model
     * @param {PromptTemplate} prompt 
     * @param {ChatGoogleGenerativeAI | ChatAnthropic} model 
     * @returns a runnable sequence for making a chain
     */
    private create_chain(prompt: PromptTemplate, model: ChatGoogleGenerativeAI | ChatAnthropic) {
        return RunnableSequence.from([
            prompt,
            model,
        ]);
    }

}