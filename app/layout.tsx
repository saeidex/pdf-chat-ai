import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "@/components/query-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PdfChat - AI-Powered Document Analysis",
    description:
        "Chat with your PDF documents using advanced AI analysis. Extract insights, answer questions, and analyze documents effortlessly.",
    keywords: "PDF analysis, AI chat, document analysis, PDF tool",
    openGraph: {
        title: "PdfChat - AI-Powered Document Analysis",
        description:
            "Chat with your PDF documents using advanced AI analysis. Extract insights, answer questions, and analyze documents effortlessly.",
        url: "https://pdfchat.app",
        siteName: "PdfChat",
        images: [
            {
                url: "https://images.pexels.com/photos/7532110/pexels-photo-7532110.jpeg",
                width: 1200,
                height: 630,
                alt: "PdfChat Application Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "PdfChat - AI-Powered Document Analysis",
        description: "Chat with your PDF documents using advanced AI analysis.",
        images: [
            "https://images.pexels.com/photos/7532110/pexels-photo-7532110.jpeg",
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={inter.className}>
                    <QueryClientProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem={false}
                        >
                            {children}
                            <Toaster />
                        </ThemeProvider>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
