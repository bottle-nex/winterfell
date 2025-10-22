import BuilderChats from './BuilderChats';
import CodeEditor from '../code/CodeEditor';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import BuilderLoder from './BuilderLoader';
import { JSX } from 'react';

export default function BuilderDashboard(): JSX.Element {
    const { loading } = useBuilderChatStore();
    return (
        <div className="w-full h-full grid grid-cols-[30%_70%] bg-dark-base z-0 overflow-hidden">
            <BuilderChats />
            <div className="pb-4 pr-4 h-full">
                <div className="w-full h-full z-10 border-neutral-800 border rounded-[4px] overflow-hidden relative">
                    {loading ? <BuilderLoder /> : <CodeEditor />}
                </div>
            </div>
        </div>
    );
}
