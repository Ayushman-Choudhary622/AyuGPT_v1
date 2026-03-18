# 🧠 AyuGPT — Unified AI Assistant

A beautiful, free, multi-model AI chat application built with Next.js 15, Tailwind CSS, and the Vercel AI SDK.

## ✨ Features
- 🔷 **Google Gemini** (1.5 Flash, 1.5 Pro, 2.0 Flash)
- ⚡ **Groq** (Llama 3.3 70B, Llama 3 70B, Mixtral 8x7B)
- 🌐 **OpenRouter** (10+ free models)
- 🔍 **Web Search** powered by DuckDuckGo (no API key needed)
- ✨ Stunning animated UI with glassmorphism
- 📱 Fully responsive for tablet & mobile

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/ayugpt.git
cd ayugpt
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

## 🔑 API Keys (All Free, No CC)

| Service | Get Key | Free Tier |
|---------|---------|-----------|
| Google Gemini | https://aistudio.google.com/app/apikey | Very generous |
| Groq | https://console.groq.com/keys | Unlimited |
| OpenRouter | https://openrouter.ai/keys | :free models |

## 🌐 Deploy to Vercel (Free)

1. Push to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Add environment variables in Vercel dashboard
5. Deploy!

## 📁 Project Structure

```
ayugpt/
├── app/
│   ├── api/chat/route.ts    # AI streaming API
│   ├── globals.css           # Animations & styles
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── IntroAnimation.tsx    # Animated intro screen
│   ├── ChatInterface.tsx     # Main chat UI
│   └── MessageBubble.tsx     # Message rendering
└── lib/
    ├── models.ts             # Model definitions
    └── webSearch.ts          # DuckDuckGo search
```
