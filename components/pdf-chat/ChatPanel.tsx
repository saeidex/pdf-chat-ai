"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
    id: string;
    content: string;
    sender: "user" | "assistant";
    timestamp: Date;
}

interface ChatPanelProps {
    documentId: string;
    documentName: string;
}

export default function ChatPanel({
    documentId,
    documentName,
}: ChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            content: `Hello! I'm your PDF assistant. I'm ready to help you with "${documentName}". What would you like to know about this document?`,
            sender: "assistant",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of messages when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: inputValue.trim(),
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            // In a real app, you would call your API here
            // const response = await fetch('/api/chat', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ message: userMessage.content, documentId }),
            // });
            // const data = await response.json();

            // For demo purposes, we'll simulate a response
            setTimeout(() => {
                const botResponse: Message = {
                    id: `assistant-${Date.now()}`,
                    content: generateMockResponse(
                        userMessage.content,
                        documentName
                    ),
                    sender: "assistant",
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, botResponse]);
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            console.error("Error sending message:", error);
            setIsLoading(false);

            // Add error message
            setMessages((prev) => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    content:
                        "Sorry, I encountered an error processing your request. Please try again.",
                    sender: "assistant",
                    timestamp: new Date(),
                },
            ]);
        }
    }

    // Generates mock responses for demo purposes
    function generateMockResponse(
        message: string,
        documentName: string
    ): string {
        const lowerMessage = message.toLowerCase();

        if (
            lowerMessage.includes("summary") ||
            lowerMessage.includes("summarize")
        ) {
            return `This document "${documentName}" covers key concepts related to the subject matter. It contains several sections including introduction, methodology, and conclusion. The main points discuss techniques, approaches, and findings relevant to the domain.`;
        }

        if (
            lowerMessage.includes("author") ||
            lowerMessage.includes("who wrote")
        ) {
            return `The document "${documentName}" appears to be authored by a subject matter expert in the field. However, I cannot provide the specific author name as this information might not be available in the content I can access.`;
        }

        if (
            lowerMessage.includes("page") &&
            (lowerMessage.includes("count") ||
                lowerMessage.includes("how many"))
        ) {
            return `This document contains multiple pages with detailed information. The exact page count would be visible in the PDF viewer on the left side.`;
        }

        if (lowerMessage.includes("hello") || lowerMessage.includes("hi ")) {
            return `Hello there! How can I help you understand the document "${documentName}" better?`;
        }

        return `Based on "${documentName}", I can tell you that the document contains information relevant to your query. You might find more specific details by asking about particular sections or concepts in the document.`;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="font-semibold">Chat with PDF</h2>
                <p className="text-sm text-muted-foreground">
                    Ask questions about "{documentName}"
                </p>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`flex max-w-[80%] rounded-lg p-4 ${
                                    message.sender === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                }`}
                            >
                                {message.sender === "assistant" && (
                                    <Avatar className="h-8 w-8 mr-2 mt-1">
                                        <Bot className="h-4 w-4" />
                                    </Avatar>
                                )}
                                <div className="space-y-1">
                                    <div className="prose prose-sm dark:prose-invert">
                                        {message.content}
                                    </div>
                                    <div
                                        className={`text-xs ${
                                            message.sender === "user"
                                                ? "text-primary-foreground/70"
                                                : "text-muted-foreground"
                                        }`}
                                    >
                                        {message.timestamp.toLocaleTimeString(
                                            [],
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[80%] rounded-lg p-4 bg-muted">
                                <Avatar className="h-8 w-8 mr-2">
                                    <Bot className="h-4 w-4 animate-pulse" />
                                </Avatar>
                                <div className="space-y-2">
                                    <div className="h-5 w-20 rounded-md bg-muted-foreground/20 animate-pulse"></div>
                                    <div className="h-5 w-32 rounded-md bg-muted-foreground/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex items-center space-x-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask a question about this document..."
                        disabled={isLoading}
                        className="flex-grow"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <SendHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
