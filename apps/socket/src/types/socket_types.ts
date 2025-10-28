import WebSocket from "ws";
import { AuthUser } from "./auth_user";

export interface CustomWebSocket extends WebSocket {
    user: AuthUser
}