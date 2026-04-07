"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const coaches = [
  { name: "ALEX 'THE WALL' RUIZ", role: "HEAD COACH", stats: "WPT #45 / 10Y EXP", img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1000&auto=format&fit=crop" },
  { name: "SARA 'SMASH' GOMEZ", role: "TACTICAL LEAD", stats: "WPT #22 / 8Y EXP", img: "https://images.unsplash.com/photo-1554068865-24cecd4e34d8?q=80&w=1000&auto=format&fit=crop" },
  { name: "MARCOS 'SPIN' DIAZ", role: "TECH SPECIALIST", stats: "NATIONAL CHAMP", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000&auto=format&fit=crop" },
  { name: "ELENA 'VOLLEY' CRUZ", role: "YOUTH ACADEMY", stats: "CERTIFIED PRO", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" },
];

export const EliteRoster = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current || !scrollRef.current) return;

    const scrollWidth = scrollRef.current.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(scrollRef.current, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${scrollWidth}`,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="roster" ref={containerRef} className="h-screen bg-black overflow-hidden relative flex items-center">
      <div className="absolute top-24 left-6 md:left-24 z-10 mix-blend-difference">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white">
          ELITE <span className="text-outline-neon">ROSTER</span>
        </h2>
      </div>

      <div ref={scrollRef} className="flex gap-8 px-6 md:px-24 pt-32 pb-12 items-center h-full w-max">
        {coaches.map((coach, i) => (
          <motion.div 
            key={i}
            className="w-[80vw] md:w-[400px] h-[60vh] relative group overflow-hidden grayscale hover:grayscale-0 transition-all duration-700"
            whileHover={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
            <img src={coach.img} alt={coach.name} className="w-full h-full object-cover" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
              <div className="text-[#ccff00] text-xs font-bold tracking-widest mb-2">
                {coach.role}
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
                {coach.name}
              </h3>
              <div className="text-zinc-400 font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {coach.stats}
              </div>
            </div>

            {/* Glitch/Neon border effect on hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#ccff00] z-30 transition-colors duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
