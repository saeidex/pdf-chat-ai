import { createChat, getChatsByDocID } from "@/server/db/services/chatService";
import {
    getDocumentById,
    updateDocumentAccessTime,
} from "@/server/db/services/documentService";
import {
    createMessage,
    updateMessage,
} from "@/server/db/services/messageService";
import { findOrCreateUser } from "@/server/db/services/userService";
import { createChatCompletions } from "@/server/lib/ai/chat-completions";
import { defaultSystemPrompt } from "@/server/lib/ai/default-system-prompt";
import { createRouter } from "@/server/lib/create-app";
import { getPdfContentFromUrl } from "@/server/lib/pdf";
import { zValidator } from "@hono/zod-validator";
import { Role } from "@prisma/client";
import { stream } from "hono/streaming";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";

const router = createRouter()
    .get(
        "/chats/:docId",
        zValidator(
            "param",
            z.object({
                docId: z.string().min(1, "Document ID is required"),
            })
        ),
        async (c) => {
            const { docId } = c.req.valid("param");
            const userId = c.var.clerkAuth?.userId;

            const document = await getDocumentById(docId);

            if (!document) {
                throw new Error("Document not found");
            }

            if (document.userId !== userId) {
                throw new Error("Access denied");
            }

            const chats = await getChatsByDocID(docId, userId);

            return c.json(chats);
        }
    )
    .post(
        "/chats",
        zValidator(
            "form",
            z.object({
                prompt: z.string().min(1, "Prompt is required"),
                docUrl: z.string().url("Invalid URL"),
                docId: z.string(),
                chatId: z.string().optional(),
            })
        ),
        async (c) => {
            const { prompt, docUrl, docId, chatId } = c.req.valid("form");
            const userId = c.var.clerkAuth?.userId;

            await findOrCreateUser(userId!);

            await updateDocumentAccessTime(docId);

            const document = await getDocumentById(docId);

            if (!document) {
                throw new Error("Document not found");
            }

            if (document.userId !== userId) {
                throw new Error(
                    "You don't have permission to access this document"
                );
            }
            const existingChat = await getChatsByDocID(docId, userId);

            const chat =
                existingChat ||
                (await createChat({
                    userId,
                    documentId: docId,
                    title: prompt.substring(0, 50),
                }));

            await createMessage({
                content: prompt,
                role: Role.USER,
                chatId: chat.id,
            });

            const context = await getPdfContentFromUrl(docUrl);

            if (!context) {
                c.var.logger.warn(
                    "No relevant documents found in Azure AI Search."
                );
                throw new Error(
                    "No relevant information found to answer your query."
                );
            }

            const messages: ChatCompletionMessageParam[] = [
                {
                    role: "system",
                    content: `${defaultSystemPrompt}\n\nContext from PDF: ${context}`,
                },
                { role: "user", content: prompt },
            ];

            const assistantMessage = await createMessage({
                content: "",
                role: Role.ASSISTANT,
                chatId: chat.id,
            });

            const response = await createChatCompletions(messages);

            return stream(c, async (stream) => {
                stream.onAbort(() => {
                    stream.close();
                });

                let fullResponse = "";

                for await (const part of response) {
                    const content = part.choices[0]?.delta?.content || "";
                    fullResponse += content;
                    await stream.write(content);
                    await stream.sleep(30);
                }

                await updateMessage(assistantMessage.id, fullResponse);

                await stream.writeln("");
                await stream.close();
            });
        }
    );

export default router;
