import { Bot } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const TypingIndicator = () => (
    <div className="flex items-start mb-6 animate-in fade-in-0 slide-in-from-bottom-3">
        <Avatar className="h-8 w-8 mr-3 border-2 border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 flex items-center justify-center">
            <div className="flex items-center justify-center w-full h-full">
                <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            </div>
        </Avatar>
        <div className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center">
            <div className="flex space-x-2">
                <div
                    className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                    style={{
                        animationDelay: "0ms",
                        animationDuration: "1000ms",
                    }}
                />
                <div
                    className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                    style={{
                        animationDelay: "150ms",
                        animationDuration: "1000ms",
                    }}
                />
                <div
                    className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                    style={{
                        animationDelay: "300ms",
                        animationDuration: "1000ms",
                    }}
                />
            </div>
        </div>
    </div>
);

export default TypingIndicator;
