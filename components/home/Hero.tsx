"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "/assets/hero-banner.png",
    title: "Silence is Luxury",
    subtitle: "Spring / Summer 2026",
    description: "Discover the power of restraint with our new collection of breathable organics."
  },
  {
    id: 2,
    image: "/assets/silk-tunic.png",
    title: "Midnight Silk",
    subtitle: "The Evening Edit",
    description: "Handcrafted pure silk tunics designed for elegance in motion."
  },
  {
    id: 3,
    image: "/assets/wool-coat.png",
    title: "Architectural Wool",
    subtitle: "Winter Structure",
    description: "Italian blends featuring minimal cuts and uncompromising warmth."
  },
  {
    id: 4,
    image: "/assets/bronze-skirt.png",
    title: "Liquid Bronze",
    subtitle: "Statement Pieces",
    description: "Metallic sheen pleats that capture every glimmer of light."
  }
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-main">
      <AnimatePresence mode="popLayout">
        <motion.div
           key={current}
           className="absolute inset-0 w-full h-full"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.2, ease: "easeInOut" }}
        >
           {/* Ken Burns Effect Image */}
           <motion.div
             className="relative w-full h-full"
             initial={{ scale: 1.1 }}
             animate={{ scale: 1 }}
             transition={{ duration: 8, ease: "linear" }}
           >
              <Image 
                src={SLIDES[current].image}
                alt={SLIDES[current].title}
                fill
                className="object-cover"
                priority
              />
              {/* Cinematic Gradient Overlay - Stronger for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
           </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-40 md:pb-48 px-6 md:px-24">
         <div className="max-w-[800px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-8"
              >
                 <span className="uppercase tracking-[0.3em] text-white/90 text-sm font-medium border-l-2 border-accent-gold pl-4 drop-shadow-md">
                   {SLIDES[current].subtitle}
                 </span>
                 <h1 className="font-serif text-6xl md:text-9xl text-white leading-[0.85] drop-shadow-lg">
                   {SLIDES[current].title}
                 </h1>
                 <p className="text-white/90 text-lg md:text-2xl max-w-xl leading-relaxed font-light drop-shadow-md">
                   {SLIDES[current].description}
                 </p>
                 <div className="flex flex-col md:flex-row gap-6 pt-6">
                    <Button 
                        variant="white" 
                        className="px-10 py-6 text-sm tracking-[0.2em] font-bold"
                    >
                      SHOP COLLECTION
                    </Button>
                    <Button 
                        variant="outline-white" 
                        className="px-10 py-6 text-sm tracking-[0.2em]"
                    >
                      VIEW LOOKBOOK
                    </Button>
                 </div>
              </motion.div>
            </AnimatePresence>
         </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-24 right-6 md:right-24 z-30 flex gap-4">
         <button onClick={prevSlide} className="p-4 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all">
           <ArrowLeft className="w-6 h-6" />
         </button>
         <button onClick={nextSlide} className="p-4 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all">
           <ArrowRight className="w-6 h-6" />
         </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-24 left-6 md:left-24 z-30 flex gap-3">
        {SLIDES.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-[2px] transition-all duration-500 ${current === idx ? "w-12 bg-accent-gold" : "w-6 bg-white/40 hover:bg-white"}`}
          />
        ))}
      </div>

      {/* Integrated Marquee - Absolute Bottom */}
      <div className="absolute bottom-0 left-0 w-full z-40 bg-black/20 backdrop-blur-sm border-t border-white/10 py-4 overflow-hidden flex whitespace-nowrap">
        <motion.div 
          className="flex gap-16 text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-white/80"
          animate={{ x: "-50%" }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {Array(10).fill("Quiet Luxury • Timeless Form • Organic Texture • Sustainable Design •").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
