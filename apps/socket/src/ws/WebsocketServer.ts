import WebSocket, { WebSocketServer as WSServer } from "ws";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/auth_user";
import { IncomingMessage } from "http";
import { env } from "../configs/env.config";
import { CustomWebSocket } from "../types/socket_types";

export default class WebSocketServer {
  private wss: WSServer;
  private connection_mapping: Map<string, CustomWebSocket> = new Map();

  constructor() {
    this.wss = new WSServer({ port: 8081 });
    this.init_connection();
  }

  private init_connection() {
    logger.info("websocket server init");
    this.wss.on("connection", (ws: CustomWebSocket, req: IncomingMessage) => {
      const authUser = this.handle_authorization(ws, req);
      if (authUser) {
        this.handle_connection(ws, req);
      }
    });
  }

  private handle_connection(ws: CustomWebSocket, req: IncomingMessage) {
    try {
      const url = new URL(req.url || "", `ws://${req.headers.host}`);
      const contractId = url.searchParams.get("contractId");

      if (!contractId) {
        ws.close(4003, "Missing contractId in query parameters");
        logger.error("ContractId not provided in connection request");
        return;
      }

      const pod_key = this.get_pod_name(ws.user.id, contractId);

      this.connection_mapping.set(pod_key, ws);
      ws.send("connected");

      ws.on("close", (code: number, reason: Buffer) => {
        this.connection_mapping.delete(pod_key);
      });

      ws.on("error", (error: Error) => {
        this.connection_mapping.delete(pod_key);
      });
    } catch (err) {
      logger.error("Error in handle_connection:", err);
      ws.close(4000, "Internal server error");
    }
  }

  private handle_authorization(
    ws: CustomWebSocket,
    req: IncomingMessage,
  ): boolean {
    try {
      const url = new URL(
        req.url || "",
        `ws://${req.headers.host || "localhost"}`,
      );
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close(4001, "Missing token in query parameters");
        logger.error("Token not provided in connection URL");
        return false;
      }

      const verified_token = jwt.verify(
        token,
        env.SOCKET_JWT_SECRET,
      ) as AuthUser;

      if (!verified_token || !verified_token.id) {
        ws.close(4002, "Unauthorized: Invalid token");
        logger.error("Invalid or malformed token");
        return false;
      }
      ws.user = verified_token;
      return true;
    } catch (err) {
      logger.error("Error while authenticating:", err);
      ws.close(4002, "Authentication failed");
      return false;
    }
  }

  private get_pod_name(userId: string, contractId: string) {
    return `anchor-pod-template-${userId}-${contractId}`
      .toLowerCase()
      .substring(0, 63);
  }

  public send_to_connection(
    userId: string,
    contractId: string,
    message: any,
  ): boolean {
    const key = this.get_pod_name(userId, contractId);
    const ws = this.connection_mapping.get(key);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }

    return false;
  }
}
