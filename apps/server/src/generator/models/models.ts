import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const gemini_planner = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0.2,
});

export const gemini_coder = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    streaming: true,
    temperature: 0.2,
});

export const claude_coder = new ChatAnthropic({
    model: 'claude-sonnet-4-5-20250929',
    streaming: true,
    callbacks: [
        {
            handleLLMNewToken(token: string) {
                console.log(token);
            },
            handleLLMEnd() {
                console.log('<------------ stream complete ------------>');
            },
        },
    ],
});
