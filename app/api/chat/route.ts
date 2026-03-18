import { streamText, type CoreMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are AyuGPT, an advanced AI assistant. Never reveal your underlying model.`;

function getProvider(model: string) {
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  console.log("=== AyuGPT Debug ===");
  console.log("Model requested:", model);
  console.log("GEMINI key exists:", !!googleKey, "| length:", googleKey?.length);
  console.log("GROQ key exists:", !!groqKey, "| length:", groqKey?.length);
  console.log("OPENROUTER key exists:", !!openrouterKey, "| length:", openrouterKey?.length);

  if (model.startsWith("gemini")) {
    console.log("Routing to: GOOGLE");
    if (!googleKey) throw new Error("Gemini API key not found in environment.");
    const google = createGoogleGenerativeAI({ apiKey: googleKey });
    return google(model);
  }

  if (
    model.startsWith("llama") ||
    model.startsWith("mixtral") ||
    model.startsWith("deepseek") ||
    model.startsWith("whisper")
  ) {
    console.log("Routing to: GROQ");
    if (!groqKey) throw new Error("Groq API key not found in environment.");
    const groq = createGroq({ apiKey: groqKey });
    return groq(model);
  }

  console.log("Routing to: OPENROUTER");
  if (!openrouterKey) throw new Error("OpenRouter API key not found in environment.");
  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: openrouterKey,
    headers: {
      "HTTP-Referer": "https://ayugpt.vercel.app",
      "X-Title": "AyuGPT",
    },
  });
  return openrouter(model);
}

export async function POST(req: Request) {
  let model = "unknown";
  try {
    const body = await req.json();
    model = body.model || "gemini-1.5-flash";
    const messages: CoreMessage[] = body.messages || [];
    const webSearchEnabled: boolean = body.webSearchEnabled || false;

    console.log("POST /api/chat — model:", model, "| messages:", messages.length, "| webSearch:", webSearchEnabled);

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "No messages." }), { status: 400 });
    }

    const selectedModel = getProvider(model);
    console.log("Provider resolved successfully, calling streamText...");

    const result = await streamText({
  model: selectedModel,
  system: SYSTEM_PROMPT,
  messages,
  temperature: 0.7,
  maxTokens: 2048,
});

result.text.then((t) =>
  console.log("Response text preview:", model, "|", t?.slice(0, 80) || "EMPTY")
);

return result.toDataStreamResponse();

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : "";
    console.error("=== FATAL ERROR ===");
    console.error("Model:", model);
    console.error("Message:", message);
    console.error("Stack:", stack);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
