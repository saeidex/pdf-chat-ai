import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import {
    FileText,
    MessageSquareText,
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";
import Link from "next/link";

interface Document {
    id: string;
    name: string;
    lastAccessAt: string;
}

interface DocumentCardProps {
    document: Document;
    onRename: (doc: Document) => void;
    onDelete: ({
        containerName,
        blobName,
    }: {
        containerName: string;
        blobName: string;
    }) => void;
}

export default function DocumentCard({
    document: doc,
    onRename,
    onDelete,
}: DocumentCardProps) {
    return (
        <div className="group relative h-64 overflow-hidden rounded-lg border bg-muted/20 transition-all hover:shadow-md">
            <Link
                href={`/dashboard/chats/${doc.id}`}
                className="block h-3/4 w-full"
            >
                <div className="relative h-full w-full overflow-hidden border-b bg-background">
                    <div className="flex h-full w-full items-center justify-center bg-muted/30">
                        <FileText className="h-16 w-16 text-primary/30" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all group-hover:opacity-100">
                        <Button className="flex items-center gap-2">
                            <MessageSquareText className="h-4 w-4" />
                            Chat
                        </Button>
                    </div>
                </div>
            </Link>

            <div className="flex items-center justify-between p-3">
                <div className="overflow-hidden">
                    <h3 className="truncate font-medium">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(doc.lastAccessAt), {
                            addSuffix: true,
                        })}
                    </p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Options</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/chats/${doc.id}`}>
                                <MessageSquareText className="mr-2 h-4 w-4" />
                                Chat
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled
                            onClick={() => onRename(doc)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                                onDelete({
                                    containerName: "pdf-chat",
                                    blobName: doc.id,
                                })
                            }
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export function DocumentCardSkeleton() {
    return (
        <div className="h-64 overflow-hidden rounded-lg border">
            <div className="relative h-3/4 w-full overflow-hidden border-b bg-background">
                <Skeleton className="h-full w-full" />
            </div>

            <div className="flex items-center justify-between p-3">
                <div className="w-full space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    );
}
