import { GoogleGenAI, Type } from "@google/genai";
import { QuestionPaperContent } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // For Netlify/production, use import.meta.env with VITE_ prefix
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Debug logging (remove after fixing)
    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      envKeys: Object.keys(import.meta.env),
    });
    
    if (!apiKey) {
      throw new Error("API key is missing. Please provide a valid API key in your environment variables.");
    }
    
    this.ai = new GoogleGenAI({ apiKey });
  }

  async processImage(base64Image: string): Promise<QuestionPaperContent> {
    const modelName = 'gemini-3-flash-preview';
    const prompt = `
      ACT AS A HIGH-SPEED, HIGH-PRECISION SINDHI & ENGLISH OCR ENGINE.
      
      TASK: Transcribe the text from the image EXACTLY as written. 
      SINDHI ALPHABET: 52 letters. Distinguish precisely between dots and strokes (e.g., ڪ vs گھ, ب vs ي, ت vs ٿ vs ٽ vs ٺ, ڄ vs ڃ).

      STRICT VERBATIM RULES:
      1. TRANSCRIPTION ONLY: Do not add any words, labels, or numbering that are not in the image.
      2. NO INFERRED LABELS: Do not add "Class:", "Subject:", or "Date:" prefixes. If the image has "Class: VIII", capture the whole string. If it only has "VIII", only capture "VIII".
      3. NO INFERRED NUMBERING: Do not add "Question 1" or "سوال" unless it is physically written in the image.
      4. EMPTY FIELDS: If a header field (like Institution or Date) is not present, return an empty string "".
      
      JSON MAPPING:
      - institutionName: Verbatim text from the topmost section.
      - examName: Verbatim title text below institution.
      - subject: Text associated with subject info.
      - classGrade: Text associated with class info.
      - totalMarks: Marks value.
      - timeAllowed: Time value.
      - date: Date value.
      - sections: Array of objects { title, instructions, questions: [{text, marks}] }.
      
      Ensure the 'text' in questions is the full verbatim line including any numbering present in the image.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              institutionName: { type: Type.STRING },
              examName: { type: Type.STRING },
              subject: { type: Type.STRING },
              classGrade: { type: Type.STRING },
              totalMarks: { type: Type.STRING },
              timeAllowed: { type: Type.STRING },
              date: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    instructions: { type: Type.STRING },
                    questions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          marks: { type: Type.STRING }
                        },
                        required: ["text"]
                      }
                    }
                  },
                  required: ["questions"]
                }
              }
            },
            required: ["sections"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No transcription data returned.");

      const parsed = JSON.parse(text) as QuestionPaperContent;
      
      return {
        institutionName: parsed.institutionName || "",
        examName: parsed.examName || "",
        subject: parsed.subject || "",
        classGrade: parsed.classGrade || "",
        totalMarks: parsed.totalMarks || "",
        timeAllowed: parsed.timeAllowed || "",
        date: parsed.date || "",
        sections: parsed.sections || []
      };
    } catch (error: any) {
      console.error("OCR Error:", error);
      throw new Error(`OCR Failed: ${error.message || 'Check image clarity.'}`);
    }
  }
}

export const geminiService = new GeminiService();
