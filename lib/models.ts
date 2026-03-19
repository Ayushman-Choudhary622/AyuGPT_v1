export interface AIModel {
  id: string;
  name: string;
  provider: "google" | "groq" | "openrouter";
  description: string;
  badge?: string;
  badgeColor?: string;
}

export const MODELS: AIModel[] = [
  // ── Google Gemini ──────────────────────────
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Latest fast multimodal Gemini",
    badge: "NEW",
    badgeColor: "from-emerald-500 to-teal-500",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Smartest Gemini model",
    badge: "BEST",
    badgeColor: "from-violet-500 to-purple-600",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "google",
    description: "Reliable everyday Gemini",
  },
  // ── Groq ───────────────────────────────────
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "groq",
    description: "Best Groq model — fast & smart",
    badge: "FAST",
    badgeColor: "from-orange-500 to-amber-500",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    provider: "groq",
    description: "Ultra-fast lightweight Llama",
    badge: "INSTANT",
    badgeColor: "from-cyan-500 to-blue-500",
  },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout 17B",
    provider: "groq",
    description: "Latest Llama 4 model",
    badge: "LATEST",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "meta-llama/llama-4-maverick-17b-128e-instruct",
    name: "Llama 4 Maverick 17B",
    provider: "groq",
    description: "Llama 4 with 128 experts MoE",
  },
  {
    id: "qwen-qwq-32b",
    name: "Qwen QwQ 32B",
    provider: "groq",
    description: "Powerful reasoning model",
  },
  // ── OpenRouter Free ─────────────────────────
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B",
    provider: "openrouter",
    description: "Lightweight open model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "meta-llama/llama-3.2-3b-instruct:free",
    name: "Llama 3.2 3B",
    provider: "openrouter",
    description: "Compact free Llama model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "google/gemma-3-4b-it:free",
    name: "Gemma 3 4B",
    provider: "openrouter",
    description: "Google latest free Gemma model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1",
    provider: "openrouter",
    description: "Powerful free reasoning model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
];

export const PROVIDER_META = {
  google: { label: "Google Gemini", icon: "🔷", color: "text-blue-400" },
  groq: { label: "Groq", icon: "⚡", color: "text-orange-400" },
  openrouter: { label: "OpenRouter", icon: "🌐", color: "text-pink-400" },
};
