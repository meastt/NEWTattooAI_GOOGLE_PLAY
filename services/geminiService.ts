
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { consumeCredit, canGenerate } from "./creditService";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface EditImageResult {
  imageUrl: string | null;
  text: string | null;
}

export const editImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<EditImageResult> => {
  // Check if user has credits
  if (!canGenerate()) {
    throw new Error("Insufficient credits. Please upgrade to continue generating images.");
  }

  // Consume a credit before generation
  const creditResult = await consumeCredit();
  if (!creditResult.success) {
    throw new Error("Unable to consume credit. Please try again.");
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        imageConfig: {
          imageSize: '1K',
        },
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      console.error("Gemini API Response:", JSON.stringify(response, null, 2));
      throw new Error("API returned an empty or malformed response. Check logs for details.");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      } else if (part.text) {
        text = part.text;
      }
    }

    if (!imageUrl) {
      throw new Error("API did not return an image.");
    }

    return { imageUrl, text };
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image with AI. Please try again.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  // Check if user has credits
  if (!canGenerate()) {
    throw new Error("Insufficient credits. Please upgrade to continue generating images.");
  }

  // Consume a credit before generation
  const creditResult = await consumeCredit();
  if (!creditResult.success) {
    throw new Error("Unable to consume credit. Please try again.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
          imageSize: '1K',
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      console.error("Gemini API Response:", JSON.stringify(response, null, 2));
      throw new Error("API returned an empty or malformed response. Check logs for details.");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("API did not return any images.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image with AI. Please try again.");
  }
};
