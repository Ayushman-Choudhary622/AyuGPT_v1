export interface AIModel {
  id: string;
  name: string;
  provider: "google" | "groq" | "openrouter";
  description: string;
  badge?: string;
  badgeColor?: string;
}

export const MODELS: AIModel[] = [
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Latest Gemini — fast & multimodal",
    badge: "NEWEST",
    badgeColor: "from-emerald-500 to-teal-500",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "google",
    description: "1M context — most capable Gemini",
    badge: "PRO",
    badgeColor: "from-violet-500 to-purple-600",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "google",
    description: "Blazing fast Gemini for everyday use",
  },
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "groq",
    description: "Top open-source LLM via Groq",
    badge: "FAST",
    badgeColor: "from-orange-500 to-amber-500",
  },
  {
    id: "llama3-70b-8192",
    name: "Llama 3 70B",
    provider: "groq",
    description: "Meta's powerful Llama 3 model",
  },
  {
    id: "llama3-8b-8192",
    name: "Llama 3 8B Instant",
    provider: "groq",
    description: "Smallest Llama 3 — extremely fast",
    badge: "INSTANT",
    badgeColor: "from-cyan-500 to-blue-500",
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    provider: "groq",
    description: "Mixture-of-experts, 32K context",
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B",
    provider: "openrouter",
    description: "Lightweight but mighty open model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "google/gemma-2-9b-it:free",
    name: "Gemma 2 9B",
    provider: "openrouter",
    description: "Google's open Gemma 2 model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "meta-llama/llama-3.2-3b-instruct:free",
    name: "Llama 3.2 3B",
    provider: "openrouter",
    description: "Ultra-compact free Llama model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
  {
    id: "microsoft/phi-3-mini-128k-instruct:free",
    name: "Phi-3 Mini 128K",
    provider: "openrouter",
    description: "Microsoft's compact smart model",
    badge: "FREE",
    badgeColor: "from-pink-500 to-rose-500",
  },
];

export const PROVIDER_META = {
  google: { label: "Google Gemini", icon: "🔷", color: "text-blue-400" },
  groq: { label: "Groq", icon: "⚡", color: "text-orange-400" },
  openrouter: { label: "OpenRouter", icon: "🌐", color: "text-pink-400" },
};
