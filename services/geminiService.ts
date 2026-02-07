
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

// Initialize Gemini with the API key from environment variables
// Fix: Use process.env.API_KEY directly as per guidelines
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const chatWithGemini = async (
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
  useThinking: boolean = false
): Promise<string> => {
  const ai = getAIClient();
  const modelName = useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const config: any = {
    temperature: 0.7,
  };

  if (useThinking) {
    // Setting thinking budget for Gemini 3 series model to enable enhanced reasoning
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      ...history.map(h => ({ role: h.role, parts: h.parts })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config
  });

  // Access the generated text content directly from the property
  return response.text || "I'm sorry, I couldn't process that request.";
};

export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  const ai = getAIClient();
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  // Poll for operation completion with a recommended 10-second interval
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");
  
  // Append the API key to the download link as required for fetching the MP4 bytes
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text || "Failed to analyze image.";
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      // Set response modalities to AUDIO for text-to-speech generation
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("TTS failed");
  return base64Audio;
};