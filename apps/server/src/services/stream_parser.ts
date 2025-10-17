import { Message, prisma, SystemMessageType } from '@repo/database';
import { FileContent } from '../types/content_types';
import { FILE_STRUCTURE_TYPES, PHASE_TYPES } from '../types/stream_event_types';

export default class StreamParser {
    private buffer: string;
    private currentPhase: string | null;
    private currentFile: string | null;
    private currentCodeBlock: string;
    private insideCodeBlock: boolean;
    private isJsonBlock: boolean;
    private eventHandlers: Map<PHASE_TYPES | FILE_STRUCTURE_TYPES, ((data: any) => void)[]> =
        new Map();
    private generatedFiles: FileContent[] = [];

    constructor() {
        this.buffer = '';
        this.currentPhase = null;
        this.currentFile = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
        this.isJsonBlock = false;
        this.generatedFiles = [];
    }

    public on(type: PHASE_TYPES | FILE_STRUCTURE_TYPES, callback: (data: any) => void) {
        if (!this.eventHandlers.has(type)) this.eventHandlers.set(type, []);
        this.eventHandlers.get(type)!.push(callback);
    }

    private emit(type: PHASE_TYPES | FILE_STRUCTURE_TYPES, data?: any, system_message?: Message) {
        const handlers = this.eventHandlers.get(type);
        if (handlers) handlers.forEach((fn) => fn({ data, systemMessage: system_message }));
    }

    public feed(chunk: string, system_message: Message) {
        this.buffer += chunk;
        this.processBuffer(system_message);
    }

    private async processBuffer(system_message: Message) {
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed && !this.insideCodeBlock) continue;

            const phaseMatch = trimmed.match(/<phase>(.*?)<\/phase>/);
            if (phaseMatch && !this.insideCodeBlock) {
                const phase = phaseMatch[1].trim();

                switch (phase) {
                    case 'thinking':
                        this.currentPhase = phase;
                        this.emit(PHASE_TYPES.THINKING, { phase }, system_message);
                        break;
                    case 'generating':
                        this.currentPhase = phase;
                        this.emit(PHASE_TYPES.GENERATING, { phase }, system_message);
                        break;
                    case 'building':
                        this.currentPhase = phase;
                        this.emit(PHASE_TYPES.BUILDING, { phase }, system_message);
                        break;
                    case 'creating_files':
                        this.currentPhase = phase;
                        this.emit(PHASE_TYPES.CREATING_FILES, { phase }, system_message);
                        break;
                    case 'complete':
                        this.currentPhase = phase;
                        this.emit(PHASE_TYPES.COMPLETE, { phase }, system_message);
                        break;
                    default:
                        this.handleError(new Error('Invalid phase'));
                }

                continue;
            }

            const fileMatch = trimmed.match(/<file>(.*?)<\/file>/);
            if (fileMatch && !this.insideCodeBlock) {
                const filePath = fileMatch[1].trim();
                this.currentFile = filePath;
                this.emit(
                    FILE_STRUCTURE_TYPES.EDITING_FILE,
                    {
                        file: filePath,
                        phase: this.currentPhase,
                    },
                    system_message,
                );
                continue;
            }

            if (trimmed.startsWith('```')) {
                if (this.insideCodeBlock) {
                    if (this.isJsonBlock && this.currentPhase === 'complete') {
                        try {
                            const parsed = JSON.parse(this.currentCodeBlock.trim());
                            system_message = await prisma.message.update({
                                where: {
                                    id: system_message.id,
                                },
                                data: {
                                    systemType: SystemMessageType.BUILD_COMPLETE,
                                    content: 'working on your command',
                                },
                            });
                        } catch (e) {
                            this.handleError(new Error('Invalid JSON structure format'));
                        }
                    } else if (this.currentFile) {
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

            // Accumulate code block content
            if (this.insideCodeBlock) {
                this.currentCodeBlock += line + '\n';
                continue;
            }
        }
    }

    public getGeneratedFiles(): FileContent[] {
        return this.generatedFiles;
    }

    public reset() {
        this.buffer = '';
        this.currentFile = null;
        this.currentPhase = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
        this.isJsonBlock = false;
        this.generatedFiles = [];
    }

    public handleError(err: Error) {
        this.emit(PHASE_TYPES.ERROR, { message: err.message });
    }
}
