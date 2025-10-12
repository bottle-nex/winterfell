export enum MessageRoleEnum {
  USER = "USER",
  AI = "AI",
  SYSTEM = "SYSTEM",
}

export enum AIStreamEventEnum {
  CONTEXT = "CONTEXT",
  MESSAGE = "MESSAGE",
  CODE = "CODE",
  FILE_STRUCTURE = "FILE_STRUCTURE",
  STATUS = "STATUS",
  COMPLETE = "COMPLETE",
  ERROR = "ERROR",
}

export enum StatusUpdateEnum {
  THINKING = "THINKING",
  GENERATING = "GENERATING",
  ANALYZING = "ANALYZING",
  BUILDING = "BUILDING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export interface Message {
  id: string;
  chatId: string;
  role: MessageRoleEnum;
  content: string;
  createdAt: Date;
  metadata?: MessageMetaData;
}

export interface MessageMetaData {
  isStreaming?: boolean;
  isComplete?: boolean;

  hasCode?: boolean;
  hasContext?: boolean;
  hasFileStructure?: boolean;

  error?: string;
}

export interface AIStreamEvent {
  type: AIStreamEventEnum;
  data: any;
  timestamp: number;
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
  description?: string;
}

export interface ContextData {
  content: string; // content bw tags
  action: string; // state responses
}

export interface FileNode {
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string;
  language?: string;
  children?: FileNode[];
}

export interface FileStructure {
  root: FileNode;
  files: Map<string, string>; // path -> content
}

export interface StatusUpdate {
  stage: StatusUpdateEnum;
  message: string;
  progress?: number; // out of 100
}

// <-------------------------------- PARSED AI RESPONSE ---------------------------------->

export interface ParsedAIResponse {
  context?: ContextData;
  message: string;
  codeblock?: CodeBlock[];
  fileStructure: FileStructure;
  status?: StatusUpdate;
  error?: string;
}

// <-------------------------------- CHAT MESSAGE TYEPS ---------------------------------->

export interface ChatState {}
