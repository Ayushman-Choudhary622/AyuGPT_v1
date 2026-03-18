"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

const IntroAnimation = dynamic(() => import("@/components/IntroAnimation"), { ssr: false });
const ChatInterface = dynamic(() => import("@/components/ChatInterface"), { ssr: false });

export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!entered ? (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.5 }}
        >
          <IntroAnimation onEnter={() => setEntered(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <ChatInterface />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
