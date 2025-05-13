import { pinoLogger } from "@/server/middlewares/pino-logger";
import { Hono, type Schema } from "hono";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import type { AppBindings } from "./types";

export function createRouter() {
    return new Hono<AppBindings>();
}

export default function createApp() {
    const app = createRouter().basePath("/api");
    app.use(requestId()).use(serveEmojiFavicon("📄")).use(pinoLogger());

    app.notFound(notFound);
    app.onError(onError);
    return app;
}
