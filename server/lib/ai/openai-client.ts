import env from "@/server/env";
import { AzureClientOptions, AzureOpenAI } from "openai";

const options: AzureClientOptions = {
    endpoint: env.AZURE_OPENAI_API_ENDPOINT,
    apiKey: env.AZURE_OPENAI_API_KEY,
    apiVersion: env.AZURE_OPENAI_API_VERSION,
    deployment: env.AZURE_OPENAI_DEPLOYMENT_NAME,
} as const;

const openaiClient = new AzureOpenAI(options);

export default openaiClient;
