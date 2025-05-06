export function isValidContainerName(containerName: string): boolean {
    const regex = /^[a-z0-9][a-z0-9-]{2,61}[a-z0-9]$/;
    return regex.test(containerName);
}

export function sanitizeBlobName(originalName: string): string {
    const sanitized = originalName
        .toLowerCase()
        .replace(/[^a-z0-9-_.]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return sanitized || "file";
}

export function generateBlobNameWithTimestamp(
    originalName: string,
    timestamp: Date
): string {
    const timestampString = timestamp.toISOString().replace(/[:.]/g, "-");
    const sanitizedName = sanitizeBlobName(originalName);
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${timestampString}--${randomString}--${sanitizedName}`;
}

export function getOriginalFilenameFromBlobName(blobName: string): string {
    const parts = blobName.split("--");
    if (parts.length >= 3) {
        return parts.slice(2).join("--");
    }
    return blobName;
}
