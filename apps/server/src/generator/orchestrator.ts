import { gemini_coder_chain } from "./chains/coder";
import { gemini_planner_chain } from "./chains/planner";
import Rules from "./tools/rules";


export default async function generate_contract(user_input: string) {
    const plan = await gemini_planner_chain.invoke({
        goal: user_input,
    });

    const coder_output = await gemini_coder_chain.invoke({
        input: user_input,
        rules: Rules.get_rules_name(),
        files_likely_affected: plan.files_likely_affected,
        context: "use Anchor framework, follow moduler file structure",
    });


    return { plan, coder_output };
}

// ---------------------------- CODER INPUT ---------------------------- //

const rules_documents = ['', '', '', '', ''];


interface files_likely_affected {
    file: string,
    context: string,
}