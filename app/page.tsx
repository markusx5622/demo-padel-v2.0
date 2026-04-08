"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import Lenis from "lenis";
import confetti from "canvas-confetti";
import Image from 'next/image';
import { X, CheckCircle, ChevronRight } from "lucide-react";

// --- KINETIC PHYSICS ---
const springProps = { type: "spring" as const, stiffness: 300, damping: 20 };

// --- AUDIO FEEDBACK API ---
const playImpactSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "triangle"; // Sonido agresivo y seco
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (error) {
    console.warn("AudioFeedback not supported or blocked.", error);
  }
};

// --- COMPONENTS ---

const KineticNav = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
  });

  return (
    <motion.nav
      variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: "-100%", opacity: 0 } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center padel-glass"
    >
      <div className="text-2xl font-black tracking-tighter text-white">
        PADEL<span className="text-[#ccff00]">_PRO</span>
      </div>
      <button 
        onClick={playImpactSound}
        className="bg-[#ccff00] text-black px-6 py-2 font-bold uppercase tracking-wide hover:scale-105 transition-transform"
      >
        Reserva Ahora
      </button>
    </motion.nav>
  );
};

const Hero3DBackground = () => {
  const meshRef = useRef<any>(null);
  useFrame(({ clock, mouse }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      // Reactividad sutil al mouse
      meshRef.current.position.x = mouse.x * 1.5;
      meshRef.current.position.y = mouse.y * 1.5;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.8, 32, 32]} scale={2}>
      <MeshDistortMaterial color="#ccff00" wireframe distort={0.5} speed={1.5} />
    </Sphere>
  );
};

const HorizontalStats = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const sections = gsap.utils.toArray(".stat-panel");
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => "+=" + wrapperRef.current?.offsetWidth,
          },
        });
      });
    }, wrapperRef);

    return () => ctx.revert();
  },[]);

  return (
    <div ref={wrapperRef} className="overflow-hidden bg-zinc-950">
      <div ref={containerRef} className="flex w-full md:w-[300vw] flex-col md:flex-row">
        <div className="stat-panel w-full md:w-screen h-[50vh] md:h-screen flex flex-col items-center justify-center border-b md:border-r border-zinc-800">
          <h2 className="text-[15vw] md:text-[8vw] font-black text-outline-neon leading-none">12</h2>
          <p className="text-2xl md:text-4xl font-bold tracking-tighter uppercase">Pistas Panorámicas</p>
        </div>
        <div className="stat-panel w-full md:w-screen h-[50vh] md:h-screen flex flex-col items-center justify-center border-b md:border-r border-zinc-800 bg-black">
          <h2 className="text-[15vw] md:text-[8vw] font-black text-[#ccff00] leading-none">+500</h2>
          <p className="text-2xl md:text-4xl font-bold tracking-tighter uppercase">Alumnos Activos</p>
        </div>
        <div className="stat-panel w-full md:w-screen h-[50vh] md:h-screen flex flex-col items-center justify-center bg-zinc-950">
          <h2 className="text-[15vw] md:text-[8vw] font-black text-outline-neon leading-none">8</h2>
          <p className="text-2xl md:text-4xl font-bold tracking-tighter uppercase">Coaches WPT</p>
        </div>
      </div>
    </div>
  );
};

const PlayerLevelMatrix = () => {
  const levels = [
    { id: "1.0", title: "INICIACIÓN", desc: "Primer contacto. Aprendizaje de empuñadura continental y posición de espera.", specs: ["Control: 10%", "Potencia: 5%", "Táctica: 0%"] },
    { id: "3.0", title: "INTERMEDIO", desc: "Consistencia en fondo. Inicio de juego en red y bandejas de control.", specs: ["Control: 45%", "Potencia: 30%", "Táctica: 20%"] },
    { id: "5.0", title: "AVANZADO", desc: "Dominio de efectos. Remate x3 y víboras agresivas. Lectura de pared avanzada.", specs: ["Control: 80%", "Potencia: 75%", "Táctica: 85%"] },
    { id: "7.0", title: "ELITE / WPT", desc: "Nivel profesional. Velocidad de bola extrema y toma de decisiones bajo presión.", specs: ["Control: 99%", "Potencia: 95%", "Táctica: 100%"] },
  ];

  return (
    <section className="py-32 px-6 bg-black border-y border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-[#ccff00] font-mono text-sm tracking-[0.3em] uppercase mb-4 block">^DATA_STRUCTURE</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">Level <br/><span className="text-outline-neon">Matrix</span></h2>
          </div>
          <p className="max-w-md text-zinc-500 uppercase text-xs tracking-widest leading-relaxed">
            Nuestro sistema de clasificación biomecánica garantiza que entrenes con jugadores de tu mismo vector de rendimiento.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
          {levels.map((level) => (
            <motion.div 
              key={level.id}
              whileHover={{ backgroundColor: "rgba(204, 255, 0, 0.03)" }}
              className="bg-black p-8 flex flex-col h-full group transition-colors"
            >
              <div className="text-6xl font-black text-zinc-800 group-hover:text-[#ccff00] transition-colors mb-6 font-mono">{level.id}</div>
              <h3 className="text-xl font-bold uppercase tracking-tighter mb-4">{level.title}</h3>
              <p className="text-zinc-500 text-sm mb-8 flex-grow leading-relaxed">{level.desc}</p>
              <div className="space-y-2 pt-6 border-t border-zinc-900">
                {level.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                    <span>{spec.split(":")[0]}</span>
                    <span className="text-zinc-400">{spec.split(":")[1]}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EliteRoster = () => {
  const coaches = [
    { name: "MARCUS KINETIC", rank: "#12 WPT", role: "Head Coach", img: "https://picsum.photos/seed/coach1/600/800" },
    { name: "ELENA VOLLEY", rank: "#24 WPT", role: "Tactical Specialist", img: "https://picsum.photos/seed/coach2/600/800" },
    { name: "VICTOR SMASH", rank: "#40 WPT", role: "Power Mechanics", img: "https://picsum.photos/seed/coach3/600/800" },
  ];

  return (
    <section className="py-32 px-6 bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black mb-16 tracking-tighter uppercase text-white">Elite <span className="text-[#ccff00]">Roster</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {coaches.map((coach, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative group cursor-crosshair"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-zinc-900 grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image 
                  src={coach.img} 
                  alt={coach.name} 
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="text-[#ccff00] font-mono text-xs tracking-widest uppercase mb-2 block">{coach.rank}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-1 text-white">{coach.name}</h3>
                <p className="text-zinc-400 text-sm uppercase tracking-widest font-bold">{coach.role}</p>
              </div>
              <motion.div 
                className="absolute top-4 right-4 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1, borderColor: "#ccff00" }}
              >
                <ChevronRight className="text-white group-hover:text-[#ccff00]" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SystemSpecs = () => {
  const specs = [
    { label: "SURFACE", value: "MONDO STX SUPERCOURT", detail: "Césped oficial WPT con absorción de impacto X-Treme." },
    { label: "LIGHTING", value: "LED 400W KINETIC-PRO", detail: "Iluminación uniforme de 1200 lux sin sombras periféricas." },
    { label: "GLASS", value: "12MM TEMPERED PANORAMIC", detail: "Visibilidad total 360º con estructura reforzada anti-vibración." },
    { label: "CLIMATE", value: "ACTIVE AIRFLOW SYSTEM", detail: "Control de humedad y temperatura para un rebote constante." },
  ];

  return (
    <section className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="padel-glass border-dashed border-zinc-800 p-8 md:p-16">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-3 h-3 bg-[#ccff00] animate-pulse"></div>
            <h2 className="text-2xl font-black tracking-widest uppercase text-white">System_Specs.exe</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {specs.map((spec, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-end mb-4 border-b border-zinc-900 pb-2 group-hover:border-[#ccff00]/30 transition-colors">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">{spec.label}</span>
                  <span className="text-xs font-bold text-[#ccff00] uppercase tracking-tighter">{spec.value}</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">{spec.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-8 items-center">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-1 h-8 bg-zinc-900"></div>
              ))}
            </div>
            <span className="font-mono text-[10px] text-zinc-700 tracking-[0.5em] uppercase">Hardware_Certified_v2.0</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProBentoGrid = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items =[
    { id: "1", title: "METODOLOGÍA PRO", subtitle: "Entrena como los #1", desc: "Circuitos de alta intensidad, transiciones rápidas y táctica avanzada. No enseñamos a pasar la bola, enseñamos a ganar y dominar la red con agresividad controlada.", colSpan: "md:col-span-2" },
    { id: "2", title: "VIDEO ANÁLISIS", subtitle: "Biomecánica al detalle", desc: "Grabación 4K a 120fps. Corregimos tu bandeja, víbora y remate x3 analizando cada grado de tu postura.", colSpan: "md:col-span-1" },
    { id: "3", title: "APP PROPIA", subtitle: "Métricas en tiempo real", desc: "Controla tu % de primeros servicios, errores no forzados y evolución física directamente desde tu smartphone.", colSpan: "md:col-span-3" }
  ];

  return (
    <section className="py-32 px-6 bg-black relative max-w-7xl mx-auto">
      <h2 className="text-5xl md:text-7xl font-black mb-16 tracking-tighter uppercase">El Sistema <span className="text-[#ccff00]">Kinetic</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div
            layoutId={`bento-${item.id}`}
            key={item.id}
            onClick={() => { playImpactSound(); setSelectedId(item.id); }}
            className={`padel-glass p-8 cursor-pointer group ${item.colSpan} hover:border-[#ccff00]/50 transition-colors`}
            whileHover={{ scale: 0.98 }}
            transition={springProps}
          >
            <h3 className="text-[#ccff00] text-sm font-bold tracking-widest mb-2">{item.subtitle}</h3>
            <h4 className="text-3xl font-black uppercase tracking-tighter group-hover:text-outline-neon">{item.title}</h4>
            <div className="mt-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="text-[#ccff00] w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          >
            {items.filter(i => i.id === selectedId).map(item => (
              <motion.div
                layoutId={`bento-${item.id}`}
                key="modal"
                className="bg-zinc-950 border border-zinc-800 p-10 md:p-16 max-w-3xl w-full relative"
                transition={springProps}
              >
                <button 
                  onClick={() => { playImpactSound(); setSelectedId(null); }}
                  className="absolute top-6 right-6 text-white hover:text-[#ccff00] transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
                <h3 className="text-[#ccff00] text-lg font-bold tracking-widest mb-4">{item.subtitle}</h3>
                <h4 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">{item.title}</h4>
                <p className="text-xl text-zinc-400 leading-relaxed font-light">{item.desc}</p>
                <button 
                  onClick={() => { playImpactSound(); setSelectedId(null); }}
                  className="mt-12 bg-white text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-[#ccff00] transition-colors w-full md:w-auto"
                >
                  Entendido
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const PricingSection = () => {
  const plans =[
    { name: "INDIVIDUAL", price: "35€", desc: "1 hora. Pista y bolas incluidas. Foco total en tu técnica.", highlight: false },
    { name: "GRUPO PRO", price: "15€", desc: "1.5 horas. 4 jugadores nivelados. Táctica y partido.", highlight: true },
    { name: "BONO 5X", price: "130€", desc: "5 sesiones individuales. Descuento aplicado. Compromiso total.", highlight: false }
  ];

  return (
    <section className="py-32 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black mb-16 tracking-tighter uppercase text-center">Forja tu <span className="text-outline-neon">Leyenda</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={springProps}
              className={`p-10 border ${plan.highlight ? 'border-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.15)] bg-black/50' : 'border-zinc-800 bg-zinc-900/30'} backdrop-blur-sm flex flex-col h-full`}
            >
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">{plan.name}</h3>
              <div className="text-5xl font-black text-[#ccff00] mb-6">{plan.price}<span className="text-lg text-zinc-500 font-normal">/sesión</span></div>
              <p className="text-zinc-400 mb-10 flex-grow">{plan.desc}</p>
              <button 
                onClick={playImpactSound}
                className={`w-full py-4 font-bold uppercase tracking-wider transition-colors ${plan.highlight ? 'bg-[#ccff00] text-black hover:bg-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                Seleccionar
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BookingMatrix = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playImpactSound();
    setIsSuccess(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors:['#ccff00', '#ffffff', '#000000'],
      disableForReducedMotion: true
    });
  };

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ccff00]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 padel-glass p-8 md:p-16">
        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase">Asegura tu <span className="text-[#ccff00]">Pista</span></h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required type="text" placeholder="NOMBRE O ALIAS" className="w-full bg-zinc-950/50 border border-zinc-800 p-4 text-white placeholder-zinc-600 input-neon transition-all uppercase tracking-wide font-medium" />
            <input required type="tel" placeholder="TELÉFONO" className="w-full bg-zinc-950/50 border border-zinc-800 p-4 text-white placeholder-zinc-600 input-neon transition-all uppercase tracking-wide font-medium" />
          </div>
          <select required defaultValue="" className="w-full bg-zinc-950/50 border border-zinc-800 p-4 text-white input-neon transition-all uppercase tracking-wide font-medium appearance-none">
            <option value="" disabled>NIVEL DE JUEGO</option>
            <option value="ini">Iniciación (1.0 - 2.5)</option>
            <option value="med">Medio (3.0 - 4.0)</option>
            <option value="pro">Avanzado/Pro (4.5+)</option>
          </select>
          <button type="submit" className="w-full bg-[#ccff00] text-black py-6 text-xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
            Confirmar Reserva
          </button>
        </form>
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <div className="text-center flex flex-col items-center">
              <motion.svg 
                width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#ccff00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="mb-8"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  d="M20 6L9 17l-5-5"
                />
              </motion.svg>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-black uppercase tracking-tighter mb-4"
              >
                Reserva Confirmada
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-zinc-400 mb-8 max-w-md mx-auto"
              >
                Prepara tu pala. Te hemos enviado los detalles de acceso a la pista por SMS.
              </motion.p>
              <motion.button 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={() => { playImpactSound(); setIsSuccess(false); }}
                className="bg-white text-black px-10 py-4 font-bold uppercase tracking-widest hover:bg-[#ccff00] transition-colors"
              >
                Volver a la base
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const BrutalistFooter = () => (
  <footer className="bg-black pt-32 pb-12 px-6 border-t border-zinc-900 overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col items-center">
      <h1 className="text-[12vw] font-black tracking-tighter leading-none text-outline-neon mb-12 text-center">
        PADEL<br/><span className="text-[#ccff00] -webkit-text-stroke-0">_KINETIC</span>
      </h1>
      <div className="flex flex-wrap justify-center gap-8 mb-16 text-zinc-500 uppercase tracking-widest font-bold text-sm">
        <a href="#" className="hover:text-[#ccff00] transition-colors">Instagram</a>
        <a href="#" className="hover:text-[#ccff00] transition-colors">TikTok</a>
        <a href="#" className="hover:text-[#ccff00] transition-colors">Términos</a>
        <a href="#" className="hover:text-[#ccff00] transition-colors">Privacidad</a>
      </div>
      <p className="text-zinc-700 text-xs uppercase tracking-widest">© 2026 Padel Pro Kinetic. High Performance Facility.</p>
    </div>
  </footer>
);

// --- MASTER PAGE COMPONENT ---
export default function PadelProKineticPage() {
  // Zero-Bug Stability & Smooth Scroll
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
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  },[]);

  return (
    <main className="bg-black min-h-screen text-white selection:bg-[#ccff00] selection:text-black">
      <KineticNav />
      
      {/* THE KINETIC HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <Hero3DBackground />
          </Canvas>
        </div>
        <div className="relative z-10 text-center pointer-events-none flex flex-col items-center">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[18vw] md:text-[12vw] font-black tracking-tighter leading-[0.8] uppercase"
          >
            Domina <br /> 
            <span className="text-outline-neon">La Pista</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="mt-8 text-xl md:text-2xl text-zinc-400 font-light tracking-widest uppercase"
          >
            Alto rendimiento. Cero excusas.
          </motion.p>
        </div>
      </section>

      <HorizontalStats />
      <PlayerLevelMatrix />
      <EliteRoster />
      <SystemSpecs />
      <ProBentoGrid />
      <PricingSection />
      <BookingMatrix />
      <BrutalistFooter />
    </main>
  );
}
