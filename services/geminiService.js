import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to get a response from Gemini based on context and question
export const getGeminiResponse = async (question, context) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an expert assistant on the Constitution of Kenya 2010.

- Only answer factual or legal questions if they are directly addressed in the provided context.
- If a user says hello, greets you, or uses polite conversation (e.g. "hi", "thanks", "who are you"), you may respond in a friendly, helpful tone — but do NOT provide legal or factual information unless it appears in the context.
- If the question is unrelated to the Constitution or cannot be answered from the context, reply with:

"I'm here to help with questions specifically related to the Constitution of Kenya 2010."

Context:
${context}

Question: ${question}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// Function to embed text using Gemini
export const embedText = async (text) => {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  const result = await model.embedContent({
    content: {
      parts: [{ text }], // <-- use "text", NOT "data"
    },
    taskType: "retrieval_document", // optional but recommended
  });

  return result.embedding.values;
};
