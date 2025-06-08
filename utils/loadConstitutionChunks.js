import fs from "fs";
import { Pinecone } from "@pinecone-database/pinecone";
import { embedText } from "../services/geminiService.js";
import dotenv from "dotenv";
import sheria from "../utils/The_Constitution_of_Kenya_2010.txt";

dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

const constitution = fs.readFileSync(sheria, "utf-8");
const chunks = constitution.match(/(.|[\r\n]){1,1000}/g);

const uploadChunks = async () => {
  for (let i = 0; i < chunks.length; i++) {
    const vector = await embedText(chunks[i]);
    await index.upsert([
      {
        id: `chunk-${i}`,
        values: vector,
        metadata: { text: chunks[i] },
      },
    ]);
  }

  console.log("Chunks uploaded!");
};

uploadChunks();
