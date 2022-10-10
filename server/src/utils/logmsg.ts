import {Request} from "express";

export enum LogType {
    DB = "DB", START = "START", HTTP = "HTTP", AUTH = "AUTH",
}

export enum LogStatus {
    SUCCESS="SUCCESS", ERROR="ERROR", FAILED="FAILED", WARNING="WARNING"
}

export default function logmsg(type: LogType, status: LogStatus, msg: string) {
    console.log(`${new Date().toISOString().substring(11, 19)} ${type}-${status}\t: ${msg}`);
}

export function loghttp(req: Request, status: LogStatus, params: Object, msg?: string){
    logmsg(LogType.HTTP, status, `${req.originalUrl} | ${JSON.stringify(params)}${msg ? " | "+msg : ""}`);
}