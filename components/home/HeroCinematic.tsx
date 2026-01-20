"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HeroSlide } from "@/lib/data";
import { useIntro } from "@/context/IntroContext";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HeroCinematicProps {
  slides: HeroSlide[];
}

export function HeroCinematic({ slides }: HeroCinematicProps) {
  const [current, setCurrent] = useState(0);
  const { isIntroComplete } = useIntro();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Auto-rotate slides
  useEffect(() => {
    if (!isIntroComplete) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000); // Slower rotate for cinematic feel
    return () => clearInterval(timer);
  }, [slides.length, isIntroComplete]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (!slides || slides.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative h-[95vh] w-full bg-primary text-white overflow-hidden"
    >
      {/* Background Image Layer - Full Bleed */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ scale: imageScale }}
        >
          {/* Fallback color if image fails or is empty string */}
          <div className="absolute inset-0 bg-[#1a1a1a]" />

          {slides[current].image && (
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover opacity-60"
              priority
            />
          )}

          {/* Cinematic Grain Overlay */}
          <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layout - Split Screen Grid */}
      <div className="absolute inset-0 z-10 grid grid-cols-12 h-full">
        {/* Left: Vertical Marquee & Heritage Badge */}
        <div className="col-span-1 hidden lg:flex flex-col justify-between py-12 border-r border-white/10 bg-primary/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <span className="h-24 w-[1px] bg-accent-gold" />
            <span className="text-accent-gold text-xs font-serif italic tracking-widest writing-vertical-rl rotate-180">
              Est. 2026
            </span>
          </div>

          <div className="flex-grow flex items-center justify-center overflow-hidden py-12">
            <div className="writing-vertical-rl rotate-180 text-white/10 text-xs uppercase tracking-[0.4em] whitespace-nowrap animate-marquee-vertical">
              ঐতিহ্য • Heritage • শিল্প • Artistry •
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="text-white/40 text-[10px]">0{current + 1}</span>
            <div className="w-px h-12 bg-white/20 relative">
              <motion.div
                className="absolute top-0 left-0 w-full bg-accent-gold"
                initial={{ height: "0%" }}
                animate={{ height: "100%" }}
                key={current}
                transition={{ duration: 8, ease: "linear" }}
              />
            </div>
            <span className="text-white/40 text-[10px]">0{slides.length}</span>
          </div>
        </div>

        {/* Center: Main Content */}
        <motion.div
          className="col-span-12 lg:col-span-8 flex flex-col justify-center px-8 md:px-20 lg:px-32 relative"
          style={{ y: textY }}
        >
          <AnimatePresence mode="wait">
            <div key={current} className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="font-script text-3xl text-accent-gold">
                  {slides[current].subtitle}
                </span>
              </motion.div>

              <div className="overflow-hidden mb-8">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-5xl md:text-7xl lg:text-9xl leading-[0.9] text-white mix-blend-difference"
                >
                  {slides[current].title}
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-lg md:text-xl font-light max-w-lg leading-relaxed text-white/80 mb-10"
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="outline-white"
                  className="px-10 py-6 text-xs uppercase tracking-[0.25em] group overflow-hidden relative"
                >
                  <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
                    Explore Collection
                  </span>
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                </Button>
              </motion.div>
            </div>
          </AnimatePresence>
        </motion.div>

        {/* Right: Abstract/Controls */}
        <div className="col-span-3 hidden lg:flex flex-col justify-end p-12">
          <div className="flex gap-4 justify-end">
            <button
              onClick={prevSlide}
              className="p-4 border border-white/10 rounded-full hover:bg-white hover:text-primary transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-4 border border-white/10 rounded-full hover:bg-white hover:text-primary transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
