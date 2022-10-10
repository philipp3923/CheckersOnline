import {PrismaClient} from "@prisma/client";
import logmsg, {LogStatus, LogType} from "../utils/logmsg";

const prisma = new PrismaClient();

logmsg(LogType.DB, LogStatus.SUCCESS, "loaded");

export default prisma;