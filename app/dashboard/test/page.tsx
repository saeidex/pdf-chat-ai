"use client";

import { Markdown } from "@/components/pdf-chat/Markdown";
import TypingIndicator from "@/components/pdf-chat/TypingIndicator";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { content } from "@/lib/example-md";
import { hc } from "@/lib/honoClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    docUrl: z.string().url("Invalid URL"),
});

export default function Page() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            docUrl: "https://saeidexfiles.blob.core.windows.net/pdf-chat/2025-05-06T08-50-23-883Z--qvd0qr9j--a-half-hour-to-learn-rust.pdf?sv=2025-05-05&spr=https%2Chttp&st=2025-05-10T05%3A51%3A59Z&se=2025-05-10T06%3A51%3A59Z&sr=b&sp=r&sig=Gty%2BqOpmCh9jyRfxd2aEkQpE19oWYvCsLGkjfufVNzE%3D",
        },
    });

    const { reset } = form;

    const [responseText, setResponseText] = useState(content);
    const [isStreaming, setIsStreaming] = useState(false);

    const $post = hc.chats.$post;
    const { mutate, isPending } = useMutation<
        InferResponseType<typeof $post>,
        Error,
        InferRequestType<typeof $post>["form"]
    >({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            setResponseText("");
            setIsStreaming(true);

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

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    setResponseText((prev) => prev + chunk);
                }
            } else {
                const text = await response.text();
                setResponseText(text);
            }
            setIsStreaming(false);

            return "";
        },
        onSuccess: () => {
            reset();
        },
        onError: (error) => {
            setIsStreaming(false);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return (
        <div className="bg-red-300 dark:bg-red-900 min-h-screen flex flex-col items-center justify-center">
            <div className="mx-auto max-w-5xl p-12 w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    {responseText ? (
                        <Markdown content={responseText} />
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                            Ask a question about your PDF document
                        </p>
                    )}
                </div>
            </div>
            {(isPending || isStreaming) && <TypingIndicator />}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((data) => mutate(data))}
                    className="space-y-2 w-full max-w-5xl px-12"
                >
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter your prompt"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending || isStreaming}>
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
}
