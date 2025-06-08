import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { embedText } from "./geminiService.js";

dotenv.config();

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

// Get the index
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export const getRelevantChunks = async (query) => {
  if (!query || query.trim() === "") {
    throw new Error("Query text to embed must not be empty");
  }

  const embedding = await embedText(query);

  const queryResult = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  return queryResult.matches.map((m) => m.metadata.text);
};
