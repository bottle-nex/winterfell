export enum NODE {
    FILE = 'FILE',
    FOLDER = 'FOLDER',
}

export interface FileNode {
    name: string;
    type: NODE;
    path: string;
    content?: string;
    language?: string;
    children?: FileNode[];
}

export enum STAGE {
    THINKING = 'THINKING',
    ANALYZING = 'ANALYZING',
    GENERATING = 'GENERATING',
    STRUCTURING = 'STRUCTURING',
    BUILDING = 'BUILDING',
    COMPLETE = 'COMPLETE',
    ERROR = 'ERROR',
}

export interface ContextEventData {
    content: string; // actual context text
    action: string;
}

export interface FileStructureEventData {
    root: FileNode;
    files: Record<string, string>;
}

export interface StatusEventData {
    stage: STAGE;
    message: string;
    progress?: number;    // 0-100
}

export interface CompleteEventData {
    fullResponse: string;
    totalCodeBlocks: number;
}