import { STREAM_EVENT_ENUM } from '../types/StreamEventTypes';

export default class StreamParser {
    private buffer: string;
    private currentPhase: string | null;
    private currentFile: string | null;
    private currentCodeBlock: string;
    private insideCodeBlock: boolean;
    private eventHandlers: Map<STREAM_EVENT_ENUM, ((data: any) => void)[]> = new Map();

    constructor() {
        this.buffer = '';
        this.currentPhase = null;
        this.currentFile = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
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

    // this will called when to append some chunk
    public feed(chunk: string) {
        this.buffer += chunk;
        this.processBuffer();
    }

    private processBuffer() {
        const lines = this.buffer.split('\n');
        this.buffer = '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // this detects the current phase of the process
            const phaseMatch = trimmed.match(/<phase>(.*?)<\/phase>/);
            if (phaseMatch) {
                const phase = phaseMatch[1].trim();
                this.currentPhase = phase;
                this.emit(STREAM_EVENT_ENUM.PHASE, { phase });
                continue;
            }

            // this detects current operating file
            const fileMatch = trimmed.match(/<file>(.*?)<\/file>/);
            if (fileMatch) {
                const file = fileMatch[1].trim();
                this.currentFile = file;
                this.emit(STREAM_EVENT_ENUM.EDITING_FILE, { file, phase: this.currentPhase });
                continue;
            }

            // this will handle any code block, can be removed if not needed
            if (trimmed.startsWith('```')) {
                if (!this.insideCodeBlock) {
                    this.insideCodeBlock = true;
                    this.currentCodeBlock = '';
                } else {
                    this.insideCodeBlock = false;
                    this.emit(STREAM_EVENT_ENUM.CONTEXT, {
                        phase: this.currentPhase,
                        file: this.currentFile,
                        content: this.currentCodeBlock.trim(),
                    });
                    this.currentCodeBlock = '';
                }
                continue;
            }

            if (this.insideCodeBlock) {
                this.currentCodeBlock += trimmed + '\n';
                continue;
            }

            if (trimmed.startsWith('```json')) {
                this.insideCodeBlock = true;
                this.currentCodeBlock = '';
            }

            // complete phase
            if (trimmed === '```' && this.currentPhase === 'complete') {
                try {
                    const parsed = JSON.parse(this.currentCodeBlock);
                    this.emit(STREAM_EVENT_ENUM.FILE_STRUCTURE, parsed);
                    this.emit(STREAM_EVENT_ENUM.COMPLETE, parsed);
                } catch (error) {
                    this.handleError(new Error('Invalid data format found!'));
                }
                this.currentCodeBlock = '';
                this.insideCodeBlock = false;
                continue;
            }

            if (this.insideCodeBlock && this.currentPhase === 'complete') {
                this.currentCodeBlock += trimmed + '\n';
                continue;
            }
        }
    }

    public complete() {
        this.emit(STREAM_EVENT_ENUM.COMPLETE, {});
        this.reset();
    }

    public reset() {
        this.buffer = '';
        this.currentFile = null;
        this.currentPhase = null;
        this.currentCodeBlock = '';
        this.insideCodeBlock = false;
    }

    public handleError(err: Error) {
        this.emit(STREAM_EVENT_ENUM.ERROR, { message: err.message });
    }
}
