"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { HeroSlide } from "@/lib/data";

import { useIntro } from "@/context/IntroContext";

interface HeroProps {
  slides: HeroSlide[];
}

export function Hero({ slides }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const { isIntroComplete } = useIntro();

  // Slide Rotation (Only start after intro)

  // Slide Rotation (Only start after intro)
  useEffect(() => {
    if (!isIntroComplete) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isIntroComplete]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // If no slides are provided (sanity check), return null or loading
  if (!slides || slides.length === 0) return null;

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
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover"
              priority
            />
            {/* Cinematic Gradient Overlay - Stronger for text readability */}
            <div
              className="absolute inset-0 bg-black transition-opacity duration-1000"
              style={{ opacity: (slides[current].overlayOpacity ?? 50) / 100 }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Content Layer - Only show after intro starts exiting or is done? 
          Actually, we can let it sit there but maybe animate in slightly delayed so it doesn't clash with intro curtain lift.
      */}
      {/* Content Layer */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-center pb-20 px-6 md:px-24 transition-all duration-700
            ${
              slides[current].alignment === "center"
                ? "items-center text-center"
                : slides[current].alignment === "right"
                ? "items-end text-right"
                : "items-start text-left"
            }
        `}
      >
        <div className="max-w-[1000px] w-full">
          <AnimatePresence mode="wait">
            {isIntroComplete && (
              <div
                key={current}
                className={`flex flex-col gap-8 ${
                  slides[current].alignment === "center"
                    ? "items-center"
                    : slides[current].alignment === "right"
                    ? "items-end"
                    : "items-start"
                }`}
              >
                {/* Subtitle - Fade In */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`h-[1px] w-12 ${
                      slides[current].textColor === "black"
                        ? "bg-black"
                        : "bg-accent-gold"
                    }`}
                  />
                  <span
                    className="uppercase tracking-[0.4em] text-xs font-medium"
                    style={{
                      color:
                        slides[current].textColor === "black"
                          ? "#111827"
                          : "rgba(255,255,255,0.9)",
                    }}
                  >
                    {slides[current].subtitle}
                  </span>
                </motion.div>

                {/* Title - Masked Reveal */}
                <div className="overflow-hidden p-2 -m-2">
                  <motion.h1
                    className="font-serif text-5xl md:text-8xl leading-[1.1]"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{
                      duration: 1,
                      ease: [0.25, 1, 0.5, 1],
                      delay: 0.3,
                    }}
                    style={{
                      color:
                        slides[current].textColor === "black"
                          ? "#000000"
                          : "#FFFFFF",
                    }}
                  >
                    {slides[current].title}
                  </motion.h1>
                </div>

                {/* Description - Fade Up */}
                <motion.p
                  className="text-lg md:text-xl max-w-2xl leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  style={{
                    color:
                      slides[current].textColor === "black"
                        ? "#374151"
                        : "rgba(255,255,255,0.8)",
                  }}
                >
                  {slides[current].description}
                </motion.p>

                {/* Dynamic Button */}
                {slides[current].buttonText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="pt-4"
                  >
                    <Button
                      variant={
                        slides[current].buttonStyle === "white"
                          ? "white"
                          : slides[current].buttonStyle === "outline"
                          ? "outline"
                          : "primary"
                      }
                      className={`
                                px-10 py-6 text-xs tracking-[0.25em] font-bold uppercase transition-transform hover:scale-105
                                ${
                                  slides[current].buttonStyle === "outline"
                                    ? "text-white border-white hover:bg-white hover:text-black"
                                    : ""
                                }
                            `}
                    >
                      {slides[current].buttonText}
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-24 right-6 md:right-24 z-30 flex gap-4">
        <button
          onClick={prevSlide}
          className="p-4 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-4 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-24 left-6 md:left-24 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-[2px] transition-all duration-500 ${
              current === idx
                ? "w-12 bg-accent-gold"
                : "w-6 bg-white/40 hover:bg-white"
            }`}
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
          {Array(10)
            .fill("ROKOMFERI • Quiet Luxury • ROKOMFERI • Timeless Form •")
            .map((text, i) => (
              <span key={i}>{text}</span>
            ))}
        </motion.div>
      </div>
    </section>
  );
}
