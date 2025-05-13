export interface Message {
    id: string;
    content: string;
    createdAt: string;
    chatId: string | null;
    messageGroupId: string | null;
    role: "USER" | "ASSISTANT" | "SYSTEM";
}
