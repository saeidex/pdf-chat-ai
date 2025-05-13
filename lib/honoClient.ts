import type { AppType } from "@/server";
import { hc as honoClient } from "hono/client";

export const hc = honoClient<AppType>("http://localhost:3000/api");
