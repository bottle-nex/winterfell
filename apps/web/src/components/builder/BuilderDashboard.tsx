import { JSX } from 'react';
import BuilderChats from './BuilderChats';
import CodeEditor from '../code/CodeEditor';

export default function BuilderDashboard(): JSX.Element {
    return (
        <div className="w-full h-full grid grid-cols-[30%_70%] bg-dark-base z-0 overflow-hidden">
            <BuilderChats />
            <div className="pb-4 pr-4 h-full">
                <CodeEditor />
            </div>
        </div>
    );
}
