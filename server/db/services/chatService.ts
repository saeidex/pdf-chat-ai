import { Chat } from "@prisma/client";

import prisma from "../prismaClient";

interface CreateChatParams {
    userId: string;
    documentId: string;
    title?: string;
}

interface GetUserChatsParams {
    userId: string;
    documentId?: string;
    limit: number;
    offset: number;
}

export async function createChat(params: CreateChatParams): Promise<Chat> {
    return prisma.chat.create({
        data: {
            userId: params.userId,
            documentId: params.documentId,
            title: params.title || "New Chat",
        },
    });
}

export async function getChatById(id: string, userId: string) {
    return prisma.chat.findFirst({
        where: {
            id,
            userId,
        },
    });
}

export async function getChatWithMessages(id: string, userId: string) {
    return prisma.chat.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            document: true,
        },
    });
}

export async function getUserChats(params: GetUserChatsParams) {
    const { userId, documentId, limit, offset } = params;

    return prisma.chat.findMany({
        where: {
            userId,
            ...(documentId ? { documentId } : {}),
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
            document: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
        skip: offset,
        take: limit,
    });
}

export const getChatsByDocID = async (docId: string, userId: string) => {
    return prisma.chat.findFirst({
        where: {
            documentId: docId,
            userId,
        },
        include: {
            messages: true,
        },
    });
};

export async function updateChatTitle(id: string, title: string) {
    return prisma.chat.update({
        where: { id },
        data: { title },
    });
}

export async function deleteChat(id: string) {
    return prisma.chat.delete({
        where: { id },
    });
}
