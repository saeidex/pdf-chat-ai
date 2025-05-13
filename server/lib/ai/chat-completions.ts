import env from "@/server/env";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

import openaiClient from "./openai-client";

export const createChatCompletions = async (
    messages: ChatCompletionMessageParam[]
) => {
    const model = env.AZURE_OPENAI_MODEL_NAME;

    const response = await openaiClient.chat.completions.create({
        messages,
        stream: true,
        max_completion_tokens: 2000,
        temperature: 1.2,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        model,
    });

    return response;
};
