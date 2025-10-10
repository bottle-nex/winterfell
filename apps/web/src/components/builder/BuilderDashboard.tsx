import { JSX } from "react";
import BuilderChats from "./BuilderChats";
import CodeEditor from "../code/CodeEditor";

export default function BuilderDashboard(): JSX.Element {
    return (
        <div className="w-full flex-1 grid grid-cols-[30%_70%] bg-dark-base pb-4 pr-4 z-0">
            <BuilderChats />
            <CodeEditor />
        </div>
    );
}
