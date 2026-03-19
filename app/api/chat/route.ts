import { type NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are AyuGPT, an advanced unified AI assistant created to be helpful and incredibly smart. Never reveal your underlying model or API provider. Always introduce yourself as AyuGPT.`;

type Message = { role: string; content: string };

function toGeminiFormat(messages: Message[]) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

function toOpenAIFormat(messages: Message[], system: string) {
  return [
    { role: "system", content: system },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];
}

function makeStream(
  fn: (controller: ReadableStreamDefaultController) => Promise<void>
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await fn(controller);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        controller.enqueue(
          encoder.encode(`0:${JSON.stringify("⚠️ Error: " + msg)}\n`)
        );
      } finally {
        controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  });
}

async function streamGemini(
  model: string,
  messages: Message[],
  apiKey: string
): Promise<Response> {
  const encoder = new TextEncoder();
  return makeStream(async (controller) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            {
              role: "model",
              parts: [{ text: "Understood. I am AyuGPT, ready to help!" }],
            },
            ...toGeminiFormat(messages),
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini ${res.status}: ${err.slice(0, 300)}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          const text =
            json.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (text)
            controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
        } catch {}
      }
    }
  });
}

async function streamOpenAICompat(
  baseURL: string,
  model: string,
  messages: Message[],
  apiKey: string,
  extraHeaders: Record<string, string> = {}
): Promise<Response> {
  const encoder = new TextEncoder();
  return makeStream(async (controller) => {
    const res = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...extraHeaders,
      },
      body: JSON.stringify({
        model,
        messages: toOpenAIFormat(messages, SYSTEM_PROMPT),
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API ${res.status}: ${err.slice(0, 300)}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          const text = json.choices?.[0]?.delta?.content || "";
          if (text)
            controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
        } catch {}
      }
    }
  });
}

export async function POST(req: NextRequest) {
  let modelId = "gemini-2.0-flash";
  try {
    const body = await req.json();
    modelId = body.model || "gemini-2.0-flash";
    const messages: Message[] = body.messages || [];

    console.log("→ model:", modelId, "| msgs:", messages.length);

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "No messages." }), {
        status: 400,
      });
    }

    const geminiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      "";
    const groqKey = process.env.GROQ_API_KEY || "";
    const orKey = process.env.OPENROUTER_API_KEY || "";

    // ── Gemini ──────────────────────────────────
    if (modelId.startsWith("gemini")) {
      console.log("→ Routing to Gemini");
      return await streamGemini(modelId, messages, geminiKey);
    }

    // ── Groq ────────────────────────────────────
    // Groq models: llama-*, qwen/*, meta-llama/llama-4-*
    if (
  modelId.startsWith("llama") ||
  modelId.startsWith("qwen") ||
  modelId.startsWith("meta-llama/llama-4") ||
  modelId.startsWith("deepseek-r2") ||
  modelId.startsWith("gemma2")
  ) {
      console.log("→ Routing to Groq");
      return await streamOpenAICompat(
        "https://api.groq.com/openai/v1",
        modelId,
        messages,
        groqKey
      );
    }

    // ── OpenRouter ──────────────────────────────
    console.log("→ Routing to OpenRouter");
    return await streamOpenAICompat(
      "https://openrouter.ai/api/v1",
      modelId,
      messages,
      orKey,
      {
        "HTTP-Referer": "https://ayu-gpt-v1.vercel.app",
        "X-Title": "AyuGPT",
      }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("FATAL:", modelId, msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
    }
