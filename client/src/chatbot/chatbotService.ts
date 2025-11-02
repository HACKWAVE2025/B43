import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Validate API key before initializing
if (!apiKey || apiKey.trim() === "") {
  console.error("VITE_OPENAI_API_KEY is not set in environment variables");
}

const client = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
}) : null;

export async function getOpenAIResponse(prompt: string) {
  // Check if API key is configured
  if (!apiKey || !apiKey.trim()) {
    console.error("OpenAI API Error: VITE_OPENAI_API_KEY is missing or empty");
    return "⚠️ Configuration error: OpenAI API key is not set. Please add VITE_OPENAI_API_KEY to your .env file.";
  }

  if (!client) {
    return "⚠️ Configuration error: Unable to initialize OpenAI API client.";
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content || "No response";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    
    // Provide more specific error messages
    if (error.message?.includes("API_KEY") || error.message?.includes("Invalid API key")) {
      return "⚠️ Invalid API key. Please check your VITE_OPENAI_API_KEY in the .env file.";
    }
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      return "⚠️ API quota exceeded. Please try again later.";
    }
    if (error.message?.includes("rate_limit")) {
      return "⚠️ Rate limit exceeded. Please try again in a moment.";
    }
    
    // Generic error with more info
    return `⚠️ Sorry, I couldn't process your request right now. ${error.message || "Unknown error"}`;
  }
}
