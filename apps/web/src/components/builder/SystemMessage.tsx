import {
    FILE_STRUCTURE_TYPES,
    LOADER_STATES,
    PHASE_TYPES,
    STAGE,
} from '@/src/types/stream_event_types';
import { Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Message } from '@/src/types/prisma-types';
import { BsCheck2All } from 'react-icons/bs';
import { FaListUl } from 'react-icons/fa6';
import { CircleDotDashed } from '../ui/animated/circle-dot-dashed';

interface StageItem {
    stage: STAGE;
    show: string;
}

const stages: StageItem[] = [
    { stage: STAGE.PLANNING, show: 'Planning' },
    { stage: STAGE.GENERATING_CODE, show: 'Generating Code' },
    { stage: STAGE.BUILDING, show: 'Building' },
    { stage: STAGE.CREATING_FILES, show: 'Structuring Files' },
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

    const stagesExceptCompleted = stages.filter((s) => s.stage !== STAGE.COMPLETED);
    const completedStage = stages.find((s) => s.stage === STAGE.COMPLETED)!;

    const allCompleted =
        currentStage === STAGE.COMPLETED || currentIndex >= stagesExceptCompleted.length;

    return (
        <div className="relative w-[80%] rounded-[4px] overflow-hidden border border-neutral-800 bg-[#0e0e0f] text-neutral-300 select-none">
            <div className="px-5 pt-4 flex items-center gap-x-1.5 text-light/90">
                <FaListUl />
                <div className="leading-0">Execution strategy</div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-start justify-center gap-y-3 px-5 py-4.5 text-neutral-300">
                {stagesExceptCompleted.map(({ stage, show }, index) => {
                    const status =
                        index < currentIndex
                            ? LOADER_STATES.COMPLETED
                            : index === currentIndex
                              ? LOADER_STATES.BUFFERING
                              : LOADER_STATES.HUNG;

                    const isCompleted = status === LOADER_STATES.COMPLETED;
                    const isBuffering = status === LOADER_STATES.BUFFERING;
                    const isHung = status === LOADER_STATES.HUNG;

                    return (
                        <div key={stage} className="flex items-center gap-x-3">
                            <div
                                className={cn(
                                    'flex items-center justify-center rounded-full transition-all',
                                    isCompleted &&
                                        'bg-transparent border-[1px] border-green-600 text-green-600 w-3.5 h-3.5 p-0.5',
                                    isBuffering && 'w-4 h-4',
                                    isHung && 'border-[1px] border-neutral-700 w-4 h-4 p-0.5',
                                )}
                            >
                                {isBuffering ? (
                                    <CircleDotDashed
                                        className="size-4 text-light/70 animate-spin duration-500"
                                        shouldAnimate={true}
                                    />
                                ) : isCompleted ? (
                                    <Check strokeWidth={3} className="size-2" />
                                ) : null}
                            </div>

                            <div className="flex flex-col items-start justify-center gap-y-1.5">
                                <div
                                    className={cn(
                                        'tracking-wider transition-all text-[13px]',
                                        isHung && 'opacity-50',
                                        isCompleted && 'text-light/70',
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

            {allCompleted && (
                <div className="px-5 pb-4 mt flex items-center gap-x-3 transition-opacity duration-500 animate-fade-in">
                    <div className="flex items-center justify-center rounded-full text-green-600">
                        <BsCheck2All className="size-4" />
                    </div>
                    <div className="text-light/70 tracking-wider text-[13px]">
                        {completedStage.show}
                    </div>
                </div>
            )}
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
        else if (message.finalzing) currentStage = STAGE.END;
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
