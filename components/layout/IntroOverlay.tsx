"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useIntro } from "@/context/IntroContext";
import { useEffect } from "react";

export function IntroOverlay() {
  const { isIntroComplete, completeIntro, isLoading } = useIntro();

  // Safety fallback: if BrandLogo's onComplete never fires, dismiss after 5s
  useEffect(() => {
    if (!isIntroComplete && !isLoading) {
      const timer = setTimeout(() => {
        completeIntro();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isIntroComplete, isLoading, completeIntro]);

  if (isLoading) {
    return <div className="fixed inset-0 z-[99999] bg-[#1a1a1a]" />;
  }

  return (
    <AnimatePresence>
      {!isIntroComplete && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-[#1a1a1a] flex items-center justify-center overflow-hidden"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Brand Vector Reveal */}
          <div className="relative z-10 p-8">
            <BrandLogo
              className="w-[90vw] md:w-[80vw] max-w-[1200px] h-auto text-white"
              animated={true}
              duration={2.0}
              onComplete={completeIntro}
            />
          </div>

          {/* Subtle Subtext */}
          <motion.div
            className="absolute bottom-12 text-white/30 text-xs uppercase tracking-[0.3em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Loading Experience
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
