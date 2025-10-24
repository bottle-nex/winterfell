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
    START = 'START', // this is just to mention that the work has started
    CONTEXT = 'CONTEXT', // this is just for having context, not an actual stage
    PLANNING = 'PLANNING',
    GENERATING_CODE = 'GENERATING_CODE',
    BUILDING = 'BUILDING',
    CREATING_FILES = 'CREATING_FILES',
    FINALIZING = 'FINALIZING',
    END = 'END', // this is just to mention that the work has beed completed
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
    progress?: number; // 0-100
}

export interface CompleteEventData {
    fullResponse: string;
    totalCodeBlocks: number;
}

export interface FileContent {
    path: string;
    content: string;
}
