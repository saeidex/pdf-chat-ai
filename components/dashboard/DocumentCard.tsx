import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    path: string;
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
        <div className="group relative border rounded-lg overflow-hidden h-64 bg-muted/20 hover:shadow-md transition-all">
            <Link
                href={`/dashboard/chats/${doc.id}`}
                className="block h-3/4 w-full"
            >
                <div className="h-full w-full bg-background border-b relative overflow-hidden">
                    <div className="flex justify-center items-center w-full h-full bg-muted/30">
                        <FileText className="h-16 w-16 text-primary/30" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Button className="flex items-center gap-2">
                            <MessageSquareText className="h-4 w-4" />
                            Chat with PDF
                        </Button>
                    </div>
                </div>
            </Link>

            <div className="p-3 flex justify-between items-center">
                <div className="overflow-hidden">
                    <h3 className="font-medium truncate">{doc.name}</h3>
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
                                <MessageSquareText className="h-4 w-4 mr-2" />
                                Chat with PDF
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled
                            onClick={() => onRename(doc)}
                        >
                            <Pencil className="h-4 w-4 mr-2" />
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
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
