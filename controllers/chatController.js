import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getGeminiResponse } from "../services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleChat = async (req, res) => {
  const { question } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ error: "Question cannot be empty" });
  }

  try {
    const filePath = path.join(
      __dirname,
      "../utils/The_Constitution_of_Kenya_2010.txt"
    );
    const fullText = await fs.readFile(filePath, "utf-8");

    // Optional: Trim or split text if too long
    const context = fullText.slice(0, 10000);
    // adjust this as needed

    const answer = await getGeminiResponse(question, context);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
