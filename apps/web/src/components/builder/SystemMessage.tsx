import { FILE_STRUCTURE_TYPES, PHASE_TYPES, STAGE } from '@/src/types/stream_event_types';
import { Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Message } from '@/src/types/prisma-types';

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
];

interface PhaseItem {
    phase: PHASE_TYPES | FILE_STRUCTURE_TYPES;
    show: string;
}

const phases: PhaseItem[] = [
    { phase: PHASE_TYPES.THINKING, show: 'thinking...' },
    { phase: PHASE_TYPES.GENERATING, show: 'generating' },
    { phase: PHASE_TYPES.COMPLETE, show: 'completed' },
    { phase: FILE_STRUCTURE_TYPES.EDITING_FILE, show: 'editing file' },
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
        <div className="relative w-full rounded-[4px] overflow-hidden border border-neutral-800 bg-[#121214] text-neutral-300 select-none">
            <div className="relative z-10 w-full flex flex-col items-start justify-center gap-y-4 px-5 py-4.5 text-neutral-300">
                {stages.map(({ stage, show }, index) => {
                    const status =
                        index < currentIndex
                            ? 'complete'
                            : index === currentIndex
                              ? 'buffering'
                              : 'hung';

                    return (
                        <div key={stage} className="flex items-center gap-x-3">
                            <div
                                className={cn(
                                    'flex items-center justify-center w-4 h-4 rounded-full border transition-all',
                                    status === 'hung' && 'border-neutral-700',
                                    status === 'buffering' &&
                                        'border-primary bg-primary/20 animate-pulse',
                                    status === 'complete' && 'bg-primary border-primary text-white',
                                )}
                            >
                                {status === 'complete' && <Check className="w-3 h-3" />}
                            </div>
                            <div className="flex flex-col items-start justify-center gap-y-1.5">
                                <div
                                    className={cn(
                                        'font-semibold transition-all text-[13px]',
                                        status === 'hung' && 'opacity-50',
                                        status === 'buffering' && '',
                                        status === 'complete' && 'text-primary/90',
                                    )}
                                >
                                    {show}
                                </div>
                                {stage === STAGE.GENERATING_CODE &&  currentStage === STAGE.GENERATING_CODE && (
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
