import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(
    config({
        path: path.resolve(
            process.cwd(),
            process.env.NODE_ENV === "test" ? ".env.test" : ".env"
        ),
    })
);

const EnvSchema = z.object({
    NODE_ENV: z.string().default("development"),
    LOG_LEVEL: z.enum([
        "fatal",
        "error",
        "warn",
        "info",
        "debug",
        "trace",
        "silent",
    ]),
    CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    AZURE_STORAGE_ACCOUNT_CONNECTION_STRING: z.string(),
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY: z.string(),
    AZURE_STORAGE_ACCOUNT_NAME: z.string(),
    AZURE_BLOB_CONTAINER_NAME: z.string(),
    AZURE_BLOB_URL: z
        .string()
        .default(
            `https://${process.env.AZURE_BLOB_CONTAINER_NAME}.blob.core.windows.net`
        ),
});

export type env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
    console.error("❌ Invalid env:");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    process.exit(1);
}

export default env!;
