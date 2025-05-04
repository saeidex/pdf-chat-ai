"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ChevronDown,
    ChevronUp,
    Loader2,
    RotateCw,
    Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { z } from "zod";
import PdfFullscreen from "./PdfFullscreen";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

interface PdfRendererProps {
    url: string;
}

const PdfRenderer = ({
    url = "https://img-cache.oppcdn.com/fixed/70811/assets/M31BD3KH5j9EynGI.pdf",
}: PdfRendererProps) => {
    const { toast } = useToast();
    const simpleBarRef = useRef<any>(null);

    const [numPages, setNumPages] = useState<number>();
    const [currPage, setCurrPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const [renderedScale, setRenderedScale] = useState<number | null>(null);
    const [pageRefs, setPageRefs] = useState<(HTMLDivElement | null)[]>([]);
    const [isDocumentLoading, setIsDocumentLoading] = useState<boolean>(true);
    const [pagesRendering, setPagesRendering] = useState<
        Record<number, boolean>
    >({});

    // Check if specific page is currently rendering
    const isPageRendering = (pageNumber: number) =>
        Boolean(pagesRendering[pageNumber]);

    // Check if scale or rotation has changed and pages need to re-render
    const isScaleOrRotationLoading = renderedScale !== scale;

    // Global loading state
    const isLoading = isDocumentLoading || isScaleOrRotationLoading;

    // Track rendered pages
    const markPageAsRendered = (pageNumber: number) => {
        setPagesRendering((prev) => ({ ...prev, [pageNumber]: false }));
    };

    const markPageAsRendering = (pageNumber: number) => {
        setPagesRendering((prev) => ({ ...prev, [pageNumber]: true }));
    };

    const CustomPageValidator = z.object({
        page: z
            .string()
            .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
    });

    type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<TCustomPageValidator>({
        defaultValues: {
            page: "1",
        },
        resolver: zodResolver(CustomPageValidator),
    });

    const { width, ref } = useResizeDetector();

    const handlePageSubmit = ({ page }: TCustomPageValidator) => {
        const pageNumber = Number(page);
        setCurrPage(pageNumber);
        setValue("page", page);

        // Scroll to the selected page
        if (pageRefs[pageNumber - 1]) {
            pageRefs[pageNumber - 1]?.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Update page refs when numPages changes
    useEffect(() => {
        if (numPages) {
            setPageRefs(Array(numPages).fill(null));
        }
    }, [numPages]);

    useEffect(() => {
        if (simpleBarRef.current) {
            simpleBarRef.current.scrollTop = 0;
        }
    }, [currPage]);

    // Improved scroll detection to update current page value
    useEffect(() => {
        const handleScroll = () => {
            if (!simpleBarRef.current || pageRefs.length === 0) return;

            const scrollElement = simpleBarRef.current.getScrollElement();
            if (!scrollElement) return;

            const viewportRect = scrollElement.getBoundingClientRect();
            const viewportTop = viewportRect.top;
            const viewportCenter = viewportTop + viewportRect.height / 2;

            // Find the page that's most visible in the viewport
            let bestVisiblePage = currPage;
            let maxVisibleArea = 0;

            pageRefs.forEach((ref, idx) => {
                if (!ref) return;

                const rect = ref.getBoundingClientRect();
                // Calculate how much of the page is visible in the viewport
                const visibleTop = Math.max(rect.top, viewportRect.top);
                const visibleBottom = Math.min(
                    rect.bottom,
                    viewportRect.bottom
                );

                if (visibleBottom > visibleTop) {
                    // Page is at least partially visible
                    const visibleHeight = visibleBottom - visibleTop;
                    const visibleRatio = visibleHeight / rect.height;

                    // If this page has more visible area or is centered in the viewport
                    if (visibleRatio > maxVisibleArea) {
                        maxVisibleArea = visibleRatio;
                        bestVisiblePage = idx + 1; // 1-based page numbers
                    }
                }
            });

            if (bestVisiblePage !== currPage) {
                setCurrPage(bestVisiblePage);
                setValue("page", String(bestVisiblePage), {
                    shouldValidate: false,
                });
            }
        };

        // Add debouncing to avoid excessive updates
        let timeout: NodeJS.Timeout;
        const debouncedScrollHandler = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleScroll, 50);
        };

        const scrollableElement = simpleBarRef.current?.getScrollElement();
        if (scrollableElement) {
            scrollableElement.addEventListener(
                "scroll",
                debouncedScrollHandler,
                {
                    passive: true,
                }
            );

            // Initial check
            handleScroll();

            return () => {
                clearTimeout(timeout);
                scrollableElement.removeEventListener(
                    "scroll",
                    debouncedScrollHandler
                );
            };
        }
    }, [currPage, pageRefs, setValue]);

    return (
        <div className="w-full h-full bg-background rounded-md shadow flex flex-col items-center">
            {/* Loading overlay for the entire document */}
            {isDocumentLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Loading PDF document...
                    </p>
                </div>
            )}

            <div className="h-14 w-full border-b flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                    <Button
                        disabled={currPage <= 1 || isLoading}
                        onClick={() => {
                            const newPage = currPage - 1 > 1 ? currPage - 1 : 1;
                            setCurrPage(newPage);
                            setValue("page", String(newPage));
                            // Scroll to the previous page
                            if (pageRefs[newPage - 1]) {
                                pageRefs[newPage - 1]?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }
                        }}
                        variant="ghost"
                        aria-label="previous page"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1.5">
                        <Input
                            {...register("page")}
                            className={cn(
                                "w-12 h-8",
                                errors.page && "focus-visible:ring-red-500"
                            )}
                            disabled={isDocumentLoading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit(handlePageSubmit)();
                                }
                            }}
                        />
                        <p className="text-zinc-700 text-sm space-x-1">
                            <span>/</span>
                            <span>{numPages ?? "x"}</span>
                        </p>
                    </div>
                    <Button
                        disabled={
                            numPages === undefined ||
                            currPage === numPages ||
                            isLoading
                        }
                        onClick={() => {
                            const newPage =
                                currPage + 1 <= numPages!
                                    ? currPage + 1
                                    : currPage;
                            setCurrPage(newPage);
                            setValue("page", String(newPage));
                            // Scroll to the next page
                            if (pageRefs[newPage - 1]) {
                                pageRefs[newPage - 1]?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }
                        }}
                        variant="ghost"
                        aria-label="next page"
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="gap-1.5"
                                aria-label="zoom"
                                disabled={isDocumentLoading}
                                variant="ghost"
                            >
                                {isScaleOrRotationLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                                {scale * 100}%
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => setScale(0.5)}>
                                50%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(0.75)}>
                                75%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1)}>
                                100%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1.5)}>
                                150%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(2)}>
                                200%
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(2.5)}>
                                250%
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        onClick={() => setRotation((prev) => prev + 90)}
                        disabled={isDocumentLoading}
                        variant="ghost"
                        aria-label="rotate 90 degrees"
                    >
                        <RotateCw className="h-4 w-4" />
                    </Button>
                    <PdfFullscreen fileUrl={url} />
                </div>
            </div>

            <div className="flex-1 w-full h-[calc(100%-3.5rem)] overflow-hidden">
                <SimpleBar
                    autoHide={false}
                    style={{ height: "100%", width: "100%", overflow: "auto" }}
                    ref={simpleBarRef}
                >
                    <div ref={ref} className="flex flex-col items-center py-4">
                        <Document
                            loading={
                                <div className="flex justify-center">
                                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                                </div>
                            }
                            onLoadError={() =>
                                toast({
                                    title: "Error loading PDF",
                                    variant: "destructive",
                                    description: "Please try again later",
                                })
                            }
                            onLoadStart={() => setIsDocumentLoading(true)}
                            onLoadSuccess={({ numPages }) => {
                                setNumPages(numPages);
                                setIsDocumentLoading(false);
                                // Initialize all pages as rendering
                                const initialRenderingState: Record<
                                    number,
                                    boolean
                                > = {};
                                for (let i = 1; i <= numPages; i++) {
                                    initialRenderingState[i] = true;
                                }
                                setPagesRendering(initialRenderingState);
                            }}
                            file={url}
                            className="max-w-full"
                        >
                            {/* Show global scaling loading indicator when scale changes */}
                            {isScaleOrRotationLoading && (
                                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                                    <div className="bg-background/90 p-4 rounded-lg shadow-lg flex flex-col items-center">
                                        <Loader2 className="h-6 w-6 animate-spin mb-2" />
                                        <p className="text-sm">
                                            Adjusting view...
                                        </p>
                                    </div>
                                </div>
                            )}

                            {numPages &&
                                Array.from(new Array(numPages), (_, index) => (
                                    <div
                                        key={`page-container-${index + 1}`}
                                        ref={(el) => {
                                            pageRefs[index] = el;
                                        }}
                                        className={cn(
                                            "mb-8 relative",
                                            currPage === index + 1
                                                ? "scroll-mt-10"
                                                : ""
                                        )}
                                    >
                                        {/* Per-page loading indicator */}
                                        {isPageRendering(index + 1) && (
                                            <div className="absolute inset-0 bg-background/30 flex items-center justify-center z-10">
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            </div>
                                        )}

                                        <Page
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                            width={
                                                width ? width - 32 : undefined
                                            }
                                            scale={scale}
                                            rotate={rotation}
                                            loading={() => {
                                                // Mark page as rendering when loading
                                                markPageAsRendering(index + 1);
                                                return (
                                                    <div className="flex justify-center py-10">
                                                        <Loader2 className="h-6 w-6 animate-spin" />
                                                    </div>
                                                );
                                            }}
                                            onRenderSuccess={() => {
                                                markPageAsRendered(index + 1);
                                                if (index === 0)
                                                    setRenderedScale(scale);
                                            }}
                                            className={cn(
                                                "shadow-lg",
                                                isPageRendering(index + 1)
                                                    ? "opacity-50"
                                                    : "opacity-100"
                                            )}
                                        />
                                    </div>
                                ))}
                        </Document>
                    </div>
                </SimpleBar>
            </div>
        </div>
    );
};

export default PdfRenderer;
