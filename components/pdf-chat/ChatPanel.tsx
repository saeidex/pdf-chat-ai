"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { useToast } from "@/hooks/use-toast";
import { hc } from "@/lib/honoClient";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { Bot, SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Markdown } from "./Markdown";
import TypingIndicator from "./TypingIndicator";

interface Message {
    id: string;
    content: string;
    sender: "user" | "assistant";
    timestamp: Date;
}

interface ChatPanelProps {
    docName: string;
    docUrl: string;
}

const formSchema = z.object({
    prompt: z.string().min(1, "Message cannot be empty"),
    docUrl: z.string().url("Invalid URL"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ChatPanel({ docName, docUrl }: ChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "assistant",
            timestamp: new Date(),
            content: `Hello! I'm your PDF assistant. I'm ready to help you with "${docName}". What would you like to know about this document?`,
        },
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useScrollToBottom(messagesEndRef, [messages]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            docUrl,
        },
    });

    const [isStreaming, setIsStreaming] = useState(false);

    const $post = hc.chats.$post;
    const { mutate, isPending } = useMutation<
        InferResponseType<typeof $post>,
        Error,
        InferRequestType<typeof $post>["form"]
    >({
        mutationFn: async (values: FormValues) => {
            const userMessageId = `user-${Date.now()}`;
            setMessages((prev) => [
                ...prev,
                {
                    id: userMessageId,
                    content: values.prompt,
                    sender: "user",
                    timestamp: new Date(),
                },
            ]);

            const assistantMessageId = `assistant-${Date.now()}`;
            setMessages((prev) => [
                ...prev,
                {
                    id: assistantMessageId,
                    content: "",
                    sender: "assistant",
                    timestamp: new Date(),
                },
            ]);

            const response = await $post({
                form: values,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let streamedContent = "";
                setIsStreaming(true);

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    streamedContent += chunk;

                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg.id === assistantMessageId
                                ? { ...msg, content: streamedContent }
                                : msg
                        )
                    );
                }
            }

            return "";
        },
        onSuccess: () => {
            form.reset();
            setIsStreaming(false);
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });

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
        },
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            form.handleSubmit((values) => mutate(values))();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950 chat-gradient-bg">
            <div className="flex-grow overflow-y-auto p-4 md:p-6 scrollbar-thin">
                <div className="space-y-2 max-w-3xl mx-auto">
                    {messages.map((message, index) => {
                        if (
                            isPending &&
                            message.sender === "assistant" &&
                            !message.content &&
                            index === messages.length - 1
                        ) {
                            return null;
                        }
                        return (
                            <MessageBubble key={message.id} message={message} />
                        );
                    })}

                    {isPending && !isStreaming && (
                        <TypingIndicator key="typing-indicator" />
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky bottom-0 z-10 animate-in slide-in-from-bottom-5 duration-300">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) => mutate(values))}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 rounded-t-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm transition-all duration-200">
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Ask a question about this document..."
                                                disabled={isPending}
                                                className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent resize-none min-h-0 py-2 h-10 max-h-32 overflow-auto scrollbar-thin"
                                                style={{
                                                    overflowY: "auto",
                                                    lineHeight: "1.5",
                                                }}
                                                rows={1}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                variant="ghost"
                                disabled={isPending || !form.formState.isValid}
                                className={cn(
                                    "rounded-full hover:bg-primary/10 transition-colors flex-shrink-0",
                                    form.formState.isValid && !isPending
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <SendHorizontal className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
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
                <div className={cn("flex-shrink-0", isUser ? "ml-3" : "mr-3")}>
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
                        {isUser ? (
                            message.content
                        ) : (
                            <Markdown content={message.content} />
                        )}
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
