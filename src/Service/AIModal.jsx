import { GoogleGenerativeAI } from "@google/generative-ai";
  
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

if (!apiKey) {
  console.error("Google Gemini API key is not set. Please check your environment variables.");
  throw new Error("VITE_GOOGLE_GEMINI_AI_API_KEY is not set in environment variables.");
}

// Validate API key format (basic check)
if (apiKey && apiKey.length < 20) {
  console.warn("API key seems invalid. Please verify your Google Gemini API key.");
}

  const genAI = new GoogleGenerativeAI(apiKey);
  
// List of models to try in order (fallback mechanism)
// Updated with newer model names and variations
const MODEL_OPTIONS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-thinking-exp",
];
  
  const generationConfig = {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

// Function to generate content with a specific model using generateContent directly
const generateContentWithModel = async (modelName, prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig,
    });

    const result = await model.generateContent(prompt);
    return result;
  } catch (error) {
    console.error(`Error generating content with model ${modelName}:`, error);
    throw error;
  }
};

// Function to fetch available models from the API
const fetchAvailableModels = async () => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      console.warn("Could not fetch available models list");
      return null;
    }
    
    const data = await response.json();
    if (data.models && Array.isArray(data.models)) {
      const modelNames = data.models
        .map((model) => model.name?.replace("models/", ""))
        .filter((name) => name && name.includes("gemini"));
      console.log("Available models from API:", modelNames);
      return modelNames;
    }
    return null;
  } catch (error) {
    console.warn("Error fetching available models:", error);
    return null;
  }
};

// Function to list available models (for debugging)
export const listAvailableModels = async () => {
  try {
    const availableModels = await fetchAvailableModels();
    if (availableModels && availableModels.length > 0) {
      return availableModels;
    }
    console.log("Using default model options:", MODEL_OPTIONS);
    return MODEL_OPTIONS;
  } catch (error) {
    console.error("Error listing models:", error);
    return MODEL_OPTIONS;
  }
};

// Function to send message with fallback mechanism
export const sendMessageWithFallback = async (message) => {
  let lastError = null;
  const errors = [];
  
  // First, try to get available models from the API
  let modelsToTry = MODEL_OPTIONS;
  try {
    const availableModels = await fetchAvailableModels();
    if (availableModels && availableModels.length > 0) {
      // Prioritize available models, but keep fallback options
      modelsToTry = [...availableModels, ...MODEL_OPTIONS.filter(m => !availableModels.includes(m))];
      console.log("Using models from API:", modelsToTry);
    }
  } catch (error) {
    console.warn("Could not fetch available models, using default list:", error);
  }

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting to use model: ${modelName}`);
      const result = await generateContentWithModel(modelName, message);
      
      if (!result || !result.response) {
        throw new Error(`No response from model ${modelName}`);
      }

      const responseText = result.response.text();
      if (!responseText) {
        throw new Error(`Empty response from model ${modelName}`);
      }

      console.log(`Successfully used model: ${modelName}`);
      return {
        response: {
          text: () => responseText,
        },
      };
    } catch (error) {
      const errorMsg = error?.message || "Unknown error";
      // Only log 404 errors as warnings, others as errors
      if (errorMsg.includes("404") || errorMsg.includes("not found")) {
        console.warn(`Model ${modelName} not available:`, errorMsg);
      } else {
        console.error(`Model ${modelName} error:`, errorMsg);
      }
      errors.push(`${modelName}: ${errorMsg}`);
      lastError = error;
      continue;
    }
  }

  // If all models fail, provide helpful error message
  const allErrors = errors.join("; ");
  const helpfulMessage = `
All models failed. This usually means:
1. Your API key may not have access to Gemini models
2. The Generative AI API may not be enabled in your Google Cloud project
3. Your project may need billing enabled
4. Models may not be available in your region

To fix this:
- Visit https://aistudio.google.com/app/apikey to verify your API key
- Enable "Generative Language API" in Google Cloud Console
- Ensure billing is enabled for your project
- Check available models at https://ai.google.dev/models/gemini

Attempted models: ${modelsToTry.join(", ")}
Errors: ${allErrors}
  `.trim();
  
  throw new Error(helpfulMessage);
};

// Export for backward compatibility (not used but kept for safety)
export const chatSession = null;
  