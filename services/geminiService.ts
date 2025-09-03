
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

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
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
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
      },
    });
    
    let imageUrl: string | null = null;
    let text: string | null = null;

    for (const part of response.candidates[0].content.parts) {
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
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("API did not return any images.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image with AI. Please try again.");
  }
};
