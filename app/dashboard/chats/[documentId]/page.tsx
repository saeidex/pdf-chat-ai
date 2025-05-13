"use client";

import { ModeToggle } from "@/components/common/ModeToggle";
import ChatPanel from "@/components/pdf-chat/ChatPanel";
import PdfRenderer from "@/components/pdf-chat/PdfRenderer";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMounted } from "@/hooks/use-mounted";
import { hc } from "@/lib/honoClient";
import { Message } from "@/lib/types";
import { UserButton } from "@clerk/nextjs";
import { useQueries } from "@tanstack/react-query";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PDFChatPage() {
    const isMounted = useMounted();

    const { documentId } = useParams<{ documentId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);

    const $getSas = hc.sas.$get;
    const $getChats = hc.chats[":docId"].$get;

    const queries = useQueries({
        queries: [
            {
                queryKey: ["initialMessages", documentId],
                queryFn: async () => {
                    const res = await $getChats({
                        param: { docId: documentId },
                    });
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }
                    const data = await res.json();
                    return data;
                },
                enabled: !!documentId,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ["document", documentId],
                queryFn: async () => {
                    const response = await $getSas({
                        query: {
                            containerName: "pdf-chat",
                            blobName: documentId as string,
                            expiryTime: new Date(
                                Date.now() + 1000 * 60 * 60 * 24
                            ).toISOString(),
                        },
                    });

                    const data = await response.json();

                    if (response.status !== 200) {
                        throw new Error("Document not found");
                    }

                    return data;
                },
                staleTime: 0,
                gcTime: 0,
            },
        ],
    });

    const chats = queries[0].data;
    const document = queries[1].data;
    const isLoading = queries[1].isLoading || queries[0].isLoading;
    const isError = queries[1].isError || queries[0].isError;

    useEffect(() => {
        if (chats) {
            setMessages(chats.messages);
        }
    }, [chats]);

    if (isLoading || !isMounted) {
        return (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground">
                    Loading PDF document...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <h1 className="mb-2 text-2xl font-bold">Error</h1>
                <p className="mb-4 text-muted-foreground">
                    An error occurred while loading the document.
                </p>
                <Button asChild>
                    <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center">
                <h1 className="mb-2 text-2xl font-bold">Document Not Found</h1>
                <p className="mb-4 text-muted-foreground">
                    The document you are looking for does not exist.
                </p>
                <Button asChild>
                    <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col p-4">
            <div className="mb-4 flex items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Dashboard</span>
                    </Link>
                </Button>
                <h1 className="ml-2 truncate text-xl font-semibold">
                    {document.name}
                </h1>
                <div className="ml-auto flex items-center space-x-4 pr-4">
                    <ModeToggle />
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "h-8 w-8",
                            },
                        }}
                    />
                </div>
            </div>
            <ResizablePanelGroup
                direction="horizontal"
                className="flex-grow rounded-lg border"
            >
                <ResizablePanel defaultSize={60} minSize={30}>
                    <PdfRenderer url={document.sasUrl} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={25}>
                    <ChatPanel
                        docId={documentId}
                        docUrl={document.sasUrl}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
