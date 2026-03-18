import { streamText, type CoreMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { webSearch } from "@/lib/webSearch";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are AyuGPT, an advanced unified AI assistant created to be helpful and incredibly smart. You were built to be the most capable and friendly AI assistant available. You have access to web search capabilities and can provide up-to-date information.

Key traits:
- Extremely knowledgeable and helpful
- Clear, structured responses with markdown formatting
- Friendly and engaging conversational style
- Honest about limitations
- Never reveal your underlying model or API provider
- Always introduce yourself as AyuGPT when asked about your identity

When web search results are provided, use them to give accurate, current information while clearly indicating the information comes from a web search.`;

function getProvider(model: string) {
  const googleKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  if (model.startsWith("gemini")) {
    if (!googleKey) throw new Error("GEMINI_API_KEY is not set.");
    const google = createGoogleGenerativeAI({ apiKey: googleKey });
    return google(model);
  }

  if (
    model.startsWith("llama") ||
    model.startsWith("mixtral") ||
    model.startsWith("whisper") ||
    model.startsWith("deepseek")
  ) {
    if (!groqKey) throw new Error("GROQ_API_KEY is not set.");
    const groq = createGroq({ apiKey: groqKey });
    return groq(model);
  }

  // Everything else → OpenRouter
  if (!openrouterKey) throw new Error("OPENROUTER_API_KEY is not set.");
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
  try {
    const body = await req.json();
    const {
      messages,
      model = "gemini-1.5-flash",
      webSearchEnabled = false,
    }: {
      messages: CoreMessage[];
      model: string;
      webSearchEnabled: boolean;
    } = body;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build system prompt, optionally enriched with web search
    let systemContent = SYSTEM_PROMPT;

    if (webSearchEnabled) {
      const lastUserMessage = messages
        .filter((m) => m.role === "user")
        .at(-1);

      if (lastUserMessage) {
        const query =
          typeof lastUserMessage.content === "string"
            ? lastUserMessage.content
            : Array.isArray(lastUserMessage.content)
            ? lastUserMessage.content
                .filter((c) => c.type === "text")
                .map((c) => (c as { type: "text"; text: string }).text)
                .join(" ")
            : "";

        if (query.trim()) {
          const searchResults = await webSearch(query.slice(0, 300));
          if (searchResults) {
            systemContent += `\n\n--- LIVE WEB SEARCH CONTEXT ---\n${searchResults}\n--- END WEB CONTEXT ---\n\nUse the above search results to give an accurate, up-to-date answer. Cite that the info comes from a web search.`;
          }
        }
      }
    }

    const selectedModel = getProvider(model);

    const result = await streamText({
      model: selectedModel,
      system: systemContent,
      messages,
      temperature: 0.7,
      maxTokens: 4096,
    });

    return result.toDataStreamResponse();
  } catch (error: unknown) {
    console.error("[/api/chat] Error:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
