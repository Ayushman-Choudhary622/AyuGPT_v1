"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Globe, ChevronDown, Trash2, Menu, X,
  Sparkles, Zap, RefreshCw,
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import { MODELS, PROVIDER_META } from "@/lib/models";

const WELCOME_MSGS = [
  "What would you like to explore today?",
  "Ask me anything — I'm powered by the world's best AI models.",
  "Ready to assist! Try asking me to search the web too. 🌐",
];

export default function ChatInterface() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [welcome] = useState(
    WELCOME_MSGS[Math.floor(Math.random() * WELCOME_MSGS.length)]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];
  const providerMeta = PROVIDER_META[currentModel.provider];

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setMessages } =
    useChat({
      api: "/api/chat",
      body: { model: selectedModel, webSearchEnabled },
      onError: (err) => console.error("[useChat] Error:", err),
    });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      const fakeEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
      handleSubmit(fakeEvent);
    }
  };

  // Stars for background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 4}s`,
  }));

  const grouped = MODELS.reduce<Record<string, typeof MODELS>>((acc, m) => {
    (acc[m.provider] = acc[m.provider] || []).push(m);
    return acc;
  }, {});

  return (
    <div className="relative flex h-screen w-screen overflow-hidden" style={{ background: '#050510' }}>

      {/* Stars */}
      <div className="starfield">
        {stars.map((s) => (
          <div key={s.id} className="star"
            style={{ left: s.left, top: s.top, "--duration": s.duration, "--delay": s.delay } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Ambient orbs */}
      <div className="orb absolute w-80 h-80 bg-purple-700/20 -left-20 top-0" style={{ filter: 'blur(100px)' }} />
      <div className="orb absolute w-64 h-64 bg-cyan-600/15 -right-10 bottom-20" style={{ filter: 'blur(80px)', animationDelay: '4s' }} />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Main layout ─────────────────────── */}
      <div className="relative z-10 flex flex-col w-full h-full">

        {/* Header */}
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="flex-shrink-0 flex items-center justify-between px-4 py-3 glass border-b border-white/5"
          style={{ borderBottom: '1px solid rgba(139,92,246,0.2)' }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.2))', border: '1px solid rgba(139,92,246,0.4)' }}>
              🧠
            </div>
            <div>
              <h1 className="text-xl font-black gradient-text leading-none">AyuGPT</h1>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Unified AI Assistant</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Web Search Toggle */}
            <button
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                webSearchEnabled
                  ? "text-cyan-300"
                  : "text-slate-400 hover:text-slate-300"
              }`}
              style={webSearchEnabled ? {
                background: 'rgba(6,182,212,0.15)',
                border: '1px solid rgba(6,182,212,0.4)',
                boxShadow: '0 0 15px rgba(6,182,212,0.2)',
              } : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web</span>
              <div className={`w-7 h-4 rounded-full transition-all duration-300 relative ${webSearchEnabled ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 ${webSearchEnabled ? 'left-3.5' : 'left-0.5'}`} />
              </div>
            </button>

            {/* Clear chat */}
            <button
              onClick={() => setMessages([])}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.header>

        {/* Model selector bar */}
        <div className="flex-shrink-0 px-4 py-2 border-b"
          style={{ borderColor: 'rgba(139,92,246,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="relative max-w-xs" ref={dropdownRef}>
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-left transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              <span className="text-base">{providerMeta.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="text-white font-semibold text-xs truncate block">{currentModel.name}</span>
                <span className={`text-xs ${providerMeta.color}`}>{providerMeta.label}</span>
              </div>
              {currentModel.badge && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${currentModel.badgeColor} text-white`}>
                  {currentModel.badge}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${modelOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {modelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
                  style={{
                    background: 'rgba(10,10,25,0.95)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.1)',
                    maxHeight: 380,
                    overflowY: 'auto',
                    minWidth: 280,
                  }}
                >
                  {(Object.entries(grouped) as [string, typeof MODELS][]).map(([provider, models]) => {
                    const meta = PROVIDER_META[provider as keyof typeof PROVIDER_META];
                    return (
                      <div key={provider}>
                        <div className="flex items-center gap-2 px-4 py-2 sticky top-0"
                          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                          <span className="text-sm">{meta.icon}</span>
                          <span className={`text-xs font-bold uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
                        </div>
                        {models.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
                            style={selectedModel === m.id ? { background: 'rgba(124,58,237,0.15)' } : {}}
                          >
                            <div>
                              <span className="text-sm font-semibold text-white block">{m.name}</span>
                              <span className="text-xs text-slate-500">{m.description}</span>
                            </div>
                            {m.badge && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${m.badgeColor} text-white ml-2 flex-shrink-0`}>
                                {m.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center h-full text-center pb-20"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl mb-6"
              >
                🧠
              </motion.div>
              <h2 className="text-3xl font-black gradient-text mb-3">AyuGPT</h2>
              <p className="text-slate-400 text-base max-w-sm mb-8">{welcome}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "✨ Write me a poem about AI",
                  "🌍 Search: Latest AI news",
                  "💡 Explain quantum computing",
                  "📝 Help me write an email",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      const fake = { target: { value: suggestion.replace(/^[^\s]+\s/, '') } } as React.ChangeEvent<HTMLTextAreaElement>;
                      handleInputChange(fake);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className="text-sm px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(139,92,246,0.2)',
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} message={msg} index={i} />
              ))}
              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(124,58,237,0.2))', border: '1px solid rgba(6,182,212,0.3)' }}>
                    🧠
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl glass"
                    style={{ borderBottomLeftRadius: 4 }}>
                    <div className="flex gap-1.5 items-center">
                      <div className="dot-bounce" />
                      <div className="dot-bounce" />
                      <div className="dot-bounce" />
                    </div>
                    <span className="text-xs text-slate-500 ml-1">
                      {webSearchEnabled ? "Searching web…" : "Thinking…"}
                    </span>
                  </div>
                </motion.div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.1 }}
          className="flex-shrink-0 px-4 pb-4 pt-2"
        >
          {/* Web search badge */}
          <AnimatePresence>
            {webSearchEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-2 flex items-center gap-2 text-xs text-cyan-400 px-3"
              >
                <Globe className="w-3 h-3" />
                Web search active — I&apos;ll search DuckDuckGo for your query
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="relative">
            <div className="flex gap-2 items-end glow-border rounded-2xl p-2"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={webSearchEnabled ? "Search the web + ask anything…" : "Message AyuGPT… (Enter to send, Shift+Enter for new line)"}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm resize-none outline-none px-2 py-2 max-h-40 leading-relaxed"
                style={{ minHeight: 42 }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 160) + "px";
                }}
                disabled={isLoading}
              />
              {isLoading ? (
                <button type="button" onClick={stop}
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-orange-400 hover:bg-orange-500/15 transition-all"
                  title="Stop">
                  <RefreshCw className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={!input.trim()}
                  className="btn-send flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30"
                  style={input.trim() ? {
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                  } : { background: 'rgba(255,255,255,0.08)' }}
                  title="Send (Enter)">
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-xs text-slate-600 mt-2">
            AyuGPT • {providerMeta.icon} {currentModel.name}
            {webSearchEnabled && " • 🌐 Web Search"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
