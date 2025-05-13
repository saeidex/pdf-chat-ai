import { Message, Role } from "@prisma/client";

import prisma from "../prismaClient";

interface CreateMessageParams {
    content: string;
    role: Role;
    chatId?: string;
    messageGroupId?: string;
}

export async function createMessage(
    params: CreateMessageParams
): Promise<Message> {
    return prisma.message.create({
        data: {
            content: params.content,
            role: params.role,
            ...(params.chatId ? { chatId: params.chatId } : {}),
            ...(params.messageGroupId
                ? { messageGroupId: params.messageGroupId }
                : {}),
        },
    });
}

export async function updateMessage(
    id: string,
    content: string
): Promise<Message> {
    return prisma.message.update({
        where: { id },
        data: { content },
    });
}

export async function getMessagesByChat(chatId: string) {
    return prisma.message.findMany({
        where: {
            chatId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

export async function createMessageGroup(documentId: string) {
    return prisma.messageGroup.create({
        data: {
            documentId,
        },
    });
}

export async function getMessageGroupWithMessages(id: string) {
    return prisma.messageGroup.findUnique({
        where: { id },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
}
