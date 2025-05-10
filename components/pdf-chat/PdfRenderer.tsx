"use client";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "simplebar-react/dist/simplebar.min.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    pdfWorker,
    import.meta.url
).toString();

interface PdfRendererProps {
    url: string;
}

const scale = 1.0 as const;
const rotation = 0 as const;

export default function PdfRenderer({ url }: PdfRendererProps) {
    console.log("PDF URL:", url);

    const [numPages, setNumPages] = useState<number>(0);
    const [isDocumentLoading, setIsDocumentLoading] = useState(true);
    const [isResizing, setIsResizing] = useState(false);
    const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);

    const { ref, width } = useResizeDetector({
        onResize: () => {
            setIsResizing(true);

            if (resizeTimerRef.current) {
                clearTimeout(resizeTimerRef.current);
            }

            resizeTimerRef.current = setTimeout(() => {
                setIsResizing(false);
            }, 300);
        },
    });
    const { toast } = useToast();

    useEffect(() => {
        return () => {
            if (resizeTimerRef.current) {
                clearTimeout(resizeTimerRef.current);
            }
        };
    }, []);

    return (
        <div
            className="w-full h-full bg-background rounded-md shadow relative"
            ref={ref}
        >
            {isDocumentLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Loading PDF document...
                    </p>
                </div>
            )}

            {isResizing && !isDocumentLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-40 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Resizing view...
                    </p>
                </div>
            )}

            <SimpleBar className="h-[calc(100vh-10rem)] max-h-full overflow-y-auto">
                <Document
                    file={url}
                    loading={null}
                    noData={
                        <div className="flex justify-center py-10">
                            <p className="text-sm text-muted-foreground">
                                No PDF document found
                            </p>
                        </div>
                    }
                    onLoadSuccess={({ numPages }) => {
                        console.log(`Document loaded with ${numPages} pages`);
                        setNumPages(numPages);
                        setIsDocumentLoading(false);
                    }}
                    onLoadError={(error) => {
                        console.error("PDF loading error:", error);
                        setIsDocumentLoading(false);
                        toast({
                            title: "Error loading PDF",
                            variant: "destructive",
                            description: "Please try again later",
                        });
                    }}
                    className="w-full"
                >
                    {Array.from(new Array(numPages), (_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <div
                                key={`page_wrapper_${pageNumber}`}
                                className="relative mb-8"
                            >
                                <Page
                                    key={`page_${pageNumber}`}
                                    pageNumber={pageNumber}
                                    width={width ? width - 32 : undefined}
                                    scale={scale}
                                    rotate={rotation}
                                    loading={() => (
                                        <div className="flex justify-center py-10">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        </div>
                                    )}
                                    className={cn("shadow-lg", {
                                        "opacity-0": isResizing,
                                        "opacity-100 transition-opacity duration-300":
                                            !isResizing,
                                    })}
                                    error={
                                        <div className="flex justify-center py-10 text-red-500">
                                            <p>
                                                Failed to render page{" "}
                                                {pageNumber}
                                            </p>
                                        </div>
                                    }
                                />
                            </div>
                        );
                    })}
                </Document>
            </SimpleBar>
        </div>
    );
}
