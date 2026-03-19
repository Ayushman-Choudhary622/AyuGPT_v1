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
    description: "Ultra-fast lightweight model",
    badge: "INSTANT",
    badgeColor: "from-cyan-500 to-blue-500",
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    provider: "groq",
    description: "Google Gemma 2 via Groq",
  },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout 17B",
    provider: "groq",
    description: "Latest Llama 4 preview model",
    badge: "LATEST",
    badgeColor: "from-pink-500 to-rose-500",
  },
  // ── OpenRouter Free ─────────────────────────
  {
    id: "openrouter/free",
    name: "OpenRouter Auto Free",
    provider: "openrouter",
    description: "Auto picks best free model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B Free",
    provider: "openrouter",
    description: "Powerful Llama 3.3 for free",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash Free",
    provider: "openrouter",
    description: "Gemini 2.0 via OpenRouter free",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B",
    provider: "openrouter",
    description: "Lightweight open model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "NVIDIA Nemotron 120B",
    provider: "openrouter",
    description: "NVIDIA's powerful free model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
];

export const PROVIDER_META = {
  google: { label: "Google Gemini", icon: "🔷", color: "text-blue-400" },
  groq: { label: "Groq", icon: "⚡", color: "text-orange-400" },
  openrouter: { label: "OpenRouter", icon: "🌐", color: "text-pink-400" },
};
