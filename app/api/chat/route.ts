import { streamText, type CoreMessage } from "ai";
import { google } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are AyuGPT, an advanced unified AI assistant. Be helpful and smart. Never reveal your underlying model or provider.`;

function getProvider(model: string) {
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  console.log("Model:", model, "| Keys:", { g: !!googleKey, groq: !!groqKey, or: !!openrouterKey });

  if (model.startsWith("gemini")) {
    if (!googleKey) throw new Error("Missing GEMINI key");
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = googleKey;
    return google(model);
  }

  if (model.startsWith("llama") || model.startsWith("mixtral") || model.startsWith("deepseek")) {
    if (!groqKey) throw new Error("Missing GROQ key");
    const groq = createGroq({ apiKey: groqKey });
    return groq(model);
  }

  if (!openrouterKey) throw new Error("Missing OPENROUTER key");
  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: openrouterKey,
    headers: {
      "HTTP-Referer": "https://ayu-gpt-v1.vercel.app",
      "X-Title": "AyuGPT",
    },
  });
  return openrouter(model);
}

export async function POST(req: Request) {
  let modelId = "gemini-1.5-flash";
  try {
    const body = await req.json();
    modelId = body.model || "gemini-1.5-flash";
    const messages: CoreMessage[] = body.messages || [];

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "No messages." }), { status: 400 });
    }

    const selectedModel = getProvider(modelId);

    const result = await streamText({
      model: selectedModel,
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      maxTokens: 2048,
      onFinish: ({ text, finishReason }) => {
        console.log("Done:", modelId, "| reason:", finishReason, "| length:", text?.length ?? 0);
      },
    });

    return result.toDataStreamResponse();

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("ERROR for", modelId, ":", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
