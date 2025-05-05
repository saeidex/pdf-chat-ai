import { createMiddleware } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const authMiddleware = () =>
    createMiddleware(async (c, next) => {
        if (!c.var.clerkAuth?.userId) {
            return c.json(
                {
                    error: "Unauthorized",
                },
                HttpStatusCodes.UNAUTHORIZED
            );
        }

        await next();
    });
