import { FileContent } from '../types/content_types';
import { STREAM_EVENT_ENUM } from '../types/stream_event_types';

export default class StreamParser {
    private buffer: string;
    private currentPhase: string | null;
    private currentFile: string | null;
    private currentCodeBlock: string;
    private insideCodeBlock: boolean;
    private isJsonBlock: boolean;
    private eventHandlers: Map<STREAM_EVENT_ENUM, ((data: any) => void)[]> = new Map();
    private generatedFiles: FileContent[] = [];

    constructor() {
        this.buffer = '';
        this.currentPhase = null;
        this.currentFile = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
        this.isJsonBlock = false;
        this.generatedFiles = [];
        this.emit(STREAM_EVENT_ENUM.START);
    }

    public on(type: STREAM_EVENT_ENUM, callback: (data: any) => void) {
        if (!this.eventHandlers.has(type)) this.eventHandlers.set(type, []);
        this.eventHandlers.get(type)!.push(callback);
    }

    private emit(type: STREAM_EVENT_ENUM, data?: any) {
        const handlers = this.eventHandlers.get(type);
        if (handlers) handlers.forEach((fn) => fn(data));
    }

    public feed(chunk: string) {
        this.buffer += chunk;
        this.processBuffer();
    }

    private processBuffer() {
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();

            // Only skip completely empty lines when NOT inside code block
            if (!trimmed && !this.insideCodeBlock) continue;

            // Detect phase tags (these should be trimmed)
            const phaseMatch = trimmed.match(/<phase>(.*?)<\/phase>/);
            if (phaseMatch) {
                const phase = phaseMatch[1].trim();
                this.currentPhase = phase;
                this.emit(STREAM_EVENT_ENUM.PHASE, { phase });
                continue;
            }

            // Detect file tags (these should be trimmed)
            const fileMatch = trimmed.match(/<file>(.*?)<\/file>/);
            if (fileMatch) {
                const filePath = fileMatch[1].trim();
                this.currentFile = filePath;
                this.emit(STREAM_EVENT_ENUM.EDITING_FILE, {
                    file: filePath,
                    phase: this.currentPhase,
                });
                continue;
            }

            // Handle code block delimiters
            if (trimmed.startsWith('```')) {
                if (this.insideCodeBlock) {
                    // End of code block
                    if (this.isJsonBlock && this.currentPhase === 'complete') {
                        // Handle JSON file structure
                        try {
                            const parsed = JSON.parse(this.currentCodeBlock.trim());
                            this.emit(STREAM_EVENT_ENUM.FILE_STRUCTURE, parsed);
                            this.emit(STREAM_EVENT_ENUM.COMPLETE, {
                                files: this.generatedFiles,
                                structure: parsed,
                            });
                        } catch {
                            this.handleError(new Error('Invalid JSON structure format'));
                        }
                    } else if (this.currentFile) {
                        // Handle regular code file
                        const content = this.currentCodeBlock.trimEnd();

                        // Store file content
                        this.generatedFiles.push({
                            path: this.currentFile,
                            content: content,
                        });

                        // Emit context event
                        this.emit(STREAM_EVENT_ENUM.CONTEXT, {
                            phase: this.currentPhase,
                            file: this.currentFile,
                            content: content,
                        });
                    }

                    this.insideCodeBlock = false;
                    this.isJsonBlock = false;
                    this.currentCodeBlock = '';
                } else {
                    // Start of code block
                    this.insideCodeBlock = true;
                    this.isJsonBlock = trimmed.startsWith('```json');
                    this.currentCodeBlock = '';
                }
                continue;
            }

            // Inside code block - preserve original line INCLUDING indentation
            if (this.insideCodeBlock) {
                this.currentCodeBlock += line + '\n';
                continue;
            }
        }
    }

    public getGeneratedFiles(): FileContent[] {
        return this.generatedFiles;
    }

    public complete() {
        this.emit(STREAM_EVENT_ENUM.COMPLETE, {
            files: this.generatedFiles,
        });
        this.reset();
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
        this.emit(STREAM_EVENT_ENUM.ERROR, { message: err.message });
    }
}
