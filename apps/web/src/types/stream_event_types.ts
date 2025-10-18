import { Message } from "@repo/database";

enum FILE_STRUCTURE_TYPES {
    EDITING_FILE = 'EDITING_FILE',
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

type StreamEventData =
    | StartingData
    | ThinkingData
    | GeneratingData
    | EditingFileData
    | BuildingData
    | CreatingFilesData
    | CompleteData
    | ErrorData;

export interface StreamEvent {
    type: PHASE_TYPES | FILE_STRUCTURE_TYPES;
    data: StreamEventData;
    systemMessage: Message;
    timestamp: number;
}