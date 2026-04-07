"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import Lenis from "lenis";
import confetti from "canvas-confetti";
import { X, CheckCircle, ChevronRight, ArrowRight, Zap, Shield, Trophy } from "lucide-react";
import * as THREE from 'three';

import { springProps, playImpactSound } from "@/lib/kinetic";
import { Preloader } from "@/components/Preloader";
import { MegaMenu } from "@/components/MegaMenu";
import { PlayerMatrix } from "@/components/PlayerMatrix";
import { EliteRoster } from "@/components/EliteRoster";
import { LegalEngine } from "@/components/LegalEngine";

// --- 3D Background Component ---
const KineticSphere = () => {
  const meshRef = useRef<any>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      // React to mouse position
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, (state.mouse.x * 2), 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, (state.mouse.y * 2), 0.05);
    }
  });

  return (
    <Sphere 
      ref={meshRef} 
      args={[1.5, 64, 64]} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      scale={hovered ? 1.1 : 1}
    >
      <MeshDistortMaterial 
        color={hovered ? "#ccff00" : "#222222"} 
        attach="material" 
        distort={0.5} 
        speed={2} 
        roughness={0.2}
        metalness={0.8}
        wireframe={!hovered}
      />
    </Sphere>
  );
};

// --- Main Application ---
export default function PadelProKinetic() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playImpactSound();
    setBookingSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ccff00', '#ffffff', '#000000']
    });
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  return (
    <main className="bg-black text-white min-h-screen selection:bg-[#ccff00] selection:text-black font-sans">
      <AnimatePresence>
        {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      <MegaMenu />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <KineticSphere />
          </Canvas>
        </div>

        <div className="relative z-10 text-center px-4 pointer-events-none">
          <motion.h1 
            initial={{ opacity: 0, y: 100 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-[15vw] md:text-[12vw] font-black leading-none tracking-tighter uppercase mix-blend-difference"
          >
            Padel <br/>
            <span className="text-outline-neon">Kinetic</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-6 text-xl md:text-2xl font-bold tracking-widest uppercase text-zinc-400"
          >
            The Future of Court Performance
          </motion.p>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-xs font-bold tracking-widest uppercase text-zinc-500">Scroll to Ignite</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#ccff00] to-transparent" />
        </motion.div>
      </section>

      {/* PLAYER MATRIX */}
      <PlayerMatrix />

      {/* ELITE ROSTER */}
      <EliteRoster />

      {/* PRO BENTO GRID */}
      <section id="system" className="py-32 px-6 md:px-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-16 tracking-tighter uppercase">
            System <span className="text-outline-neon">Specs</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "court", title: "Smart Courts", icon: <Zap className="w-8 h-8"/>, desc: "Superficie reactiva con análisis de pisada y rebote en tiempo real." },
              { id: "gear", title: "Pro Gear", icon: <Shield className="w-8 h-8"/>, desc: "Palas de fibra de carbono aeroespacial disponibles para testeo." },
              { id: "stats", title: "Live Stats", icon: <Trophy className="w-8 h-8"/>, desc: "Biometría y telemetría de cada golpe enviada a tu dispositivo." }
            ].map((item) => (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                onClick={() => { playImpactSound(); setActiveModal(item.id); }}
                className="padel-glass p-8 cursor-pointer group hover:bg-zinc-900 transition-colors"
                whileHover={{ scale: 0.98 }}
                transition={springProps}
              >
                <div className="text-[#ccff00] mb-6 group-hover:scale-110 transition-transform origin-left">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{item.title}</h3>
                <p className="text-zinc-400 font-medium">{item.desc}</p>
                <div className="mt-8 flex items-center text-xs font-bold tracking-widest uppercase text-zinc-500 group-hover:text-[#ccff00] transition-colors">
                  Explore <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              layoutId={`card-${activeModal}`}
              className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 max-w-2xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => { playImpactSound(); setActiveModal(null); }}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 text-[#ccff00]">
                {activeModal} Protocol
              </h3>
              <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                Detailed specifications for the {activeModal} module. This section would contain deep technical data, interactive 3D models of the equipment, or live data feeds from the court sensors.
              </p>
              <div className="h-48 bg-black border border-zinc-800 flex items-center justify-center text-zinc-600 font-mono text-sm">
                [ VISUAL DATA STREAM PLACEHOLDER ]
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOKING MATRIX */}
      <section id="booking" className="py-32 px-6 md:px-24 bg-black relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="padel-glass p-8 md:p-16">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase">
              Initiate <span className="text-[#ccff00]">Sequence</span>
            </h2>
            
            {bookingSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle className="w-24 h-24 text-[#ccff00] mb-6" />
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Sequence Confirmed</h3>
                <p className="text-zinc-400">Your court is locked. Prepare for impact.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">Operative Name</label>
                    <input required type="text" className="input-neon w-full bg-black border border-zinc-800 text-white p-4 font-mono focus:outline-none" placeholder="JOHN DOE" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">Comms Link</label>
                    <input required type="email" className="input-neon w-full bg-black border border-zinc-800 text-white p-4 font-mono focus:outline-none" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">Court Type</label>
                  <select defaultValue="" required className="input-neon w-full bg-black border border-zinc-800 text-white p-4 font-mono focus:outline-none appearance-none">
                    <option value="" disabled>SELECT PROTOCOL</option>
                    <option value="standard">STANDARD (GLASS)</option>
                    <option value="pro">PRO (PANORAMIC)</option>
                    <option value="kinetic">KINETIC (SMART COURT)</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#ccff00] text-black font-black uppercase tracking-widest p-6 hover:bg-white transition-colors mt-8"
                >
                  Lock In
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* BRUTALIST FOOTER */}
      <footer className="bg-[#ccff00] text-black py-24 px-6 md:px-24 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
          <div>
            <h2 className="text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter uppercase">
              PADEL<br/>PRO
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-right">
            <a href="#" className="text-2xl font-bold uppercase tracking-tighter hover:underline">Instagram</a>
            <a href="#" className="text-2xl font-bold uppercase tracking-tighter hover:underline">Twitter</a>
            <a href="#" className="text-2xl font-bold uppercase tracking-tighter hover:underline">Location</a>
          </div>
        </div>
      </footer>

      <LegalEngine />
    </main>
  );
}
