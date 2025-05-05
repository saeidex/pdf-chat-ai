import { zValidator } from "@hono/zod-validator";
import { createRouter } from "../lib/create-app";
import { z } from "zod";

const router = createRouter()
    .get("/posts", (c) => {
        return c.json({
            message: "Hello from posts",
        });
    })
    .get(
        "/posts/:id",
        zValidator(
            "param",
            z.object({
                id: z.string().min(1),
            })
        ),
        (c) => {
            const { id } = c.req.param();
            return c.json({
                message: `Hello from posts ${id}`,
            });
        }
    );

export default router;
