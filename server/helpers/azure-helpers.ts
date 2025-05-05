export function isValidContainerName(containerName: string): boolean {
    const regex = /^[a-z0-9][a-z0-9-]{2,61}[a-z0-9]$/;
    return regex.test(containerName);
}

export function generateBlobNameWithTimestamp(
    originalName: string,
    timestamp: Date
): string {
    const timestampString = timestamp.toISOString().replace(/[:.]/g, "-");
    const fileExtension = originalName.split(".").pop();
    return `${timestampString}-${originalName}.${fileExtension}`;
}
