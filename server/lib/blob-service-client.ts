import env from "@/server/env";
import {
    BlobServiceClient,
    StorageSharedKeyCredential,
} from "@azure/storage-blob";

const blobServiceClient = new BlobServiceClient(
    env.AZURE_BLOB_URL,
    new StorageSharedKeyCredential(
        env.AZURE_STORAGE_ACCOUNT_NAME,
        env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
    )
);

export default blobServiceClient;
