export type StreamEventType =
    | 'START'
    | 'CONTEXT'
    | 'EDITING_FILE'
    | 'PHASE'
    | 'FILE_STRUCTURE'
    | 'COMPLETE'
    | 'ERROR';


export enum FILE_STRUCTURE_TYPES {
    EDITING_FILE = 'EDITING_FILE',
}

export enum PHASE_TYPES {
    THINKING = 'THINKING',
    GENERATING = 'GENERATING',
    BUILDING = 'BUILDING',
    CREATING_FILES = 'CREATING_FILES',
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
