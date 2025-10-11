export type StreamEventType =
    | 'start'   // initial connextion establish
    | 'context' // context extracted
    | 'message_chunk'   // message chunk
    | 'code_block'  // code block extracted
    | 'file_structure'
    | 'status'  // status update
    | 'complete'    // stream finish
    | 'error';

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

export interface ContextEventData {
    content: string; // actual context text
    action: string;
}

export interface MessageChunkEventData {
    content: string;
    isPartial: boolean;
}

export interface CodeBlockEventData {
    language: string;
    code: string;
    filename?: string;
    startIndex: number;
    endIndex: number;
}

export interface FileStructureEventData {
    root: FileNode;
    files: Record<string, string>;
}

export interface StatusEventData {
    stage: 'thinking' | 'analyzing' | 'generating' | 'building' | 'complete' | 'error';
    message: string;
    progress?: number;    // 0-100
}

export interface CompleteEventData {
    fullResponse: string;
    totalCodeBlocks: number;
}

export interface ErrorEventData {
    message: string;
    error?: string;
    stack?: string;
}

// file-structure types

export interface FileNode {
    name: string;
    type: 'file' | 'folder';
    path: string;
    content?: string;
    language?: string;
    children?: FileNode[];
}

export interface FileStructure {
    root: FileNode;
    files: Record<string, string>; // map of path -> content for quick access
}

// anchor project structure

export interface AnchorProjectFiles {
    'Anchor.toml': string;
    'Cargo.toml': string;
    [key: `programs/${string}/Cargo.toml`]: string;
    [key: `programs/${string}/src/lib.rs`]: string;
    [key: `tests/${string}.ts`]: string;
}

// parse-configs

export interface ParserConfig {
    enableContextExtraction?: boolean;
    enableCodeBlockExtraction?: boolean;
    enableFileStructureGeneration?: boolean;
    enableStatusDetection?: boolean;
    projectName?: string;
}

// parser state

export interface ParserState {
    buffer: string;
    contextSent: boolean;
    codeBlocksSent: Set<string>;
    lastMessageLength: number;
}

export interface CodeBlockMatch {
    fullMatch: string;
    language: string;
    code: string;
    index: number;
}

export interface ContextMatch {
    fullMatch: string;
    content: string;
    index: number;
}

export interface MessageRecord {
    id: string;
    chatId: string;
    role: 'USER' | 'AI' | 'SYSTEM';
    content: string;
    createdAt: Date;
}

export interface ChatRecord {
    id: string;
    userId: string;
    contractId: string;
    messages: MessageRecord[];
}

export interface ContractRecord {
    id: string;
    title: string;
    description: string;
    code: string;
    contractType: string;
    version: number;
    userId: string;
}

//parser types

export interface StreamEvent<T> {
    type: 'start' | 'context' | 'message_chunk' | 'code_block' | 'file_structure' | 'status' | 'complete' | 'error';
    data: T;
    timestamp: number;
}

export interface ContextData {
    content: string;
    action: string;
}

export interface CodeBlock {
    language: string;
    code: string;
    filename?: string;
    startIndex: number;
    endIndex: number;
}

export interface FileNode {
    name: string;
    type: 'file' | 'folder';
    path: string;
    content?: string;
    language?: string;
    children?: FileNode[];
}

export interface FileStructure {
    root: FileNode;
    files: Record<string, string>; // path -> content
}

export interface StatusUpdate {
    stage: 'thinking' | 'analyzing' | 'generating' | 'building' | 'complete' | 'error';
    message: string;
    progress?: number;
}

// req-res types

export interface SendMessageRequest {
    message: string;
}

export interface SendMessageResponse {
    success: boolean;
    chatId?: string;
    messageId?: string;
    error?: string;
}

export function isStreamEvent(obj: any): obj is StreamEvent {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'type' in obj &&
        'data' in obj &&
        'timestamp' in obj
    );
}

export function isCodeBlockEvent(event: StreamEvent): event is StreamEvent<CodeBlockEventData> {
    return event.type === 'code_block';
}

export function isContextEvent(event: StreamEvent): event is StreamEvent<ContextEventData> {
    return event.type === 'context';
}

export function isErrorEvent(event: StreamEvent): event is StreamEvent<ErrorEventData> {
    return event.type === 'error';
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};




