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
    description: "Smartest Gemini model available",
    badge: "BEST",
    badgeColor: "from-violet-500 to-purple-600",
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
    description: "Ultra-fast lightweight model",
    badge: "INSTANT",
    badgeColor: "from-cyan-500 to-blue-500",
  },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout 17B",
    provider: "groq",
    description: "Latest Llama 4 on Groq",
    badge: "LATEST",
    badgeColor: "from-pink-500 to-rose-500",
  },
  // ── OpenRouter Free ─────────────────────────
  {
    id: "meta-llama/llama-4-maverick:free",
    name: "Llama 4 Maverick",
    provider: "openrouter",
    description: "Meta's powerful free Llama 4",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek V3",
    provider: "openrouter",
    description: "Top free coding & reasoning model",
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
  {
    id: "google/gemini-2.5-pro-exp-03-25:free",
    name: "Gemini 2.5 Pro Free",
    provider: "openrouter",
    description: "Google's best model for free",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "qwen/qwq-32b:free",
    name: "Qwen QwQ 32B",
    provider: "openrouter",
    description: "Strong reasoning free model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "mistralai/mistral-small-3.1-24b-instruct:free",
    name: "Mistral Small 3.1 24B",
    provider: "openrouter",
    description: "Fast & capable free Mistral",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
];

export const PROVIDER_META = {
  google: { label: "Google Gemini", icon: "🔷", color: "text-blue-400" },
  groq: { label: "Groq", icon: "⚡", color: "text-orange-400" },
  openrouter: { label: "OpenRouter", icon: "🌐", color: "text-pink-400" },
};
