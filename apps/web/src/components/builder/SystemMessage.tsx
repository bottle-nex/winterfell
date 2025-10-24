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
    const { currentStage, currentPhase, currentFile } = dataFetcher(systemMessage);

    const currentIndex =
        currentStage === STAGE.END
            ? stages.length
            : stages.findIndex((s) => s.stage === currentStage);

    function truncate(str: string): string {
        if (!str) return '';
        if (str.length <= 10) return str;
        const parts = str.split('/');
        const lastPart = parts[parts.length - 1];
        const secLastPart = parts[parts.length - 2];

        if (secLastPart) return `.../${secLastPart}/${lastPart}`;
        else return `.../${lastPart}`;
    }

    // in the div tags add a tag for error showing,

    return (
        <div className="relative w-[80%] rounded-2xl overflow-hidden border border-neutral-700/50 bg-neutral-900 text-neutral-300 backdrop-blur-sm select-none">
            {/* gradient part */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-700/30 to-transparent opacity-60" />

            {/* circular gradient part */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-black/10 blur-3xl" />

            {/* actual content */}
            <div className="relative z-10 w-full flex flex-col items-start justify-center gap-y-4 p-6 text-neutral-300">
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
                                    'flex items-center justify-center w-5 h-5 rounded-full border transition-all',
                                    status === 'hung' && 'border-neutral-700',
                                    status === 'buffering' &&
                                        'border-primary bg-primary/20 animate-pulse',
                                    status === 'complete' && 'bg-primary border-primary text-white',
                                )}
                            >
                                {status === 'complete' && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex flex-col items-start justify-center gap-y-1.5 ">
                                <div
                                    className={cn(
                                        'text-base font-semibold transition-all',
                                        status === 'hung' && 'opacity-50',
                                        status === 'buffering' && '',
                                        status === 'complete' && 'text-primary/90',
                                    )}
                                >
                                    {show}
                                </div>
                                {stage === STAGE.GENERATING_CODE &&
                                    currentStage === STAGE.GENERATING_CODE && (
                                        <div className="pl-5 opacity-50 text-sm ">
                                            {phases.find((p) => p.phase === currentPhase)?.show +
                                                ' '}
                                            {currentFile &&
                                                currentPhase ===
                                                    FILE_STRUCTURE_TYPES.EDITING_FILE &&
                                                truncate(currentFile)}
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
