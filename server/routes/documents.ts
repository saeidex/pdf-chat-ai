import {
    getDocumentById,
    getDocumentsByUserId,
    updateDocumentAccessTime,
} from "@/server/db/services/documentService";
import { findOrCreateUser } from "@/server/db/services/userService";
import { createRouter } from "@/server/lib/create-app";

const router = createRouter()
    .get("/documents", async (c) => {
        const userId = c.var.clerkAuth?.userId;

        if (!userId) {
            throw new Error("User authentication required");
        }

        await findOrCreateUser(userId);

        const documents = await getDocumentsByUserId(userId);
        return c.json(documents);
    })
    .get("/documents/:id", async (c) => {
        const documentId = c.req.param("id");
        const userId = c.var.clerkAuth?.userId;

        if (!userId) {
            return c.json({ message: "User authentication required" }, 401);
        }

        await findOrCreateUser(userId);

        const document = await getDocumentById(documentId);

        if (!document) {
            return c.json({ error: "Document not found" }, 404);
        }

        if (document.userId !== userId) {
            throw new Error(
                "You don't have permission to access this document"
            );
        }

        await updateDocumentAccessTime(documentId);

        return c.json(document);
    });

export default router;
