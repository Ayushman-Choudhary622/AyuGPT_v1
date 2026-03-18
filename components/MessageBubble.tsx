"use client";

import { type Message } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { User, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  message: Message;
  index: number;
}

export default function MessageBubble({ message, index }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.34, 1.2, 0.64, 1] }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} group`}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold self-start mt-1"
        style={
          isUser
            ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }
            : { background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(124,58,237,0.2))', border: '1px solid rgba(6,182,212,0.3)' }
        }
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <span>🧠</span>}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className="relative px-4 py-3 rounded-2xl"
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                  borderBottomRightRadius: 4,
                  boxShadow: '0 4px 20px rgba(124,58,237,0.25)',
                }
              : {
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  borderBottomLeftRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }
          }
        >
          {isUser ? (
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="prose-ayu">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Actions row */}
        <div className={`flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "flex-row-reverse" : ""}`}>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-0.5 rounded-md hover:bg-white/5"
          >
            {copied ? (
              <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
            ) : (
              <><Copy className="w-3 h-3" /><span>Copy</span></>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
