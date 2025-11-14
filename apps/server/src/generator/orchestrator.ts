import { gemini_coder_chain } from './chains/coder';
import { gemini_planner_chain } from './chains/planner';

export default async function generate_contract(user_input: string) {
    const plan = await gemini_planner_chain.invoke({
        goal: user_input,
    });

    const coder_output = await gemini_coder_chain.invoke({
        input: user_input,
        rules: [
            'anchor_code_conventions',
            'anchor_file_structure',
            'example',
            'output_format_protocol',
            'staging_schema',
        ],
        files_likely_affected: plan.files_likely_affected,
        context: 'use Anchor framework, follow moduler file structure',
    });

    return { plan, coder_output };
}
