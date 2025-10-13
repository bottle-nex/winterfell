export type StreamEventType =
    | 'START'
    | 'CONTEXT'
    | 'EDITING_FILE'
    | 'PHASE'
    | 'FILE_STRUCTURE'
    | 'COMPLETE'
    | 'ERROR';

export enum STREAM_EVENT_ENUM {
    START = 'START',
    CONTEXT = 'CONTEXT',
    EDITING_FILE = 'EDITING_FILE',
    PHASE = 'PHASE',
    FILE_STRUCTURE = 'FILE_STRUCTURE',
    COMPLETE = 'COMPLETE',
    ERROR = 'ERROR',
}

export interface StreamEvent<T = any> {
    type: StreamEventType;
    data: T;
    timestamp: number;
}

// event-data types
export interface StartEventData {
    messageId: string;
    chatId: string;
    contractId: string;
}
