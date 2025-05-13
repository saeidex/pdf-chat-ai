import { User } from "@prisma/client";

import prisma from "../prismaClient";

/**
 * Finds a user by ID or creates one if it doesn't exist
 * This is particularly useful for integrating with Clerk authentication
 */
export async function findOrCreateUser(id: string): Promise<User> {
    const existingUser = await prisma.user.findUnique({
        where: { id },
    });

    if (existingUser) {
        return existingUser;
    }

    return prisma.user.create({
        data: {
            id,
        },
    });
}

export async function getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { id },
    });
}

export async function getUserWithDocuments(id: string) {
    return prisma.user.findUnique({
        where: { id },
        include: {
            documents: {
                orderBy: {
                    lastAccessedAt: "desc",
                },
            },
        },
    });
}

export async function getUserWithChats(id: string) {
    return prisma.user.findUnique({
        where: { id },
        include: {
            chats: {
                orderBy: {
                    updatedAt: "desc",
                },
                include: {
                    document: true,
                    messages: {
                        take: 1,
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                },
            },
        },
    });
}

export async function updateUser(
    id: string,
    data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
): Promise<User> {
    return prisma.user.update({
        where: { id },
        data,
    });
}
