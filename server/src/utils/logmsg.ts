import {Request} from "express";
import {AuthenticatedSocket} from "../socket/middleware/authentication";

export enum LogType {
    DB = "DB", START = "START", HTTP = "HTTP", AUTH = "AUTH", SOCKET = "SOCKET"
}

export enum LogStatus {
    SUCCESS = "SUCCESS", ERROR = "ERROR", FAILED = "FAILED", WARNING = "WARNING"
}

export default function logmsg(type: LogType, status: LogStatus, msg: string) {
    console.log(`${new Date().toISOString().substring(11, 19)} ${type}-${status}\t: ${msg}`);
}

export function loghttp(req: Request, status: LogStatus, params?: Object, msg?: string) {
    logmsg(LogType.HTTP, status, `${req.originalUrl} ${params ? " | " + JSON.stringify(params) : ""}${msg ? " | " + msg : ""}`);
}

export function logsocket(socket: AuthenticatedSocket, status: LogStatus, params?: Object, msg?: string) {
    logmsg(LogType.SOCKET, status, `${socket.decryptedToken?.account_id} ${params ? " | " + JSON.stringify(params) : ""}${msg ? " | " + msg : ""}`);
}