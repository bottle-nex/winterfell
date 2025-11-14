import { gemini_coder_chain } from '../../generator/chains/coder';
import { gemini_planner_chain } from '../../generator/chains/planner';

export class ContractServices {
    constructor() {}

    public async generate_contract(user_input: string) {
        const plan = await gemini_planner_chain.invoke({
            goal: user_input,
            tasks: ['task1', 'task2'],
            files_likely_affected: ['file1', 'file2'],
        });

        const coder_output = await gemini_coder_chain.invoke({
            input: user_input,
            plan: plan,
            context: 'use Anchor framework, follow moduler file structure',
        });

        return { plan, coder_output };
    }
}
