import { Message } from '@repo/database';
import { FileContent, STAGE } from './content_types';

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
    stage: 'starting';
    messageId?: string;
    contractId?: string;
    timestamp?: number;
}

export interface ContextData {
    context: string;
    llmMessage: Message;
}

export interface StageData {
    stage: string;
}

export interface GeneratingData {
    phase: 'editing file';
}

export interface EditingFileData {
    file: string;
    phase: string;
}

export interface BuildingData {
    phase: 'building';
}

export interface CreatingFilesData {
    phase: 'creating_files';
}

export interface CompleteData {
    phase: 'complete';
}

export interface ErrorData {
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
    | EndData
    | ErrorData;

export interface StreamEvent {
    type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE;
    data: StreamEventData;
    systemMessage: Message;
    timestamp: number;
}

export function isThinkingData(data: StreamEventData): data is ThinkingData {
    return 'phase' in data && data.phase === 'thinking';
}

export function isGeneratingData(data: StreamEventData): data is GeneratingData {
    return 'phase' in data && data.phase === 'generating';
}

export function isEditingFileData(data: StreamEventData): data is EditingFileData {
    return 'file' in data;
}

export function isBuildingData(data: StreamEventData): data is BuildingData {
    return 'phase' in data && data.phase === 'building';
}

export function isCreatingFilesData(data: StreamEventData): data is CreatingFilesData {
    return 'phase' in data && data.phase === 'creating_files';
}

export function isCompleteData(data: StreamEventData): data is CompleteData {
    return 'phase' in data && data.phase === 'complete';
}

export function isErrorData(data: StreamEventData): data is ErrorData {
    return 'message' in data && typeof data.message === 'string';
}
