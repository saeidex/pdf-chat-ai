import { z } from "zod";

export const fileUploadFormSchema = z.object({
    file: z
        .custom<FileList>((v) => v instanceof FileList && v.length > 0, {
            message: "Please select a file",
        })
        .refine((v) => v && v.length > 0, {
            message: "File is required",
        })
        .refine((v) => v && v[0]?.type === "application/pdf", {
            message: "Only PDF files are supported",
        })
        .refine((v) => v && v[0]?.size <= 10 * 1024 * 1024, {
            message: "File size must be less than 10MB",
        }),
});

export type FileUploadFormSchema = z.infer<typeof fileUploadFormSchema>;
