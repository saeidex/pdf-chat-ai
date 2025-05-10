import { createRouter } from "@/server/lib/create-app";
import { zValidator } from "@hono/zod-validator";
import { stream } from "hono/streaming";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";
import { createChatCompletions } from "../lib/ai/chat-completions";
import { getPdfContentFromUrl } from "../lib/pdf";

const router = createRouter().post(
    "/chats",
    zValidator(
        "form",
        z.object({
            prompt: z.string(),
            docUrl: z.string().url(),
        })
    ),
    async (c) => {
        const { prompt, docUrl } = c.req.valid("form");

        const context = await getPdfContentFromUrl(docUrl);

        if (!context) {
            c.var.logger.warn(
                "No relevant documents found in Azure AI Search."
            );
            return c.json(
                {
                    message:
                        "No relevant information found to answer your query.",
                },
                404
            );
        }

        /*  const MAX_CONTEXT_LENGTH = 10000;
        const truncatedContext =
            context.length > MAX_CONTEXT_LENGTH
                ? context.substring(0, MAX_CONTEXT_LENGTH) +
                  "... [Content truncated due to length]"
                : context;
        */

        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `You are a helpful AI assistant specialized in answering questions about documents. 
        Use ONLY the following context to answer the user's question. If the information isn't in the context, admit that you don't know.
        Be concise, accurate, and provide direct references to relevant sections when possible.

        Context from PDF: ${context}`,
            },
            { role: "user", content: prompt },
        ];

        const response = await createChatCompletions(messages);

        return stream(c, async (stream) => {
            stream.onAbort(() => {
                stream.close();
            });
            for await (const part of response) {
                await stream.write(part.choices[0]?.delta?.content || "");
                await stream.sleep(30);
            }
            await stream.writeln("");
            await stream.close();
        });
    }
);

export default router;
