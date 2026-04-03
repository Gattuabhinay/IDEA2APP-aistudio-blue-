import { GoogleGenAI, Type } from "@google/genai";
import { JournalEntry } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function analyzeJournalEntry(content: string, mood: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this journal entry (Mood: ${mood}): "${content}"`,
    config: {
      systemInstruction: "You are an empathetic wellness coach. Analyze the user's journal entry and provide emotional insights, key themes, and a helpful wellness suggestion in JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: {
            type: Type.STRING,
            description: "A brief summary of the emotional tone.",
          },
          themes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key topics or recurring themes.",
          },
          suggestion: {
            type: Type.STRING,
            description: "A personalized wellness tip or action.",
          },
        },
        required: ["sentiment", "themes", "suggestion"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(text) as JournalEntry["aiInsights"];
}
