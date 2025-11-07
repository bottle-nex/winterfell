import { FILE_STRUCTURE_TYPES, LOADER_STATES, PHASE_TYPES, STAGE } from '@/src/types/stream_event_types';
import { Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Message } from '@/src/types/prisma-types';
import { BsCheck2All } from "react-icons/bs";
import { FaList } from "react-icons/fa6";

interface StageItem {
    stage: STAGE;
    show: string;
}

const stages: StageItem[] = [
    { stage: STAGE.PLANNING, show: 'Planning' },
    { stage: STAGE.GENERATING_CODE, show: 'Generating Code' },
    { stage: STAGE.BUILDING, show: 'Building' },
    { stage: STAGE.CREATING_FILES, show: 'Sturcturing Files' },
    { stage: STAGE.FINALIZING, show: 'Finalizing' },
    { stage: STAGE.COMPLETED, show: 'Completed' },
];

type SystemMessageProps =
    | {
        message: Message;
        data: {
            currentStage: never;
            currentPhase: never;
            currentFile: never;
        };
    }
    | {
        message: never;
        data: {
            currentStage: STAGE;
            currentPhase?: PHASE_TYPES | FILE_STRUCTURE_TYPES;
            currentFile?: string;
        };
    };

export default function SystemMessage(systemMessage: SystemMessageProps) {
    const { currentStage } = dataFetcher(systemMessage);

    const currentIndex =
        currentStage === STAGE.END
            ? stages.length
            : stages.findIndex((s) => s.stage === currentStage);

    // in the div tags add a tag for error showing,
    return (
        <div className="relative w-[80%] rounded-[4px] overflow-hidden border border-neutral-800 bg-[#0e0e0f] text-neutral-300 select-none">
            <div className="relative z-10 w-full flex flex-col items-start justify-center gap-y-4 px-5 py-4.5 text-neutral-300">
                {stages.map(({ stage, show }, index) => {
                    const status =
                        index < currentIndex
                            ? LOADER_STATES.COMPLETED
                            : index === currentIndex
                                ? LOADER_STATES.BUFFERING
                                : LOADER_STATES.HUNG;

                    return (
                        <div key={stage} className="flex items-center gap-x-3">
                            <div
                                className={cn(
                                    'flex items-center justify-center rounded-full transition-all',
                                    stage !== STAGE.COMPLETED && 'border-[1px] w-4 h-4 p-0.5',
                                    status === LOADER_STATES.HUNG && 'border-neutral-700',
                                    status === LOADER_STATES.BUFFERING &&
                                    <Loader/>,
                                    status === LOADER_STATES.COMPLETED && stage && 'bg-transparent border-green-600 text-green-600',
                                )}
                            >
                                {status === LOADER_STATES.COMPLETED && stage === STAGE.COMPLETED ? <BsCheck2All className='size-4'/> : <Check className="w-2.5 h-2.5" />}
                            </div>
                            <div className="flex flex-col items-start justify-center gap-y-1.5">
                                <div
                                    className={cn(
                                        'tracking-wider transition-all text-[13px]',
                                        status === LOADER_STATES.HUNG && 'opacity-50',
                                        status === LOADER_STATES.BUFFERING && '',
                                        status === LOADER_STATES.COMPLETED && 'text-light/70',
                                    )}
                                >
                                    {show}
                                </div>
                                {stage === STAGE.GENERATING_CODE &&
                                    currentStage === STAGE.GENERATING_CODE && (
                                        <div className="pl-5 opacity-50 text-xs ">
                                            editing files
                                        </div>
                                    )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function dataFetcher({ message, data }: SystemMessageProps): {
    currentStage: STAGE;
    currentPhase?: PHASE_TYPES | FILE_STRUCTURE_TYPES;
    currentFile?: string;
} {
    let currentStage;
    let currentPhase;
    let currentFile;

    if (message) {
        if (message.error) currentStage = STAGE.ERROR;

        if (message.finalzing) currentStage = STAGE.END;
        else if (message.creatingFiles) currentStage = STAGE.CREATING_FILES;
        else if (message.building) currentStage = STAGE.BUILDING;
        else if (message.generatingCode) currentStage = STAGE.GENERATING_CODE;
        else if (message.planning) currentStage = STAGE.PLANNING;
        else currentStage = STAGE.START;
    } else {
        currentStage = data.currentStage;
        currentPhase = data.currentPhase;
        currentFile = data.currentFile;
    }

    return {
        currentStage,
        currentPhase,
        currentFile,
    };
}


function Loader() {
    return (
        <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
        </div>
    )
}