"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSlide } from "@/lib/data";
import { useIntro } from "@/context/IntroContext";
import { AnnouncementTicker } from "@/components/layout/AnnouncementBar";

interface HeroCinematicProps {
  slides: HeroSlide[];
}

export function HeroCinematic({ slides }: HeroCinematicProps) {
  const [current, setCurrent] = useState(0);
  const { isIntroComplete } = useIntro();

  // Preload next image for performance
  useEffect(() => {
    if (slides.length > 1) {
      const next = (current + 1) % slides.length;
      if (slides[next]?.image) {
        const img = new window.Image();
        img.src = slides[next].image;
      }
    }
  }, [current, slides]);

  // Auto-rotate slides - Slower for premium feel (8s)
  useEffect(() => {
    if (!isIntroComplete || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length, isIntroComplete]);

  if (!slides || slides.length === 0) return null;

  return (
    // L9: Hero fits viewport exactly, accounting for navbar offset in main
    <section className="relative h-[calc(100dvh-88px)] md:h-[calc(100dvh-104px)] w-full overflow-hidden bg-primary">
      {/* Background Images with Ken Burns Effect */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {slides[current].image ? (
            <motion.div
              className="relative w-full h-full"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
            >
              <Image
                src={slides[current].image}
                alt={slides[current].title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Premium Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
              <div className="absolute inset-0 bg-black/20" />{" "}
              {/* General dim */}
            </motion.div>
          ) : (
            <div className="w-full h-full bg-[#1a1a1a]" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="max-w-[90vw] md:max-w-4xl flex flex-col items-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} // Premium easing
          >
            {/* Subtitle - Elegant Gold Tracking */}
            {slides[current].subtitle && (
              <motion.span
                className="inline-block text-accent-gold text-[10px] md:text-xs font-semibold uppercase tracking-[0.4em] mb-6 md:mb-8"
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, letterSpacing: "0.4em" }}
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                {slides[current].subtitle}
              </motion.span>
            )}

            {/* Title - Massive Serif Impact */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-8 md:mb-10 mix-blend-overlay opacity-90">
              {slides[current].title.split(" ").map((word, i) => (
                <span key={i} className="inline-block px-2">
                  {word}
                </span>
              ))}
            </h1>

            {/* Description - Refined width */}
            {slides[current].description && (
              <p className="text-white/80 text-sm md:text-lg font-light max-w-lg leading-relaxed mb-10 md:mb-14 antialiased">
                {slides[current].description}
              </p>
            )}

            {/* CTA - Minimal & Glass */}
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/60 text-white text-xs uppercase tracking-[0.25em] transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10">Discover</span>
              <div className="absolute inset-0 bg-white/10 -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="absolute bottom-16 left-0 right-0 z-20 px-10 flex justify-between items-end">
        {/* Progress Bar Indicators */}
        <div className="flex gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className="group relative h-10 w-10 flex items-center justify-center cursor-pointer"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span
                className={`block h-[1px] w-full transition-all duration-500 ${
                  idx === current
                    ? "bg-white opacity-100"
                    : "bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex flex-col items-center gap-4 opacity-60">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-white rotate-90 origin-left translate-x-2">
            Scroll
          </span>
        </div>
      </div>

      {/* L9: News Ticker at bottom of hero - overlaid */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <AnnouncementTicker />
      </div>
    </section>
  );
}
