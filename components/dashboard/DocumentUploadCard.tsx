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

    const userId = useAuth().userId;

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

    const { user } = useClerk();

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
            className="group border-2 border-dashed rounded-lg p-6 h-64 flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30"
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
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload
                    className={`h-8 w-8 ${
                        isUploading ? "animate-pulse" : ""
                    } text-primary`}
                />
            </div>
            <h3 className="font-medium text-lg mb-1">Upload New</h3>
            {isUploading ? (
                <p className="text-sm text-primary text-center">Uploading...</p>
            ) : errors.file ? (
                <p className="text-sm text-destructive text-center">
                    {errors.file.message as string}
                </p>
            ) : uploadMutation.isError ? (
                <p className="text-sm text-destructive text-center">
                    {uploadMutation.error.message}
                </p>
            ) : (
                <p className="text-sm text-muted-foreground text-center">
                    Upload a PDF document to analyze
                </p>
            )}
        </div>
    );
}
