import { gemini_coder_chain } from '../../generator/chains/coder';
import { gemini_planner_chain } from '../../generator/chains/planner';
import Tool from '../tools/tool';

export class ContractServices {
    public async generate_contract(user_input: string) {
        const plan = await gemini_planner_chain.invoke({
            goal: user_input,
        });

        const coder_output = await gemini_coder_chain.invoke({
            input: user_input,
            rules: Tool.get_rules_name(),
            files_likely_affected: plan.files_likely_affected,
            context: 'use Anchor framework, follow moduler file structure',
        });

        return { plan, coder_output };
    }
}
