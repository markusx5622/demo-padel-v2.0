"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Menu } from "lucide-react";
import { playImpactSound, springProps } from "@/lib/kinetic";

export const MegaMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    playImpactSound();
    setIsOpen(!isOpen);
  };

  const links = [
    { name: "THE MATRIX", href: "#matrix" },
    { name: "ELITE ROSTER", href: "#roster" },
    { name: "SYSTEM", href: "#system" },
    { name: "BOOKING", href: "#booking" },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center mix-blend-difference"
      >
        <div className="text-2xl font-black tracking-tighter text-white">
          PADEL<span className="text-[#ccff00]">_PRO</span>
        </div>
        <button 
          onClick={toggleMenu}
          className="text-white hover:text-[#ccff00] transition-colors"
        >
          <Menu className="w-8 h-8" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ opacity: 0, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[200] bg-black flex flex-col justify-center px-6 md:px-24"
          >
            <button 
              onClick={toggleMenu}
              className="absolute top-6 right-6 text-white hover:text-[#ccff00] transition-colors"
            >
              <X className="w-12 h-12" />
            </button>

            <div className="flex flex-col gap-4">
              {links.map((link, i) => (
                <div key={link.name} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={toggleMenu}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                    className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none text-white hover:text-[#ccff00] transition-colors block w-fit"
                    whileHover={{ x: 20 }}
                  >
                    {link.name}
                  </motion.a>
                </div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-12 left-6 md:left-24 text-zinc-500 uppercase tracking-widest text-sm font-bold"
            >
              KINETIC SYSTEM V2.0
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
