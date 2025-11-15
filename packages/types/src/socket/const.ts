export type WebSocketPayloadType = "RUN_COMMAND";

export enum TerminalSocketData {
  INFO = "INFO",
  lOGS = "lOGS",
  BUILD_ERROR = "ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
}

export interface WSServerIncomingPayload<T> {
  type: TerminalSocketData;
  payload: T;
}
