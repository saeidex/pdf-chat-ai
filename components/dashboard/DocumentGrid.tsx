"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import {
    FileText,
    MessageSquareText,
    MoreVertical,
    Pencil,
    Trash2,
    Upload,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";

const initialDocuments = [
    {
        id: "1",
        name: "A half-hour to learn Rust",
        createdAt: "2025-04-15T10:30:00Z",
        updatedAt: "2025-04-15T10:30:00Z",
        preview: "/previews/rust-preview.png",
        path: "/mock-pdf/A half-hour to learn Rust.pdf",
    },
    {
        id: "2",
        name: "Chapter-9 Polymorphism",
        createdAt: "2025-04-20T14:45:00Z",
        updatedAt: "2025-04-20T14:45:00Z",
        preview: "/previews/polymorphism-preview.png",
        path: "/mock-pdf/Chapter-9 Polymorphism.pptx.pdf",
    },
    {
        id: "3",
        name: "Mozilla Documentation",
        createdAt: "2025-04-28T09:15:00Z",
        updatedAt: "2025-04-28T09:15:00Z",
        preview: "/previews/mozilla-preview.png",
        path: "/mock-pdf/mozilla.pdf",
    },
];

export default function DocumentGrid() {
    const [documents, setDocuments] = useState(initialDocuments);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [newName, setNewName] = useState("");

    const handleRename = (doc: any) => {
        setSelectedDocument(doc);
        setNewName(doc.name);
        setRenameDialogOpen(true);
    };

    const handleDelete = (doc: any) => {
        setSelectedDocument(doc);
        setDeleteDialogOpen(true);
    };

    const confirmRename = () => {
        setDocuments((docs) =>
            docs.map((doc) =>
                doc.id === selectedDocument.id ? { ...doc, name: newName } : doc
            )
        );
        setRenameDialogOpen(false);
    };

    const confirmDelete = () => {
        setDocuments((docs) =>
            docs.filter((doc) => doc.id !== selectedDocument.id)
        );
        setDeleteDialogOpen(false);
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Documents</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Upload card */}
                <div className="group border-2 border-dashed rounded-lg p-6 h-64 flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg mb-1">Upload New</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        Upload a PDF document to analyze
                    </p>
                </div>

                {/* Document cards */}
                {documents.map((doc, index) => (
                    <Fragment key={doc.id}>
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
                                    <h3 className="font-medium truncate">
                                        {doc.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(doc.updatedAt),
                                            {
                                                addSuffix: true,
                                            }
                                        )}
                                    </p>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                            <span className="sr-only">
                                                Options
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={`/dashboard/chats/${doc.id}`}
                                            >
                                                <MessageSquareText className="h-4 w-4 mr-2" />
                                                Chat with PDF
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleRename(doc)}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Rename
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleDelete(doc)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </Fragment>
                ))}
            </div>

            <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Document</DialogTitle>
                        <DialogDescription>
                            Enter a new name for your document.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="my-4"
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRenameDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={confirmRename}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your document.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
