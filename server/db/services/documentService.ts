import { Document } from "@prisma/client";

import prisma from "../prismaClient";

export async function createDocument(data: {
    id: string;
    name: string;
    blobName: string;
    containerName: string;
    mimeType: string;
    size: number;
    userId: string;
}): Promise<Document> {
    return prisma.document.create({
        data,
    });
}

export async function getDocumentsByUserId(userId: string) {
    return prisma.document.findMany({
        where: { userId },
        orderBy: { lastAccessedAt: "desc" },
    });
}

export async function getDocumentById(id: string) {
    return prisma.document.findUnique({
        where: { id },
    });
}

export async function getDocumentByBlobName(blobName: string) {
    return prisma.document.findFirst({
        where: { blobName },
    });
}

export async function updateDocumentAccessTime(id: string) {
    const document = await prisma.document.findUnique({
        where: { id },
    });

    if (!document) {
        return null;
    }

    return prisma.document.update({
        where: { id },
        data: { lastAccessedAt: new Date() },
    });
}

export async function deleteDocument(id: string) {
    return prisma.document.delete({
        where: { id },
    });
}
