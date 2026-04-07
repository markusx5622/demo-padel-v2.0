"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
      setProgress(Math.min(currentProgress, 100));
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black text-white"
    >
      <div className="text-[15vw] font-black tracking-tighter leading-none text-outline-neon">
        {Math.floor(progress)}%
      </div>
      <div className="mt-4 text-zinc-500 uppercase tracking-widest text-sm font-bold">
        Initializing Kinetic Engine...
      </div>
      <div className="absolute bottom-10 w-64 h-1 bg-zinc-900 overflow-hidden">
        <motion.div 
          className="h-full bg-[#ccff00]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
