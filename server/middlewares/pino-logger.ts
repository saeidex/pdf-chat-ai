import { logger } from "@/server/lib/logger";
import { pinoLogger as _pinoLogger } from "hono-pino";

export function pinoLogger() {
    return _pinoLogger({
        pino: logger,
    });
}
