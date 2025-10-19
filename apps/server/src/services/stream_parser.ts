import { Message, prisma, SystemMessageType } from '@repo/database';
import { FileContent, STAGE } from '../types/content_types';
import {
    BuildingData,
    CompleteData,
    ContextData,
    CreatingFilesData,
    EditingFileData,
    ErrorData,
    FILE_STRUCTURE_TYPES,
    GeneratingData,
    PHASE_TYPES,
    StageData,
    StreamEventData,
    ThinkingData,
} from '../types/stream_event_types';
import chalk from 'chalk';

interface StreamEventPayload {
    data: StreamEventData;
    systemMessage: Message;
}

export default class StreamParser {
    private buffer: string;
    private currentPhase: string | null;
    private currentFile: string | null;
    private currentCodeBlock: string;
    private insideCodeBlock: boolean;
    private isJsonBlock: boolean;
    private eventHandlers: Map<
        PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        ((payload: StreamEventPayload) => void)[]
    >;
    private generatedFiles: FileContent[];
    private pendingContext: string | null = null;

    constructor() {
        this.buffer = '';
        this.currentPhase = null;
        this.currentFile = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
        this.isJsonBlock = false;
        this.generatedFiles = [];
        this.eventHandlers = new Map();
    }

    public on(
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        callback: (payload: StreamEventPayload) => void,
    ): void {
        if (!this.eventHandlers.has(type)) {
            this.eventHandlers.set(type, []);
        }
        this.eventHandlers.get(type)!.push(callback);
    }

    private emit(
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        data: StreamEventData,
        systemMessage: Message,
    ): void {
        const handlers = this.eventHandlers.get(type);
        if (handlers) {
            handlers.forEach((fn) => fn({ data, systemMessage }));
        }
    }

    public feed(chunk: string, systemMessage: Message): void {
        this.buffer += chunk;
        this.processBuffer(systemMessage);
    }

    private async processBuffer(systemMessage: Message): Promise<void> {
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed && !this.insideCodeBlock) continue;

            // const contextRegex = /<\s*context\s*>([\s\S]*?)<\s*\/\s*context\s*>/i;
            // console.log('context regex: ')
            // const contextMatch = this.buffer.match(contextRegex);
            // if (contextMatch && !this.insideCodeBlock) {
            //     const context = contextMatch[1].trim();
            //     console.log('the context:', chalk.red(context));

            //     const data: ContextData = { context };
            //     this.emit(STAGE.CONTEXT, data, systemMessage);

            //     // Remove the matched portion from buffer so it's not reprocessed
            //     this.buffer = this.buffer.replace(contextRegex, '');
            //     continue;
            // }

            // if(this.handleContext(systemMessage)) continue;

            const stageMatch = trimmed.match(/<stage>(.*?)<\/stage>/);
            if (stageMatch && !this.insideCodeBlock) {
                const stage = stageMatch[1].trim();
                console.log('the stage: ', chalk.green(stage));
                this.stageMatch(stage, systemMessage);
                continue;
            }

            const phaseMatch = trimmed.match(/<phase>(.*?)<\/phase>/);
            if (phaseMatch && !this.insideCodeBlock) {
                const phase = phaseMatch[1].trim();
                console.log('the phase: ', chalk.yellow(phase));
                await this.phaseMatch(phase, systemMessage);
                continue;
            }

            const fileMatch = trimmed.match(/<file>(.*?)<\/file>/);
            if (fileMatch && !this.insideCodeBlock) {
                const filePath = fileMatch[1].trim();
                console.log('the file path: ', chalk.magenta(filePath));
                this.currentFile = filePath;
                const data: EditingFileData = {
                    file: filePath,
                    phase: this.currentPhase || 'unknown',
                };
                this.emit(FILE_STRUCTURE_TYPES.EDITING_FILE, data, systemMessage);
                continue;
            }

            if (trimmed.startsWith('```')) {
                if (this.insideCodeBlock) {
                    if (this.currentFile) {
                        const content = this.currentCodeBlock.trimEnd();
                        this.generatedFiles.push({
                            path: this.currentFile,
                            content: content,
                        });
                    }

                    this.insideCodeBlock = false;
                    this.isJsonBlock = false;
                    this.currentCodeBlock = '';
                } else {
                    this.insideCodeBlock = true;
                    this.isJsonBlock = trimmed.startsWith('```json');
                    this.currentCodeBlock = '';
                }
                continue;
            }

            if (this.insideCodeBlock) {
                this.currentCodeBlock += line + '\n';
                continue;
            }
        }
        this.handleContext(systemMessage);
    }

    private handleContext(systemMessage: Message): boolean {
        // Match <context> ... </context> even if tags are split with newlines
        const contextRegex = /<\s*\n?\s*context\s*\n?\s*>([\s\S]*?)<\s*\/\s*\n?\s*context\s*>/i;

        const match = this.buffer.match(contextRegex);
        if (match) {
            const context = match[1].trim();
            console.log('the context:', chalk.red(context));

            const data: ContextData = { context };
            this.emit(STAGE.CONTEXT, data, systemMessage);

            // Remove matched portion
            this.buffer = this.buffer.replace(contextRegex, '');
            return true;
        }

        return false;
    }



    private async stageMatch(stage: string, systemMessage: Message) {

        switch (stage) {
            case 'Planning':
                // this.currentStage = stage;
                this.emit(STAGE.PLANNING, { stage }, systemMessage);
                break;

            case 'Generating Code':
                this.emit(STAGE.GENERATING_CODE, { stage }, systemMessage);
                break;

            case 'Building':
                this.emit(STAGE.BUILDING, { stage }, systemMessage);
                break;

            case 'Creating Files':
                this.emit(STAGE.CREATING_FILES, { stage }, systemMessage);
                break;

            case 'Finalizing':
                this.emit(STAGE.FINALIZING, { stage }, systemMessage);
                break;

            default:
                const errorData: ErrorData = {
                    message: 'Invalid stage',
                    error: `Unknown stage ${stage}`,
                };
                this.handleError(new Error('Invalid stage'), errorData);
                break;
        }

    }

    private async phaseMatch(phase: string, systemMessage: Message) {

        switch (phase) {
            case 'thinking': {
                this.currentPhase = phase;
                const data: ThinkingData = { phase: 'thinking' };
                this.emit(PHASE_TYPES.THINKING, data, systemMessage);
                break;
            }
            case 'generating': {
                this.currentPhase = phase;
                const data: GeneratingData = { phase: 'editing file' };
                this.emit(PHASE_TYPES.GENERATING, data, systemMessage);
                break;
            }
            case 'building': {
                this.currentPhase = phase;
                systemMessage = await prisma.message.update({
                    where: {
                        id: systemMessage.id,
                    },
                    data: {
                        buildProgress: true,
                    },
                });
                const data: BuildingData = { phase: 'building' };
                this.emit(PHASE_TYPES.BUILDING, data, systemMessage);
                break;
            }
            case 'creating_files': {
                this.currentPhase = phase;
                const data: CreatingFilesData = { phase: 'creating_files' };
                this.emit(PHASE_TYPES.CREATING_FILES, data, systemMessage);
                break;
            }
            case 'complete': {
                this.currentPhase = phase;
                systemMessage = await prisma.message.update({
                    where: {
                        id: systemMessage.id,
                    },
                    data: {
                        buildComplete: true,
                    },
                });
                const data: CompleteData = { phase: 'complete' };
                this.emit(PHASE_TYPES.COMPLETE, data, systemMessage);
                break;
            }
            default: {
                const errorData: ErrorData = {
                    message: 'Invalid phase',
                    error: `Unknown phase: ${phase}`,
                };
                this.handleError(new Error('Invalid phase'), errorData);
            }
        }
    }

    public getGeneratedFiles(): FileContent[] {
        return this.generatedFiles;
    }

    public reset(): void {
        this.buffer = '';
        this.currentFile = null;
        this.currentPhase = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
        this.isJsonBlock = false;
        this.generatedFiles = [];
    }

    public handleError(err: Error, errorData?: ErrorData): void {
        const data: ErrorData = errorData || {
            message: err.message,
            error: err.name,
        };
        this.emit(PHASE_TYPES.ERROR, data, {} as Message);
    }
}
