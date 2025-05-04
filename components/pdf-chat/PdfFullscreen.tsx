"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Expand } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";

// Ensure worker is set
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

interface PdfFullscreenProps {
    fileUrl: string;
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [numPages, setNumPages] = useState<number>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const { toast } = useToast();
    const { width, ref } = useResizeDetector();

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(v) => {
                if (!v) {
                    setIsOpen(v);
                }
            }}
        >
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button variant="ghost" className="gap-1.5" aria-label="fullscreen">
                    <Expand className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-full max-h-[95vh]">
                <SimpleBar 
                    autoHide={false}
                    style={{ height: "calc(95vh - 2rem)", width: "100%", overflow: "auto" }}
                >
                    <div ref={ref} className="flex flex-col items-center">
                        <Document
                            loading={
                                <div className="flex justify-center">
                                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                                </div>
                            }
                            onLoadError={() =>
                                toast({
                                    title: "Error loading PDF",
                                    description: "Please try again later",
                                    variant: "destructive",
                                })
                            }
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            file={fileUrl}
                            className="max-w-full"
                        >
                            {Array.from(new Array(numPages), (_, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width={width ? width - 32 : undefined}
                                    scale={scale}
                                    rotate={rotation}
                                    loading={
                                        <div className="flex justify-center">
                                            <Loader2 className="my-24 h-6 w-6 animate-spin" />
                                        </div>
                                    }
                                    className="mb-8 shadow-lg"
                                />
                            ))}
                        </Document>
                    </div>
                </SimpleBar>
            </DialogContent>
        </Dialog>
    );
};

export default PdfFullscreen;
