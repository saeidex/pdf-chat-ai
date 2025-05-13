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
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { useToast } from "@/hooks/use-toast";
import { hc } from "@/lib/honoClient";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { Bot, SendHorizontal, User } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Markdown } from "./Markdown";
import TypingIndicator from "./TypingIndicator";

interface ChatPanelProps {
    docUrl: string;
    docId: string;
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
}

const formSchema = z.object({
    prompt: z.string().min(1, "Message cannot be empty"),
    docUrl: z.string().url("Invalid URL"),
    docId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ChatPanel({
    docUrl,
    docId,
    messages,
    setMessages,
}: ChatPanelProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            docUrl,
            docId,
        },
    });

    const promptValue = form.watch("prompt");
    useAutoResizeTextarea(textareaRef, promptValue, 150);

    useScrollToBottom(messagesEndRef, [messages]);

    const [isStreaming, setIsStreaming] = useState(false);
    const $post = hc.chats.$post;

    const { mutate, isPending, isError } = useMutation<
        InferResponseType<typeof $post>,
        Error,
        InferRequestType<typeof $post>["form"]
    >({
        mutationFn: async (values: FormValues) => {
            const userMessageId = `user-${Date.now()}`;
            const assistantMessageId = `assistant-${Date.now()}`;

            setMessages((prev) => [
                ...prev,
                {
                    id: userMessageId,
                    content: values.prompt,
                    chatId: messages[0]?.chatId || docId,
                    createdAt: new Date().toISOString(),
                    messageGroupId: null,
                    role: "USER",
                },
                {
                    id: assistantMessageId,
                    content: "",
                    chatId: messages[0]?.chatId || docId,
                    createdAt: new Date().toISOString(),
                    messageGroupId: null,
                    role: "ASSISTANT",
                },
            ]);

            const response = await $post({
                form: values,
            });

            if (!response.ok) {
                throw new Error(response.statusText);
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

            setIsStreaming(false);
        },
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            form.handleSubmit((values) => mutate(values))();
        }
    };

    return (
        <div className="chat-gradient-bg flex h-full flex-col bg-white dark:bg-zinc-950">
            <div className="scrollbar-thin flex-grow overflow-y-auto p-4 md:p-6">
                <div className="mx-auto max-w-3xl space-y-2">
                    {messages.length === 0 && (
                        <WelcomePrompts
                            onPromptSelect={(prompt) => {
                                form.setValue("prompt", prompt);
                                form.handleSubmit((values) => mutate(values))();
                            }}
                        />
                    )}
                    {messages.map((message, index) => {
                        if (
                            isPending &&
                            !message.content &&
                            message.role === "ASSISTANT" &&
                            index === messages.length - 1
                        ) {
                            return null;
                        }
                        return (
                            <MessageBubble key={message.id} message={message} />
                        );
                    })}

                    {isPending && !isStreaming && !isError && (
                        <TypingIndicator key="typing-indicator" />
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            <div className="animate-in slide-in-from-bottom-5 sticky bottom-0 z-10 border-t bg-white/80 p-4 backdrop-blur-sm duration-300 dark:bg-zinc-900/80">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) => mutate(values))}
                        className="mx-auto max-w-3xl"
                    >
                        <div className="flex items-center space-x-2 rounded-t-2xl border border-zinc-200 bg-white px-4 py-2 shadow-sm transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900">
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                ref={textareaRef}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Ask a question about this document..."
                                                disabled={isPending}
                                                className="scrollbar-thin h-10 max-h-32 min-h-0 flex-grow resize-none overflow-auto border-0 bg-transparent py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                    "flex-shrink-0 rounded-full transition-colors hover:bg-primary/10",
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

interface WelcomePromptsProps {
    onPromptSelect: (prompt: string) => void;
}

const WelcomePrompts = ({ onPromptSelect }: WelcomePromptsProps) => {
    const predefinedPrompts = [
        "Summarize this document",
        "What are the key concepts?",
        "Explain the main argument",
        "Extract data and tables",
        "Find all references",
        "Explain in simple terms",
    ];

    return (
        <div className="flex flex-col items-center space-y-6 py-8 text-center">
            <div className="rounded-full bg-primary/15 p-4 shadow-sm ring-1 ring-primary/10">
                <Bot className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                    Chat with your document
                </h3>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                    Ask questions about this document&apos;s content
                </p>
            </div>

            <div className="mx-auto grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
                {predefinedPrompts.map((prompt, i) => (
                    <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => onPromptSelect(prompt)}
                        className="group relative h-auto justify-start overflow-hidden rounded-xl bg-white px-4 py-5 text-sm shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md dark:bg-zinc-800/50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:via-primary/10 group-hover:opacity-100" />
                        <SendHorizontal className="mr-3 h-4 w-4 flex-shrink-0 text-primary" />
                        <span className="text-left">{prompt}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

const MessageBubble = ({
    message,
}: {
    message: {
        content: string;
        createdAt: string;
        role: "USER" | "ASSISTANT" | "SYSTEM";
    };
}) => {
    const isUser = message.role === "USER";

    return (
        <div
            className={cn(
                "animate-in fade-in-0 slide-in-from-bottom-5 mb-6 flex w-full duration-300",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "group flex max-w-[85%] items-start",
                    isUser ? "flex-row-reverse" : "flex-row"
                )}
            >
                <div className={cn("flex-shrink-0", isUser ? "ml-3" : "mr-3")}>
                    <Avatar
                        className={cn(
                            "flex h-8 w-8 items-center justify-center border-2",
                            isUser
                                ? "border-primary bg-primary/10"
                                : "border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
                        )}
                    >
                        <div className="flex h-full w-full items-center justify-center">
                            {isUser ? (
                                <User className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                            ) : (
                                <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                            )}
                        </div>
                    </Avatar>
                </div>

                <div>
                    <div
                        className={cn(
                            "prose prose-sm mb-1 max-w-none rounded-2xl px-4 py-3",
                            isUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-zinc-100 text-foreground dark:bg-zinc-800"
                        )}
                    >
                        <Markdown content={message.content} />
                    </div>
                    <div
                        className={cn(
                            "px-2 text-xs opacity-0 transition-opacity group-hover:opacity-70",
                            isUser ? "text-right" : "text-left"
                        )}
                    >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
