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
import { toast } from "@/hooks/use-toast";
import { hc } from "@/lib/honoClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";

import DocumentCard, { DocumentCardSkeleton } from "./DocumentCard";
import UploadCard from "./DocumentUploadCard";

export default function DocumentGrid() {
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [newName, setNewName] = useState("");

    const $get = hc.documents.$get;
    const { data: documents, isLoading } = useQuery<
        InferResponseType<typeof $get>
    >({
        queryKey: ["documents"],
        queryFn: async () => {
            const res = await $get();

            return res.json();
        },
    });

    const handleRename = (doc: any) => {
        setSelectedDocument(doc);
        setNewName(doc.name);
        setRenameDialogOpen(true);
    };

    const queryClient = useQueryClient();
    const $delete = hc.delete.$delete;

    const { mutate: handleDelete } = useMutation<
        InferResponseType<typeof $delete>,
        unknown,
        InferRequestType<typeof $delete>["query"]
    >({
        mutationFn: async (query) => {
            const res = await $delete({
                query,
            });

            const data = await res.json();

            if (res.status !== 200) {
                throw new Error(data.message);
            }

            return data;
        },
        onSuccess: ({ message }) => {
            queryClient.invalidateQueries({
                queryKey: ["documents"],
            });
            setDeleteDialogOpen(false);
            toast({
                title: message,
            });
        },
        onError: () => {
            setDeleteDialogOpen(false);
            toast({
                title: "Error deleting document",
                description: "Please try again later.",
                variant: "destructive",
            });
        },
    });

    const confirmRename = () => {
        // setDocuments((docs) =>
        //     docs.map((doc) =>
        //         doc.id === selectedDocument.id ? { ...doc, name: newName } : doc
        //     )
        // );
        // setRenameDialogOpen(false);
    };

    const confirmDelete = () => {
        // setDocuments((docs) =>
        //     docs.filter((doc) => doc.id !== selectedDocument.id)
        // );
        // setDeleteDialogOpen(false);
    };

    return (
        <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Documents</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <UploadCard />

                {isLoading
                    ? Array.from({ length: 11 }).map((_, index) => (
                          <DocumentCardSkeleton key={index} />
                      ))
                    : documents?.map((doc) => (
                          <DocumentCard
                              key={doc.id}
                              document={{
                                  id: doc.id,
                                  name: doc.name,
                                  lastAccessAt: doc.lastAccessedAt,
                              }}
                              onRename={handleRename}
                              onDelete={({ containerName, blobName }) =>
                                  handleDelete({ containerName, blobName })
                              }
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
                            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
