"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Zap, Globe, Brain } from "lucide-react";

interface Props {
  onEnter: () => void;
}

const FEATURES = [
  { icon: Brain, label: "Gemini 2.0 Flash", color: "text-blue-400" },
  { icon: Zap,   label: "Groq Llama 3.3",   color: "text-orange-400" },
  { icon: Globe, label: "Web Search AI",     color: "text-cyan-400" },
  { icon: Sparkles, label: "10+ Free Models", color: "text-violet-400" },
];

const TAGLINES = [
  "Your all-in-one AI companion.",
  "Powered by the world's best models.",
  "Free. Unlimited. Intelligent.",
];

export default function IntroAnimation({ onEnter }: Props) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowFeatures(true), 1200);
    const t2 = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length);
    }, 2500);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, []);

  // Generate stars
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 4}s`,
    size: Math.random() > 0.8 ? 3 : 2,
  }));

  return (
    <div className="relative w-full h-screen intro-bg flex items-center justify-center overflow-hidden">
      {/* Starfield */}
      <div className="starfield">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              "--duration": s.duration,
              "--delay": s.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Ambient orbs */}
      <div className="orb w-96 h-96 bg-purple-600/20 -left-32 top-1/4" style={{ position: 'absolute' }} />
      <div className="orb w-80 h-80 bg-cyan-500/15 -right-20 bottom-1/4" style={{ position: 'absolute', animationDelay: '3s' }} />
      <div className="orb w-64 h-64 bg-violet-500/20 left-1/2 -top-20" style={{ position: 'absolute', animationDelay: '1.5s' }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, duration: 0.8 }}
          className="relative mb-8"
        >
          {/* Outer spinning ring */}
          <div className="logo-ring absolute inset-0 rounded-full"
  style={{
    width: 140,
    height: 140,
    background: 'conic-gradient(from 0deg, transparent 0%, #7c3aed 25%, #06b6d4 50%, transparent 75%)',
    borderRadius: '50%',
    top: -10,
    left: -10,
    margin: 'auto',
  }}
/>
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 120, height: 120,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))',
              border: '2px solid rgba(139,92,246,0.5)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(6,182,212,0.2)',
            }}
          >
            <span style={{ fontSize: 52 }}>🧠</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-7xl md:text-8xl font-black tracking-tight gradient-text mb-3">
            AyuGPT
          </h1>
        </motion.div>

        {/* Animated tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="h-8 mb-10 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-lg text-slate-300 font-medium"
            >
              {TAGLINES[taglineIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Feature pills */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {FEATURES.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                  className="glass flex items-center gap-2 px-4 py-2 rounded-full"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm text-slate-300 font-medium">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, type: "spring", stiffness: 150 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={onEnter}
          className="relative group px-10 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            boxShadow: '0 0 30px rgba(124,58,237,0.5), 0 0 60px rgba(6,182,212,0.2)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Start Chatting
            <Sparkles className="w-5 h-5" />
          </span>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, #6d28d9, #0891b2)' }}
          />
        </motion.button>

        {/* Bottom badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-xs text-slate-500"
        >
          100% Free • No subscription • No credit card
        </motion.p>
      </div>
    </div>
  );
}
