"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { playImpactSound, springProps } from "@/lib/kinetic";

const questions = [
  {
    id: 1,
    title: "ESTILO DE JUEGO",
    options: [
      { label: "DEFENSA FÉRREA", value: "def", points: 1 },
      { label: "ATAQUE TOTAL", value: "atk", points: 3 },
      { label: "EQUILIBRIO", value: "bal", points: 2 },
    ]
  },
  {
    id: 2,
    title: "FRECUENCIA SEMANAL",
    options: [
      { label: "1-2 VECES", value: "low", points: 1 },
      { label: "3-4 VECES", value: "med", points: 2 },
      { label: "TODOS LOS DÍAS", value: "high", points: 3 },
    ]
  },
  {
    id: 3,
    title: "OBJETIVO PRINCIPAL",
    options: [
      { label: "DIVERSIÓN", value: "fun", points: 1 },
      { label: "MEJORA TÉCNICA", value: "tech", points: 2 },
      { label: "COMPETICIÓN", value: "comp", points: 3 },
    ]
  }
];

export const PlayerMatrix = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [calculating, setCalculating] = useState(false);

  const handleSelect = (points: number) => {
    playImpactSound();
    setScore(prev => prev + points);
    
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setCalculating(true);
      setTimeout(() => {
        setCalculating(false);
        setStep(questions.length);
      }, 2000);
    }
  };

  const reset = () => {
    playImpactSound();
    setStep(0);
    setScore(0);
  };

  const getResult = () => {
    if (score <= 4) return { level: "INICIACIÓN (2.0)", plan: "INDIVIDUAL", price: "35€" };
    if (score <= 7) return { level: "MEDIO (3.5)", plan: "GRUPO PRO", price: "15€" };
    return { level: "AVANZADO (5.0+)", plan: "BONO 5X", price: "130€" };
  };

  return (
    <section id="matrix" className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-7xl font-black mb-16 tracking-tighter uppercase text-center">
          Player Level <span className="text-outline-neon">Matrix</span>
        </h2>

        <div className="padel-glass p-8 md:p-16 min-h-[400px] flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {step < questions.length && !calculating && (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={springProps}
                className="w-full"
              >
                <div className="text-[#ccff00] text-sm font-bold tracking-widest mb-4">
                  FASE 0{step + 1} // 03
                </div>
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10">
                  {questions[step].title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.points)}
                      className="border border-zinc-800 bg-black hover:border-[#ccff00] hover:bg-[#ccff00]/10 text-white p-6 uppercase font-bold tracking-wider transition-all text-left group"
                    >
                      <span className="block text-zinc-500 group-hover:text-[#ccff00] mb-2 text-xs">SELECT</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {calculating && (
              <motion.div
                key="calc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 border-4 border-zinc-800 border-t-[#ccff00] rounded-full animate-spin mb-8" />
                <h3 className="text-2xl font-black uppercase tracking-widest animate-pulse">
                  Analizando Biometría...
                </h3>
              </motion.div>
            )}

            {step === questions.length && !calculating && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springProps}
                className="text-center"
              >
                <div className="text-zinc-500 text-sm font-bold tracking-widest mb-4 uppercase">
                  Diagnóstico Completado
                </div>
                <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-[#ccff00]">
                  {getResult().level}
                </h3>
                <p className="text-xl text-zinc-400 mb-12">
                  Plan recomendado: <span className="text-white font-bold">{getResult().plan}</span> ({getResult().price})
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => { playImpactSound(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="bg-[#ccff00] text-black px-10 py-4 font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Reservar Plan
                  </button>
                  <button 
                    onClick={reset}
                    className="border border-zinc-800 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-zinc-900 transition-colors"
                  >
                    Recalcular
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
