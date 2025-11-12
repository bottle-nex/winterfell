import { gemini_coder_chain } from "./chains/coder";
import { gemini_planner_chain } from "./chains/planner";


export default async function generate_contract(user_input: string) {
    const plan = await gemini_planner_chain.invoke({
        goal: user_input,
        tasks: ["do x", "do y"],
        files_likely_affected: ["file1", "file2"],
    });

    const coder_output = await gemini_coder_chain.invoke({
        input: user_input,
        plan: plan,
        context: "use Anchor framework, follow moduler file structure",
    });

    return { plan, coder_output };
}