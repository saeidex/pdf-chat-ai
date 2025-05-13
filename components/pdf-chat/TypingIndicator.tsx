import { Avatar } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

const TypingIndicator = () => (
    <div className="mb-6 flex items-start animate-in fade-in-0 slide-in-from-bottom-3">
        <Avatar className="mr-3 flex h-8 w-8 items-center justify-center border-2 border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex h-full w-full items-center justify-center">
                <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            </div>
        </Avatar>
        <div className="flex items-center rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
            <div className="flex space-x-2">
                <div
                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
                    style={{
                        animationDelay: "0ms",
                        animationDuration: "1000ms",
                    }}
                />
                <div
                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
                    style={{
                        animationDelay: "150ms",
                        animationDuration: "1000ms",
                    }}
                />
                <div
                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
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
