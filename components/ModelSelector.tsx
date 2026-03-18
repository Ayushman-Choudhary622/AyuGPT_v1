'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cpu, Zap, Globe } from 'lucide-react';

export interface ModelOption {
  id: string;
  name: string;
  provider: 'gemini' | 'groq' | 'openrouter';
  providerLabel: string;
  description: string;
  badge?: string;
}

export const MODEL_LIST: ModelOption[] = [
  // Gemini
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
    providerLabel: 'Google',
    description: 'Fastest Gemini — great for most tasks',
    badge: 'NEW',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    providerLabel: 'Google',
    description: '1M context, deep reasoning',
    badge: 'PRO',
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    providerLabel: 'Google',
    description: 'Balanced speed and quality',
  },
  // Groq
  {
    id: 'llama-3.1-70b-versatile',
    name: 'Llama 3.1 70B',
    provider: 'groq',
    providerLabel: 'Groq · Meta',
    description: 'Powerful open-source model',
    badge: 'FAST',
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B Instant',
    provider: 'groq',
    providerLabel: 'Groq · Meta',
    description: 'Ultra-fast responses',
    badge: '⚡',
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    provider: 'groq',
    providerLabel: 'Groq · Mistral',
    description: '32K context Mixture-of-Experts',
  },
  {
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B',
    provider: 'groq',
    providerLabel: 'Groq · Google',
    description: "Google's efficient open model",
  },
  // OpenRouter free
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B',
    provider: 'openrouter',
    providerLabel: 'OpenRouter · Mistral',
    description: 'Free tier via OpenRouter',
    badge: 'FREE',
  },
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B',
    provider: 'openrouter',
    providerLabel: 'OpenRouter · Meta',
    description: 'Lightweight free model',
    badge: 'FREE',
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B',
    provider: 'openrouter',
    providerLabel: 'OpenRouter · Google',
    description: 'Free Gemma via OpenRouter',
    badge: 'FREE',
  },
];

const PROVIDER_CONFIG = {
  gemini: {
    color: '#4285f4',
    bg: 'rgba(66,133,244,0.15)',
    border: 'rgba(66,133,244,0.3)',
    icon: <Globe size={12} />,
    gradient: 'from-blue-500 to-cyan-400',
  },
  groq: {
    color: '#f96316',
    bg: 'rgba(249,99,22,0.12)',
    border: 'rgba(249,99,22,0.25)',
    icon: <Zap size={12} />,
    gradient: 'from-orange-500 to-yellow-400',
  },
  openrouter: {
    color: '#9b59b6',
    bg: 'rgba(155,89,182,0.12)',
    border: 'rgba(155,89,182,0.25)',
    icon: <Cpu size={12} />,
    gradient: 'from-purple-500 to-pink-400',
  },
};

interface Props {
  selected: ModelOption;
  onChange: (model: ModelOption) => void;
}

export default function ModelSelector({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const providers = ['all', 'gemini', 'groq', 'openrouter'] as const;
  const filtered = filter === 'all' ? MODEL_LIST : MODEL_LIST.filter((m) => m.provider === filter);
  const cfg = PROVIDER_CONFIG[selected.provider];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 btn-glow"
        style={{
          background: 'rgba(13,13,32,0.8)',
          border: `1px solid ${cfg.border}`,
          color: '#e2e8f0',
          minWidth: 200,
        }}
      >
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold"
          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
        >
          {cfg.icon}
          {selected.provider}
        </span>
        <span className="text-sm font-medium truncate flex-1 text-left">{selected.name}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="opacity-60" />
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full mt-2 left-0 z-50 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8,8,20,0.97)',
              border: '1px solid rgba(124,58,237,0.2)',
              backdropFilter: 'blur(20px)',
              width: 280,
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.1)',
            }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Filter tabs */}
            <div className="flex gap-1 p-2 border-b border-white/5">
              {providers.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className="flex-1 py-1 px-2 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    background: filter === p ? 'rgba(124,58,237,0.3)' : 'transparent',
                    color: filter === p ? '#c4b5fd' : 'rgba(148,163,184,0.7)',
                    border: filter === p ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Model list */}
            <div className="overflow-y-auto" style={{ maxHeight: 300 }}>
              {filtered.map((model) => {
                const mc = PROVIDER_CONFIG[model.provider];
                const isSelected = model.id === selected.id;
                return (
                  <motion.button
                    key={model.id}
                    onClick={() => { onChange(model); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                    style={{
                      background: isSelected ? 'rgba(124,58,237,0.15)' : 'transparent',
                      borderLeft: isSelected ? '2px solid #7c3aed' : '2px solid transparent',
                    }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                  >
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                      style={{ background: mc.bg, color: mc.color, border: `1px solid ${mc.border}` }}
                    >
                      {mc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-200 truncate">{model.name}</span>
                        {model.badge && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-bold"
                            style={{
                              background: mc.bg,
                              color: mc.color,
                              fontSize: '0.6rem',
                              border: `1px solid ${mc.border}`,
                            }}
                          >
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-50 truncate">{model.description}</p>
                    </div>
                    {isSelected && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: '#7c3aed', boxShadow: '0 0 8px #7c3aed' }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
