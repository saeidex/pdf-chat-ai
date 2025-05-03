"use client";

import { FadeIn } from "@/components/ui/animations/FadeIn";
import { FloatingElement } from "@/components/ui/animations/FloatingElement";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, FileText, Search, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const chatMessages = [
    {
        id: 1,
        sender: "ai",
        avatar: <Bot className="h-4 w-4" />,
        name: "PdfChat AI",
        message:
            "I've analyzed your annual report. What specific information would you like to know about it?",
        avatarClasses:
            "flex h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-500 items-center justify-center shadow-sm",
    },
    {
        id: 2,
        sender: "user",
        avatar: "U",
        name: "You",
        message: "What was the company's total revenue for Q4 2023?",
        avatarClasses:
            "flex h-8 w-8 rounded-full bg-gray-100 dark:bg-muted text-foreground items-center justify-center shadow-sm",
    },
    {
        id: 3,
        sender: "ai",
        avatar: <Bot className="h-4 w-4" />,
        name: "PdfChat AI",
        message: [
            "According to the annual report, the company's total revenue for Q4 2023 was $42.8 million, representing a 24% increase compared to Q4 2022 ($34.5 million).",
            'This information can be found on page 15 of the report in the "Financial Highlights" section.',
        ],
        avatarClasses:
            "flex h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-500 items-center justify-center shadow-sm",
    },
];

const floatingElements = [
    {
        id: "upload",
        position: "absolute top-12 -left-10 z-20 w-24 h-20",
        delay: 0.2,
        distance: 12,
        yOffset: -15,
        duration: 3.5,
        content: (
            <div className="h-full w-full flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                <p className="text-xs font-medium mt-1">Upload PDF</p>
            </div>
        ),
    },
    {
        id: "search",
        position: "absolute bottom-10 -right-8 z-20 p-3",
        delay: 0.3,
        distance: 8,
        yOffset: 15,
        duration: 3,
        content: (
            <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span className="text-sm font-medium">
                    Find anything quickly
                </span>
            </div>
        ),
    },
];

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Ensure the glow effect appears with the chat card
    useEffect(() => {
        // Small delay to ensure the chat card animation starts first
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-blue-50/50 dark:from-background dark:to-indigo-950/10"
            id="hero"
        >
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.07] dark:opacity-[0.04]" />
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-blue-300/20 via-purple-300/15 to-indigo-300/20 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-indigo-500/10 blur-3xl transform translate-y-[-20%]"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-300/20 via-blue-300/15 to-indigo-300/20 dark:from-purple-500/10 dark:via-blue-500/10 dark:to-indigo-500/10 blur-3xl transform translate-x-[20%] translate-y-[20%]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center mx-auto max-w-xl">
                        {/* Hero text content section */}
                        <FadeIn>
                            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 dark:bg-primary/5 text-primary border border-primary/20 dark:border-primary/10 mb-6 shadow-sm">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                                Try now
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                Chat with your{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">
                                    PDF documents
                                </span>{" "}
                                using AI
                            </h1>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <p className="mt-6 text-lg text-muted-foreground mx-auto">
                                PdfChat uses advanced AI to help you analyze,
                                extract insights, and answer questions from your
                                PDF documents in seconds. No more manual
                                searching.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div className="mt-8 flex justify-center">
                                <Link href="/dashboard">
                                    <Button
                                        size="lg"
                                        className="font-medium text-base px-6"
                                    >
                                        <ArrowUpRight className="mr-2 h-5 w-5" />
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <p className="mt-6 text-sm text-muted-foreground">
                                Secure and private. Your documents are processed
                                instantly.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="relative mx-auto">
                        {/* Animated glow effect */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: isVisible ? [0.2, 0.4, 0.3] : 0,
                                scale: isVisible ? [0.9, 1.05, 1] : 0.8,
                                y: isVisible ? [5, -5, 0] : 0,
                            }}
                            transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                                ease: "easeInOut",
                                times: [0, 0.5, 1],
                            }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[110%] rounded-[40%] z-0"
                        >
                            {/* Multiple layers for richer glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 dark:from-blue-600/20 dark:via-purple-600/30 dark:to-indigo-500/20 blur-3xl rounded-[40%]" />
                            <div className="absolute inset-[10%] bg-gradient-to-tr from-purple-500/20 via-blue-500/25 to-purple-400/20 dark:from-purple-600/20 dark:via-blue-500/25 dark:to-purple-400/15 blur-2xl rounded-[30%]" />
                        </motion.div>

                        {/* Chat preview */}
                        <FloatingElement
                            className="relative z-10 overflow-hidden rounded-2xl border border-border/60 shadow-xl bg-white dark:bg-background"
                            delay={0.1}
                            distance={10}
                            duration={4}
                        >
                            {/* Document header */}
                            <div className="rounded-t-2xl bg-muted/80 dark:bg-muted/70 border-b border-border/60 p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-primary mr-2" />
                                    <span className="font-medium">
                                        AnnualReport2023.pdf
                                    </span>
                                </div>
                                <div className="flex gap-1.5">
                                    {["red", "yellow", "green"].map((color) => (
                                        <div
                                            key={color}
                                            className={`w-3 h-3 rounded-full bg-${color}-500 opacity-80 dark:opacity-70`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Chat messages */}
                            <div className="p-6 flex flex-col gap-4 bg-white dark:bg-background">
                                {chatMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="flex-shrink-0">
                                            <span
                                                className={
                                                    message.avatarClasses
                                                }
                                            >
                                                {message.avatar}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {message.name}
                                            </p>
                                            {Array.isArray(message.message) ? (
                                                <div className="text-sm text-muted-foreground mt-1 space-y-2">
                                                    {message.message.map(
                                                        (paragraph, i) => (
                                                            <p key={i}>
                                                                {paragraph}
                                                            </p>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <p
                                                    className={`text-sm ${
                                                        message.sender ===
                                                        "user"
                                                            ? "text-foreground"
                                                            : "text-muted-foreground"
                                                    } mt-1`}
                                                >
                                                    {message.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Input field */}
                                <div className="relative mt-2">
                                    <input
                                        type="text"
                                        placeholder="Ask a question..."
                                        className="w-full px-4 py-2.5 rounded-lg border border-input bg-white/90 dark:bg-background/90 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                                    />
                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary">
                                        <Search className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </FloatingElement>

                        {/* Floating elements */}
                        {floatingElements.map((element) => (
                            <FloatingElement
                                key={element.id}
                                className={`${element.position} bg-white dark:bg-background rounded-xl shadow-lg border border-border/60`}
                                delay={element.delay}
                                distance={element.distance}
                                yOffset={element.yOffset}
                                duration={element.duration}
                            >
                                {element.content}
                            </FloatingElement>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
