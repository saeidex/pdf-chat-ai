"use client";

import { useToast } from "@/hooks/use-toast";
import { hc } from "@/lib/honoClient";
import {
    FileUploadFormSchema,
    fileUploadFormSchema,
} from "@/lib/validators/file-upload-schema";
import { useAuth, useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function UploadCard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        formState: { errors },
        reset,
        setValue,
        trigger,
    } = useForm<FileUploadFormSchema>({
        resolver: zodResolver(fileUploadFormSchema),
        defaultValues: {
            file: undefined,
        },
    });

    const $post = hc.upload.$post;

    const uploadMutation = useMutation<
        InferResponseType<typeof $post>,
        Error,
        InferRequestType<typeof $post>["form"]
    >({
        mutationFn: async (form) => {
            const response = await $post({
                form,
            });

            const data = await response.json();

            if (response.status === 400) {
                throw new Error(data.message);
            }

            return data;
        },
        onSuccess: (data) => {
            toast({
                title: data.message,
                duration: 3000,
            });

            reset();

            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
        onError: (error: Error) => {
            toast({
                title: "Upload Failed",
                description: error.message,
                variant: "destructive",
                duration: 5000,
            });
        },
        onSettled: () => {
            setIsUploading(false);
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setValue("file", files);
        const valid = await trigger("file");

        if (valid) {
            setIsUploading(true);
            const file = files[0];
            uploadMutation.mutate({
                file,
                containerName: "pdf-chat",
            });
        }
    };

    const triggerFileInput = () => {
        document.getElementById("pdf-upload-input")?.click();
    };

    return (
        <div
            onClick={triggerFileInput}
            className="group flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 p-6 transition-colors hover:border-primary/50"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") triggerFileInput();
            }}
            aria-label="Upload PDF document"
        >
            <input
                id="pdf-upload-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                {...register("file")}
                onChange={handleFileChange}
                onClick={(e) => {
                    (e.target as HTMLInputElement).value = "";
                }}
            />
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload
                    className={`h-8 w-8 ${
                        isUploading ? "animate-pulse" : ""
                    } text-primary`}
                />
            </div>
            <h3 className="mb-1 text-lg font-medium">Upload New</h3>
            {isUploading ? (
                <p className="text-center text-sm text-primary">Uploading...</p>
            ) : errors.file ? (
                <p className="text-center text-sm text-destructive">
                    {errors.file.message as string}
                </p>
            ) : uploadMutation.isError ? (
                <p className="text-center text-sm text-destructive">
                    {uploadMutation.error.message}
                </p>
            ) : (
                <p className="text-center text-sm text-muted-foreground">
                    Upload a PDF document to analyze
                </p>
            )}
        </div>
    );
}
