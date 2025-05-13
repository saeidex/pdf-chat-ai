"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ModeToggle } from "../common/ModeToggle";

export default function DashboardNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 left-0 z-50 w-full border-b transition-all duration-300",
                isScrolled
                    ? "bg-background/95 shadow-sm backdrop-blur-md"
                    : "bg-background"
            )}
        >
            <div className="container mx-auto">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center space-x-2"
                    >
                        <div className="rounded-md bg-primary/10 p-2">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xl font-semibold">PdfChat</span>
                    </Link>
                    {/* TODO:
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="w-full pl-10 bg-muted/30"
                                placeholder="Search documents..."
                            />
                        </div>
                    </div> */}

                    <div className="flex items-center space-x-4">
                        <ModeToggle />
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "h-8 w-8",
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
