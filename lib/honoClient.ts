import { hc as honoClient } from "hono/client";
import type { AppType } from "@/server";

export const hc = honoClient<AppType>("http://localhost:3000/api");
