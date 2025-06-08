import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to get a response from Gemini based on context and question
export const getGeminiResponse = async (question, context) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an expert on the Constitution of Kenya. Only answer based on it.
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
