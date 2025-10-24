import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { TextShimmer } from '../ui/shimmer-text';
import { LiaServicestack } from 'react-icons/lia';
import { FILE_STRUCTURE_TYPES, PHASE_TYPES } from '@/src/types/stream_event_types';
import { useMemo } from 'react';
import FileIcon from '../tickers/FileIcon';

export default function BuilderLoader() {
    const { currentFileEditing, phase } = useBuilderChatStore();

    const phaseInfo = useMemo(() => {
        switch (phase) {
            case PHASE_TYPES.THINKING:
                return {
                    title: 'Analyzing Request',
                    description: 'Understanding requirements and planning solution',
                };
            case PHASE_TYPES.GENERATING:
                return {
                    title: 'Generating Code',
                    description: 'Writing smart contract code',
                };
            case FILE_STRUCTURE_TYPES.EDITING_FILE:
                return {
                    title: 'Creating Files',
                    description: currentFileEditing || 'Setting up project structure',
                };
            case PHASE_TYPES.BUILDING:
                return {
                    title: 'Building Project',
                    description: 'Compiling and validating',
                };
            case PHASE_TYPES.CREATING_FILES:
                return {
                    title: 'Finalizing Structure',
                    description: 'Organizing files and dependencies',
                };
            case PHASE_TYPES.COMPLETE:
                return {
                    title: 'Complete',
                    description: 'Smart contract is ready',
                };
            default:
                return {
                    title: 'Processing',
                    description: 'Working on your request',
                };
        }
    }, [phase, currentFileEditing]);

    const fileName = currentFileEditing ? currentFileEditing.split('/').pop() : '';
    const filePath = currentFileEditing ? currentFileEditing.split('/').slice(0, -1).join('/') : '';

    return (
        <div className="w-full h-full flex items-center justify-center bg-[#16171a]">
            <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md">
                <LiaServicestack className="text-neutral-600 h-20 w-20 animate-pulse" />

                <div className="">
                    <h2 className="text-xl font-medium text-neutral-200">{phaseInfo.title}</h2>
                    {!currentFileEditing && (
                        <p className="text-sm text-neutral-500">{phaseInfo.description}</p>
                    )}
                </div>

                {currentFileEditing && (
                    <div className="w-80 h-16 bg-[#0c0d0e]/50 backdrop-blur-sm rounded border border-neutral-800/50 px-4 flex items-center gap-3 overflow-hidden">
                        <div className="flex-shrink-0">
                            <FileIcon filename={fileName || ''} size={20} />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            {filePath && (
                                <div className="text-[10px] text-neutral-600 font-mono truncate leading-tight">
                                    {filePath}
                                </div>
                            )}
                            <TextShimmer
                                duration={1.5}
                                className="text-sm font-mono text-neutral-300 truncate"
                            >
                                {fileName!}
                            </TextShimmer>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-xs text-neutral-600">
                        {phase === PHASE_TYPES.COMPLETE ? 'Done' : 'In progress'}
                    </span>
                </div>
            </div>
        </div>
    );
}
