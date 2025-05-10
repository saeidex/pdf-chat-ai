import { pinoLogger as _pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
import env from "@/server/env";

export function pinoLogger() {
    return _pinoLogger({
        pino: pino(
            {
                level: env.LOG_LEVEL || "info",
            },
            env.NODE_ENV === "production" ? undefined : pretty()
        ),
    });
}
