import {
    createDocument,
    deleteDocument,
} from "@/server/db/services/documentService";
import env from "@/server/env";
import {
    generateBlobNameWithTimestamp,
    getOriginalFilenameFromBlobName,
    isValidContainerName,
} from "@/server/helpers/azure-helpers";
import blobServiceClient from "@/server/lib/blob-service-client";
import { createRouter } from "@/server/lib/create-app";
import {
    BlobSASPermissions,
    generateBlobSASQueryParameters,
    SASProtocol,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const router = createRouter()
    .post(
        "/upload",
        zValidator(
            "form",
            z
                .object({
                    containerName: z.string().min(3).max(63),
                    file: z.instanceof(File),
                })
                .refine((data) => isValidContainerName(data.containerName), {
                    message: "Invalid container name.",
                })
        ),
        async (c) => {
            const { containerName, file } = c.req.valid("form");

            const containerClient =
                blobServiceClient.getContainerClient(containerName);
            await containerClient.createIfNotExists();

            const blobNameWithTimestamp = generateBlobNameWithTimestamp(
                file.name,
                new Date()
            );
            const blobClient = containerClient.getBlockBlobClient(
                blobNameWithTimestamp
            );

            await blobClient.upload(await file.arrayBuffer(), file.size, {
                blobHTTPHeaders: { blobContentType: file.type },
            });

            await createDocument({
                id: blobNameWithTimestamp,
                name: file.name,
                blobName: blobNameWithTimestamp,
                containerName,
                mimeType: file.type,
                size: file.size,
                userId: c.var.clerkAuth?.userId!,
            });

            return c.json({
                message: "Upload successful.",
                blobName: blobNameWithTimestamp,
            });
        }
    )
    .get(
        "/sas",
        zValidator(
            "query",
            z
                .object({
                    containerName: z.string().min(3).max(63),
                    blobName: z.string().min(1),
                    expiryTime: z.string(),
                })
                .refine((data) => isValidContainerName(data.containerName), {
                    message: "Invalid container name.",
                })
        ),
        async (c) => {
            const { containerName, blobName, expiryTime } =
                c.req.valid("query");
            const expiryDate = new Date(expiryTime);

            const containerClient =
                blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlobClient(blobName);

            const sasToken = generateBlobSASQueryParameters(
                {
                    containerName,
                    blobName,
                    permissions: BlobSASPermissions.parse("r"),
                    protocol: SASProtocol.Https,
                    startsOn: new Date(),
                    expiresOn: expiryDate,
                },
                new StorageSharedKeyCredential(
                    env.AZURE_STORAGE_ACCOUNT_NAME,
                    env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
                )
            ).toString();

            return c.json({
                sasUrl: `${blobClient.url}?${sasToken}`,
                name: getOriginalFilenameFromBlobName(blobName),
            });
        }
    )
    .delete(
        "/delete",
        zValidator(
            "query",
            z
                .object({
                    containerName: z.string().min(3).max(63),
                    blobName: z.string().min(1),
                })
                .refine((data) => isValidContainerName(data.containerName), {
                    message: "Invalid container name.",
                })
        ),
        async (c) => {
            const { containerName, blobName } = c.req.valid("query");

            const containerClient =
                blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlobClient(blobName);

            const res = await blobClient.deleteIfExists();

            if (!res.succeeded) {
                throw new Error("Blob deletion failed.");
            }

            await deleteDocument(blobName);

            return c.json({ message: "Blob deleted successfully." });
        }
    );

export default router;
