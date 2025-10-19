import { Message } from '@repo/database';

export enum FILE_STRUCTURE_TYPES {
    EDITING_FILE = 'EDITING_FILE',
}

export interface FileContent {
    path: string;
    content: string;
} 

export enum STAGE {
    START = 'START',
    CONTEXT = 'CONTEXT',
    PLANNING = 'PLANNING',
    GENERATING_CODE = 'GENERATING_CODE',
    BUILDING = 'BUILDING',
    CREATING_FILES = 'CREATING_FILES',
    FINALIZING = 'FINALIZING',
    END = 'END',
}

export enum PHASE_TYPES {
    STARTING = 'STARTING',
    THINKING = 'THINKING',
    GENERATING = 'GENERATING',
    BUILDING = 'BUILDING',
    CREATING_FILES = 'CREATING_FILES',
    COMPLETE = 'COMPLETE',
    ERROR = 'ERROR',
}

export interface ThinkingData {
    phase: 'thinking';
}

export interface StartingData {
    phase: 'starting';
    messageId?: string;
    chatId?: string;
    contractId?: string;
    timestamp?: number;
}

export interface ContextData {
    context: string;
}

export interface StageData {
    stage: string;
}

interface GeneratingData {
    phase: 'generating';
}

interface EditingFileData {
    file: string;
    phase: string;
}

interface BuildingData {
    phase: 'building';
}

interface CreatingFilesData {
    phase: 'creating_files';
}

interface CompleteData {
    phase: 'complete';
}

interface ErrorData {
    message: string;
    error?: string;
}

export interface EndData {
    data: FileContent[];
}

export type StreamEventData =
    | StartingData
    | ContextData
    | StageData
    | ThinkingData
    | GeneratingData
    | EditingFileData
    | BuildingData
    | CreatingFilesData
    | CompleteData
    | ErrorData;

// check it once -> try switching to single type, not this many
export interface Stream_Event_Data {
    type: string;
}

export interface StreamEvent {
    type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE;
    data: StreamEventData;
    systemMessage: Message;
    timestamp: number;
}
