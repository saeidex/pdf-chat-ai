import env from "@/server/env";
import { createRouter } from "@/server/lib/create-app";
import {
    BlobSASPermissions,
    BlobServiceClient,
    generateBlobSASQueryParameters,
    SASProtocol,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { zValidator } from "@hono/zod-validator";
import { stream } from "hono/streaming";
import { z } from "zod";

import {
    generateBlobNameWithTimestamp,
    isValidContainerName,
} from "@/server/helpers/azure-helpers";

const blobServiceClient = new BlobServiceClient(
    env.AZURE_BLOB_URL,
    new StorageSharedKeyCredential(
        env.AZURE_STORAGE_ACCOUNT_NAME,
        env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
    )
);

const router = createRouter()
    .post(
        "/upload",
        zValidator(
            "form",
            z
                .object({
                    containerName: z.string().min(3).max(63),
                    blobName: z.string().min(1),
                    file: z.instanceof(File),
                })
                .refine((data) => isValidContainerName(data.containerName), {
                    message: "Invalid container name.",
                })
        ),
        async (c) => {
            const { containerName, blobName, file } = c.req.valid("form");
            const containerClient =
                blobServiceClient.getContainerClient(containerName);
            await containerClient.createIfNotExists();

            const blobNameWithTimestamp = generateBlobNameWithTimestamp(
                blobName,
                new Date()
            );
            const blobClient = containerClient.getBlockBlobClient(
                blobNameWithTimestamp
            );

            await blobClient.upload(await file.arrayBuffer(), file.size, {
                blobHTTPHeaders: { blobContentType: file.type },
            });

            c.json({
                message: "Upload successful.",
                blobName: blobNameWithTimestamp,
            });
        }
    )
    .get(
        "/download",
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

            const downloadBlockBlobResponse = await blobClient.download();
            const readableStreamBody =
                downloadBlockBlobResponse.readableStreamBody;

            c.header("Content-Disposition", `attachment; filename=${blobName}`);

            return stream(c, async (stream) => {
                if (readableStreamBody) {
                    readableStreamBody;
                } else {
                    throw new Error(
                        "Failed to download file: stream is undefined"
                    );
                }
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
                    expiryTime: z.date(),
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
                    protocol: SASProtocol.HttpsAndHttp,
                    startsOn: new Date(),
                    expiresOn: expiryDate,
                },
                blobServiceClient.credential as any
            ).toString();

            c.json({ sasUrl: `${blobClient.url}?${sasToken}` });
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

            await blobClient.deleteIfExists();

            c.json({ message: "Blob deleted successfully." });
        }
    )
    .get(
        "/list",
        zValidator(
            "query",
            z
                .object({
                    containerName: z.string().min(3).max(63),
                    prefix: z.string().optional(),
                    includeSasUri: z.boolean().default(true),
                    sasExpiryTime: z.string().optional(),
                })
                .refine((data) => isValidContainerName(data.containerName), {
                    message: "Invalid container name.",
                })
        ),
        async (c) => {
            let {
                containerName,
                prefix = undefined,
                includeSasUri = true,
                sasExpiryTime,
            } = c.req.valid("query");

            const sasET = sasExpiryTime
                ? new Date(sasExpiryTime)
                : new Date(Date.now() + 3600 * 1000);

            console.log("Query Parameters:", {
                containerName,
                prefix,
                includeSasUri,
                sasET,
            });

            const containerClient =
                blobServiceClient.getContainerClient(containerName);

            const blobs = [];
            const expiryDate = sasExpiryTime
                ? new Date(sasExpiryTime)
                : new Date(Date.now() + 3600 * 1000);

            console.log("SAS Expiry Date:", expiryDate);

            for await (const blob of containerClient.listBlobsFlat({
                prefix,
            })) {
                const blobDetails = {
                    name: blob.name,
                    createdOn: blob.properties.createdOn,
                    metadata: blob.metadata,
                    contentType: blob.properties.contentType,
                    sasUri: "",
                };

                if (includeSasUri === true && sasExpiryTime) {
                    console.log("Generating sas:", sasExpiryTime);
                    const blobClient = containerClient.getBlobClient(blob.name);
                    const sasToken = generateBlobSASQueryParameters(
                        {
                            containerName,
                            blobName: blob.name,
                            permissions: BlobSASPermissions.parse("r"),
                            protocol: SASProtocol.HttpsAndHttp,
                            startsOn: new Date(),
                            expiresOn: expiryDate,
                        },
                        blobServiceClient.credential as any
                    ).toString();

                    blobDetails.sasUri = `${blobClient.url}?${sasToken}`;
                    console.log("SAS URI:", blobDetails.sasUri);
                }

                blobs.push(blobDetails);
            }

            c.json(blobs);
        }
    );

export default router;
