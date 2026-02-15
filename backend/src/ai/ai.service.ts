import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  }

  async generateFlashcards(text: string) {
    try {
      const prompt = `Create flashcards JSON from the following text. Return ONLY valid JSON with this structure:
{
  "flashcards": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}

Text:
${text}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      throw error;
    }
  }
}
