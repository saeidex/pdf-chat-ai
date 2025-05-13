"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bot, FileText, Search, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
        animationClass: "animate-float-slow",
        content: (
            <div className="flex h-full w-full flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                <p className="mt-1 text-xs font-medium">Upload PDF</p>
            </div>
        ),
    },
    {
        id: "search",
        position: "absolute bottom-10 -right-8 z-20 p-3",
        animationClass: "animate-float-medium",
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
    return (
        <section
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white to-blue-50/50 dark:from-background dark:to-indigo-950/10"
            id="hero"
        >
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="bg-grid-pattern absolute inset-0 opacity-[0.07] dark:opacity-[0.04]" />
                <div className="absolute top-0 right-0 left-0 h-[500px] translate-y-[-20%] transform bg-gradient-to-br from-blue-300/20 via-purple-300/15 to-indigo-300/20 blur-3xl dark:from-blue-500/10 dark:via-purple-500/10 dark:to-indigo-500/10"></div>
                <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-[20%] translate-y-[20%] transform bg-gradient-to-tl from-purple-300/20 via-blue-300/15 to-indigo-300/20 blur-3xl dark:from-purple-500/10 dark:via-blue-500/10 dark:to-indigo-500/10"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    <div className="mx-auto max-w-xl text-center">
                        {/* Hero text content section */}
                        <div className="animate-fade-in-up mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary shadow-sm dark:border-primary/10 dark:bg-primary/5">
                            <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                            Try now
                        </div>

                        <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight delay-100 md:text-5xl lg:text-6xl">
                            Chat with your{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-500 dark:to-purple-500">
                                PDF documents
                            </span>
                            using AI
                        </h1>

                        <p className="animate-fade-in-up mx-auto mt-6 text-lg text-muted-foreground delay-200">
                            PdfChat uses advanced AI to help you analyze,
                            extract insights, and answer questions from your PDF
                            documents in seconds. No more manual searching.
                        </p>

                        <div className="animate-fade-in-up mt-8 flex justify-center delay-300">
                            <Link href="/dashboard">
                                <Button
                                    size="lg"
                                    className="px-6 text-base font-medium"
                                >
                                    <ArrowUpRight className="mr-2 h-5 w-5" />
                                    Get Started
                                </Button>
                            </Link>
                        </div>

                        <p className="animate-fade-in-up mt-6 text-sm text-muted-foreground delay-400">
                            Secure and private. Your documents are processed
                            instantly.
                        </p>
                    </div>

                    <div className="relative mx-auto">
                        {/* Animated glow effect */}
                        <div className="animate-fade-in absolute top-1/2 left-1/2 z-0 h-[110%] w-[120%] -translate-x-1/2 -translate-y-1/2 transform rounded-[40%]">
                            {/* Multiple layers for richer glow effect */}
                            <div className="absolute inset-0 rounded-[40%] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 blur-3xl dark:from-blue-600/20 dark:via-purple-600/30 dark:to-indigo-500/20" />
                            <div className="absolute inset-[10%] rounded-[30%] bg-gradient-to-tr from-purple-500/20 via-blue-500/25 to-purple-400/20 blur-2xl dark:from-purple-600/20 dark:via-blue-500/25 dark:to-purple-400/15" />
                        </div>

                        {/* Chat preview */}
                        <div className="animate-fade-in-up relative z-10 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-xl delay-200 dark:bg-background">
                            {/* Document header */}
                            <div className="flex items-center justify-between rounded-t-2xl border-b border-border/60 bg-muted/80 p-4 dark:bg-muted/70">
                                <div className="flex items-center">
                                    <FileText className="mr-2 h-5 w-5 text-primary" />
                                    <span className="font-medium">
                                        AnnualReport2023.pdf
                                    </span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-green-500 opacity-80 dark:opacity-70" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500 opacity-80 dark:opacity-70" />
                                    <div className="h-3 w-3 rounded-full bg-red-500 opacity-80 dark:opacity-70" />
                                </div>
                            </div>

                            {/* Chat messages */}
                            <div className="flex flex-col gap-4 bg-white p-6 dark:bg-background">
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
                                                <div className="mt-1 space-y-2 text-sm text-muted-foreground">
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
                                        className="w-full rounded-lg border border-input bg-white/90 px-4 py-2.5 text-sm focus:border-primary/30 focus:ring-2 focus:ring-primary/30 focus:outline-none dark:bg-background/90"
                                    />
                                    <button className="absolute top-1/2 right-2 -translate-y-1/2 transform text-muted-foreground hover:text-primary">
                                        <Search className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        {floatingElements.map((element) => (
                            <div
                                key={element.id}
                                className={`${element.position} ${element.animationClass} rounded-xl border border-border/60 bg-white shadow-lg dark:bg-background`}
                            >
                                {element.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
