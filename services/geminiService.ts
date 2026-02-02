
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const fetchPunditGossip = async (raceName: string): Promise<string> => {
  try {
    // Correct initialization using named parameter and process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Act as an expert F1 pundit. Write a short, engaging 'Paddock Gossip' snippet about the upcoming ${raceName}. Mention a couple of key drivers or teams and some light-hearted speculation. Keep it under 150 words. Be witty and sound like a true insider.`;

    // Using recommended model and correct generateContent call
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Extracting text output using the .text property (not a method)
    return response.text || "The paddock is quiet right now... the AI pundit must be on a coffee break.";
  } catch (error) {
    console.error("Error fetching pundit gossip:", error);
    return "The paddock is quiet right now... the AI pundit must be on a coffee break.";
  }
};