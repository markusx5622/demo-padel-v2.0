"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { playImpactSound } from "@/lib/kinetic";

export const LegalEngine = () => {
  const [showCookie, setShowCookie] = useState(false);
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowCookie(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const acceptCookies = () => {
    playImpactSound();
    setShowCookie(false);
  };

  const openModal = (type: "privacy" | "terms") => {
    playImpactSound();
    setActiveModal(type);
  };

  const closeModal = () => {
    playImpactSound();
    setActiveModal(null);
  };

  return (
    <>
      <AnimatePresence>
        {showCookie && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 p-6 z-[150] flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="text-zinc-400 text-sm max-w-2xl">
              Utilizamos cookies para optimizar la experiencia cinética. Al continuar, aceptas nuestra{" "}
              <button onClick={() => openModal("privacy")} className="text-white underline hover:text-[#ccff00]">Política de Privacidad</button> y{" "}
              <button onClick={() => openModal("terms")} className="text-white underline hover:text-[#ccff00]">Términos</button>.
            </div>
            <button 
              onClick={acceptCookies}
              className="w-full md:w-auto bg-[#ccff00] text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap"
            >
              ACEPTAR SISTEMA
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-3xl max-h-[80vh] overflow-y-auto p-8 md:p-12 relative"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-white">
                {activeModal === "privacy" ? "Política de Privacidad" : "Términos de Servicio"}
              </h2>

              <div className="prose prose-invert max-w-none text-zinc-400">
                <p>Última actualización: {new Date().toLocaleDateString()}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h3 className="text-white font-bold mt-8 mb-4">1. Recopilación de Datos</h3>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <h3 className="text-white font-bold mt-8 mb-4">2. Uso del Sistema</h3>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
