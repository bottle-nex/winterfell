
export type StreamEventType =
    | 'START'
    | 'CONTEXT'
    | 'MESSAGE_CHUNK'
    | 'CODE_BLOCK'
    | 'FILE_STRUCTURE'
    | 'STATUS'
    | 'COMPLETE'
    | 'ERROR';

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

