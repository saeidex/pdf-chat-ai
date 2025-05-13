import type { AppType } from "@/server";
import { hc as honoClient } from "hono/client";

const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined"
        ? `${window.location.origin}/api`
        : "http://localhost:3000/api");

export const hc = honoClient<AppType>(apiUrl);
