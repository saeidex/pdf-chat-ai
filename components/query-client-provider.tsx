"use client";

import {
    QueryClientProvider as _QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

export default function QueryClientProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <_QueryClientProvider client={queryClient}>
            {children}
        </_QueryClientProvider>
    );
}
