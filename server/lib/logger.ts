import env from "@/server/env";
import pino from "pino";
import pretty from "pino-pretty";

export const logger = pino(
    {
        level: env.LOG_LEVEL || "info",
    },
    env.NODE_ENV === "production" ? undefined : pretty()
);
