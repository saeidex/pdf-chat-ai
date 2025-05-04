"use client";

import ChatPanel from "@/components/pdf-chat/ChatPanel";
import PdfRenderer from "@/components/pdf-chat/PdfRenderer";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PDFChatPage() {
    const { documentId } = useParams();
    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Mock function to fetch document data based on ID
    useEffect(() => {
        // In a real application, you would fetch the document from an API
        const mockDocuments = [
            {
                id: "1",
                name: "A half-hour to learn Rust",
                path: "/mock-pdf/A half-hour to learn Rust.pdf",
            },
            {
                id: "2",
                name: "Chapter-9 Polymorphism",
                path: "/mock-pdf/Chapter-9 Polymorphism.pptx.pdf",
            },
            {
                id: "3",
                name: "Mozilla Documentation",
                path: "/mock-pdf/mozilla.pdf",
            },
        ];

        const foundDoc = mockDocuments.find((doc) => doc.id === documentId);

        // Simulate loading
        setTimeout(() => {
            setDocument(foundDoc || null);
            setLoading(false);
        }, 1000);
    }, [documentId]);

    if (loading) {
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
        <div className="flex flex-col h-[calc(100vh-64px)] p-4">
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
                    <PdfRenderer url={document.path} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={25}>
                    <ChatPanel
                        documentId={documentId as string}
                        documentName={document.name}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
