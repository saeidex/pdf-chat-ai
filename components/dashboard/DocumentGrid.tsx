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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import DocumentCard from "./DocumentCard";
import UploadCard from "./DocumentUploadCard";

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
                <UploadCard />

                {documents.map((doc, index) => (
                    <DocumentCard
                        key={doc.id}
                        document={doc}
                        onRename={handleRename}
                        onDelete={handleDelete}
                    />
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
