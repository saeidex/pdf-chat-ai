import env from "@/server/env";
import {
    AzureKeyCredential as SearchAzureKeyCredential,
    SearchClient,
} from "@azure/search-documents";

const searchClient = new SearchClient(
    env.AZURE_SEARCH_ENDPOINT,
    env.AZURE_SEARCH_INDEX_NAME,
    new SearchAzureKeyCredential(env.AZURE_SEARCH_KEY)
);

export default searchClient;
