"use client";

import { hc } from "@/lib/honoClient";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
    const { data } = useQuery({
        queryKey: ["sas", "pdf-chat", "2025-05-06T05-13-20-753Z--output.pdf"],
        queryFn: async () => {
            const response = await hc.sas.$get({
                query: {
                    containerName: "pdf-chat",
                    blobName: "2025-05-06T05-13-20-753Z--output.pdf",
                    expiryTime: new Date(
                        Date.now() + 1000 * 60 * 60 * 24
                    ).toISOString(),
                },
            });

            return response.json();
        },
    });

    return (
        <div className="bg-red-300 dark:bg-red-900 min-h-screen flex items-center justify-center">
            <h1>Test</h1>
            <p>This is a test page.</p>
            <p>{data?.sasUrl}</p>
        </div>
    );
}
