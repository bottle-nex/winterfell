import { Message, prisma, SystemMessageType } from '@repo/database';
import { FileContent } from '../types/content_types';
import {
    BuildingData,
    CompleteData,
    CreatingFilesData,
    EditingFileData,
    ErrorData,
    FILE_STRUCTURE_TYPES,
    GeneratingData,
    PHASE_TYPES,
    StreamEventData,
    ThinkingData,
} from '../types/stream_event_types';
import { logger } from '../utils/logger';

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
        PHASE_TYPES | FILE_STRUCTURE_TYPES,
        ((payload: StreamEventPayload) => void)[]
    >;
    private generatedFiles: FileContent[];

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
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES,
        callback: (payload: StreamEventPayload) => void,
    ): void {
        if (!this.eventHandlers.has(type)) {
            this.eventHandlers.set(type, []);
        }
        this.eventHandlers.get(type)!.push(callback);
    }

    private emit(
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES,
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
            
            const phaseMatch = trimmed.match(/<phase>(.*?)<\/phase>/);
            console.log("phase match is :", phaseMatch);
            if (phaseMatch && !this.insideCodeBlock) {
                const phase = phaseMatch[1].trim();
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
                continue;
            }

            const fileMatch = trimmed.match(/<file>(.*?)<\/file>/);
            if (fileMatch && !this.insideCodeBlock) {
                const filePath = fileMatch[1].trim();
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
