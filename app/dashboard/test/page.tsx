import { hc } from "@/lib/honoClient";
import React from "react";

export default async function Page() {
    return (
        <div className="bg-red-300 dark:bg-red-900 min-h-screen flex items-center justify-center">
            <h1>Test</h1>
            <p>This is a test page.</p>
        </div>
    );
}
