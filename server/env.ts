import path from "node:path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
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

    // AZURE Storage Account
    AZURE_STORAGE_ACCOUNT_CONNECTION_STRING: z.string(),
    AZURE_STORAGE_ACCOUNT_ACCESS_KEY: z.string(),
    AZURE_STORAGE_ACCOUNT_NAME: z.string(),
    AZURE_BLOB_CONTAINER_NAME: z.string(),
    AZURE_BLOB_URL: z
        .string()
        .default(
            `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`
        ),

    // Azure OpenAI
    AZURE_OPENAI_API_ENDPOINT: z.string(),
    AZURE_OPENAI_API_KEY: z.string(),
    AZURE_OPENAI_DEPLOYMENT_NAME: z.string().default("gpt-4.1"),
    AZURE_OPENAI_API_VERSION: z.string().default("2024-04-01-preview"),
    AZURE_OPENAI_MODEL_NAME: z.string().default("gpt-4.1"),

    // Azure AI Search
    // AZURE_SEARCH_ENDPOINT: z.string(),
    // AZURE_SEARCH_KEY: z.string(),
    // AZURE_SEARCH_INDEX_NAME: z.string(),
});

export type env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
    console.error("❌ Invalid env:");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    process.exit(1);
}

export default env!;
