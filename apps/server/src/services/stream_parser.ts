import { ChatRole, Message, prisma } from '@repo/database';
import { FileContent, STAGE } from '../types/content_types';
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
    private contractName: string;

    constructor() {
        this.buffer = '';
        this.currentPhase = null;
        this.currentFile = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
        this.isJsonBlock = false;
        this.generatedFiles = [];
        this.eventHandlers = new Map();
        this.contractName = '';
    }

    public on(
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        callback: (payload: StreamEventPayload) => void,
    ): void {
        if (!this.eventHandlers.has(type)) {
            this.eventHandlers.set(type, []);
        }
        const event_handlers = this.eventHandlers.get(type);
        if (event_handlers) {
            event_handlers.push(callback);
        }
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
        if (this.pendingContext !== null || this.buffer.includes('<')) {
            await this.handleContext(systemMessage);
        }

        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed && !this.insideCodeBlock) continue;

            // Handle name
            const nameMatch = trimmed.match(/<name>(.*?)<\/name>/);
            if(nameMatch && !this.insideCodeBlock) {
                const name = nameMatch[1].trim();
                console.log('the name: ', chalk.cyan(name));
                this.contractName = name;
                continue;
            }

            // Handle stages
            const stageMatch = trimmed.match(/<stage>(.*?)<\/stage>/);
            if (stageMatch && !this.insideCodeBlock) {
                const stage = stageMatch[1].trim();
                console.log('the stage: ', chalk.green(stage));
                this.stageMatch(stage, systemMessage);
                continue;
            }

            // Handle phases
            const phaseMatch = trimmed.match(/<phase>(.*?)<\/phase>/);
            if (phaseMatch && !this.insideCodeBlock) {
                const phase = phaseMatch[1].trim();
                console.log('the phase: ', chalk.yellow(phase));
                await this.phaseMatch(phase, systemMessage);
                continue;
            }

            // Handle files
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

            // Handle code blocks
            if (trimmed.startsWith('```')) {
                if (this.insideCodeBlock) {
                    // Closing code block
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
                    // Opening code block
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

        // After processing lines, check again if buffer contains context start
        if (this.buffer.includes('<')) {
            this.handleContext(systemMessage);
        }
    }

    private async handleContext(systemMessage: Message): Promise<boolean> {
        let llm_message;
        if (this.pendingContext !== null) {
            this.pendingContext += '\n' + this.buffer;
            const endMatch = this.pendingContext.match(/<\/\s*context\s*>/i);
            if (endMatch) {
                const content = this.pendingContext
                    .replace(/<\s*context\s*>/i, '')
                    .replace(/<\/\s*context\s*>/i, '')
                    .trim()
                    .split('<')[0];

                console.log('the context: ', chalk.red(content));

                llm_message = await prisma.message.create({
                    data: {
                        content: content,
                        contractId: systemMessage.contractId,
                        role: ChatRole.AI,
                    },
                });
                this.emit(
                    STAGE.CONTEXT,
                    { context: content, llmMessage: llm_message },
                    systemMessage,
                );
                this.pendingContext = null;
                this.buffer = '';
                return true;
            } else {
                this.buffer = '';
                return false;
            }
        }

        const startMatch = this.buffer.match(/<\s*context\s*>/i);
        if (startMatch) {
            const rest = this.buffer.split(startMatch[0])[1] || '';
            const endMatch = rest.match(/<\/\s*context\s*>/i);

            if (endMatch) {
                const content = rest.split(endMatch[0])[0].trim().split('<')[0];
                llm_message = await prisma.message.create({
                    data: {
                        content: content,
                        contractId: systemMessage.contractId,
                        role: ChatRole.AI,
                    },
                });
                this.emit(
                    STAGE.CONTEXT,
                    { context: content, llmMessage: llm_message },
                    systemMessage,
                );

                this.buffer = rest.split(endMatch[0]).slice(1).join(endMatch[0]);
                return true;
            } else {
                this.pendingContext = rest;
                this.buffer = this.buffer.split(startMatch[0])[0]; // keep content before <context>
                return false;
            }
        }

        return false;
    }

    private async stageMatch(stage: string, systemMessage: Message) {
        switch (stage) {
            case 'Planning':
                systemMessage = await prisma.message.update({
                    where: {
                        id: systemMessage.id,
                    },
                    data: {
                        planning: true,
                    },
                });
                this.emit(STAGE.PLANNING, { stage }, systemMessage);
                break;

            case 'Generating Code':
                systemMessage = await prisma.message.update({
                    where: {
                        id: systemMessage.id,
                    },
                    data: {
                        generatingCode: true,
                    },
                });
                this.emit(STAGE.GENERATING_CODE, { stage }, systemMessage);
                break;

            case 'Building':
                systemMessage = await prisma.message.update({
                    where: {
                        id: systemMessage.id,
                    },
                    data: {
                        building: true,
                    },
                });
                this.emit(STAGE.BUILDING, { stage }, systemMessage);
                break;

            case 'Creating Files':
                systemMessage = await prisma.message.update({
                    where: {
                        id: systemMessage.id,
                    },
                    data: {
                        creatingFiles: true,
                    },
                });
                this.emit(STAGE.CREATING_FILES, { stage }, systemMessage);
                break;

            case 'Finalizing':
                systemMessage = await prisma.message.update({
                    where: {
                        id: systemMessage.id,
                    },
                    data: {
                        finalzing: true,
                    },
                });
                this.emit(STAGE.FINALIZING, { stage }, systemMessage);
                break;

            default: {
                const errorData: ErrorData = {
                    message: 'Invalid stage',
                    error: `Unknown stage ${stage}`,
                };
                systemMessage = await prisma.message.update({
                    where: {
                        id: systemMessage.id,
                    },
                    data: {
                        error: true,
                    },
                });
                this.handleError(new Error('Invalid stage'), errorData);
                break;
            }
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

    public getContractName(): string {
        return this.contractName;
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
