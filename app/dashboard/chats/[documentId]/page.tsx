"use client";

import ChatPanel from "@/components/pdf-chat/ChatPanel";
import PdfRenderer from "@/components/pdf-chat/PdfRenderer";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { hc } from "@/lib/honoClient";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PDFChatPage() {
    const { documentId } = useParams();

    const $get = hc.sas.$get;

    const { data: document, isLoading } = useQuery<
        InferResponseType<typeof $get>
    >({
        queryKey: ["document", documentId],
        queryFn: async () => {
            const response = await $get({
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
    });

    if (isLoading) {
        return (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">
                    Loading PDF document...
                </p>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                <h1 className="text-2xl font-bold mb-2">Document Not Found</h1>
                <p className="text-muted-foreground mb-4">
                    The document you are looking for does not exist.
                </p>
                <Button asChild>
                    <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen p-4">
            <div className="flex items-center mb-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Dashboard</span>
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold ml-2 truncate">
                    {document.name}
                </h1>
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
                    <ChatPanel documentName={document.name} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
