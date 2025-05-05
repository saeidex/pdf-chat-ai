import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createRouter } from "../lib/create-app";

const chatSchema = z.object({
    body: z.string(),
});

const router = createRouter()
    .get("/chats", (c) => {
        return c.json({ message: "Hello from chat route!" });
    })
    .post("/chats", zValidator("form", chatSchema), async (c) => {
        const { body } = c.req.valid("form");
        const result = chatSchema.safeParse({ body });

        if (!result.success) {
            return c.json({ error: result.error.format() }, 400);
        }

        // Here you would typically handle the chat message, e.g., save it to a database
        return c.json({ message: "Chat message received!", data: result.data });
    });

export default router;
