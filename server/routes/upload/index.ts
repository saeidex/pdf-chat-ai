import env from "@/server/env";
import {
    generateBlobNameWithTimestamp,
    getOriginalFilenameFromBlobName,
    isValidContainerName,
} from "@/server/helpers/azure-helpers";
import { createRouter } from "@/server/lib/create-app";
import {
    BlobSASPermissions,
    BlobServiceClient,
    generateBlobSASQueryParameters,
    SASProtocol,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

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
                return c.json(
                    { message: "Blob not found or already deleted." },
                    404
                );
            }

            return c.json({ message: "Blob deleted successfully." });
        }
    )
    // .get("/download", async (c) => {
    //     const { containerName, blobName } = c.req.query();

    //     const containerClient =
    //         blobServiceClient.getContainerClient(containerName);
    //     const blobClient = containerClient.getBlobClient(blobName);

    //     const downloadBlockBlobResponse = await blobClient.download();
    //     const stream = downloadBlockBlobResponse.readableStreamBody;

    //     c.res.headers.set(
    //         "Content-Type",
    //         downloadBlockBlobResponse.contentType!
    //     );
    //     c.res.headers.set(
    //         "Content-Disposition",
    //         `attachment; filename=${blobName}`
    //     );

    //     stream.pipe()
    // })
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

            const containerClient =
                blobServiceClient.getContainerClient(containerName);

            const blobs = [];

            for await (const blob of containerClient.listBlobsFlat({
                prefix,
            })) {
                const blobDetails = {
                    id: blob.name,
                    name: getOriginalFilenameFromBlobName(blob.name),
                    createdAt: blob.properties.createdOn,
                    lastModified: blob.properties.lastModified,
                    metadata: blob.metadata,
                    contentType: blob.properties.contentType,
                    sasUri: "",
                };

                if (includeSasUri === true) {
                    const blobClient = containerClient.getBlobClient(blob.name);
                    const sasToken = generateBlobSASQueryParameters(
                        {
                            containerName,
                            blobName: blob.name,
                            permissions: BlobSASPermissions.parse("r"),
                            protocol: SASProtocol.HttpsAndHttp,
                            startsOn: new Date(),
                            expiresOn: sasExpiryTime
                                ? new Date(sasExpiryTime)
                                : new Date(Date.now() + 3600 * 1000),
                        },
                        blobServiceClient.credential as any
                    ).toString();

                    blobDetails.sasUri = `${blobClient.url}?${sasToken}`;
                }

                blobs.push(blobDetails);
            }

            return c.json(blobs);
        }
    );

export default router;
