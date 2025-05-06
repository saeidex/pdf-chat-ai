"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
    id: string;
    content: string;
    sender: "user" | "assistant";
    timestamp: Date;
}

interface ChatPanelProps {
    documentName: string;
}

export default function ChatPanel({ documentName }: ChatPanelProps) {
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Scroll to bottom of messages when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-resize textarea based on content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const adjustHeight = () => {
            textarea.style.height = "auto";
            const newHeight = Math.min(textarea.scrollHeight, 150);
            textarea.style.height = `${newHeight}px`;
        };

        adjustHeight();
    }, [inputValue]);

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

    const MessageBubble = ({ message }: { message: Message }) => {
        const isUser = message.sender === "user";

        return (
            <div
                className={cn(
                    "flex w-full mb-6 animate-in fade-in-0 slide-in-from-bottom-5 duration-300",
                    isUser ? "justify-end" : "justify-start"
                )}
            >
                <div
                    className={cn(
                        "flex items-start max-w-[85%] group",
                        isUser ? "flex-row-reverse" : "flex-row"
                    )}
                >
                    <div
                        className={cn(
                            "flex-shrink-0",
                            isUser ? "ml-3" : "mr-3"
                        )}
                    >
                        <Avatar
                            className={cn(
                                "border-2 h-8 w-8 flex items-center justify-center",
                                isUser
                                    ? "border-primary bg-primary/10"
                                    : "border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
                            )}
                        >
                            <div className="flex items-center justify-center w-full h-full">
                                <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                            </div>
                        </Avatar>
                    </div>

                    <div>
                        <div
                            className={cn(
                                "px-4 py-3 rounded-2xl mb-1 prose prose-sm max-w-none",
                                isUser
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-zinc-100 dark:bg-zinc-800 text-foreground"
                            )}
                        >
                            {message.content}
                        </div>
                        <div
                            className={cn(
                                "text-xs opacity-0 group-hover:opacity-70 transition-opacity px-2",
                                isUser ? "text-right" : "text-left"
                            )}
                        >
                            {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const TypingIndicator = () => (
        <div className="flex items-start mb-6 animate-in fade-in-0 slide-in-from-bottom-3">
            <Avatar className="h-8 w-8 mr-3 border-2 border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 flex items-center justify-center">
                <div className="flex items-center justify-center w-full h-full">
                    <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                </div>
            </Avatar>
            <div className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center">
                <div className="flex space-x-2">
                    <div
                        className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                        style={{
                            animationDelay: "0ms",
                            animationDuration: "1000ms",
                        }}
                    />
                    <div
                        className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                        style={{
                            animationDelay: "150ms",
                            animationDuration: "1000ms",
                        }}
                    />
                    <div
                        className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                        style={{
                            animationDelay: "300ms",
                            animationDuration: "1000ms",
                        }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950 chat-gradient-bg">
            <div className="flex-grow overflow-y-auto p-4 md:p-6 scrollbar-thin">
                <div className="space-y-2 max-w-3xl mx-auto">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}

                    {isLoading && <TypingIndicator key="typing-indicator" />}
                </div>
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky bottom-0 z-10 animate-in slide-in-from-bottom-5 duration-300">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 rounded-t-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm transition-all duration-200">
                        <Textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    if (inputValue.trim() && !isLoading) {
                                        handleSubmit(e);
                                    }
                                }
                            }}
                            placeholder="Ask a question about this document..."
                            disabled={isLoading}
                            className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent resize-none min-h-0 py-2 h-10 max-h-32 overflow-auto scrollbar-thin"
                            style={{
                                overflowY: "auto",
                                lineHeight: "1.5",
                            }}
                            rows={1}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            disabled={!inputValue.trim() || isLoading}
                            className={cn(
                                "rounded-full hover:bg-primary/10 transition-colors flex-shrink-0",
                                inputValue.trim() && !isLoading
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <SendHorizontal className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
