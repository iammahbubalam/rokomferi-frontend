"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container, Section } from "@/components/ui/Container";
import { EditorialContent } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { useRef } from "react";

interface EditorialSpotlightProps {
  content: EditorialContent;
}

export function EditorialSpotlight({ content }: EditorialSpotlightProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Section className="py-0 overflow-hidden bg-[#1a1a1a] text-white relative">
      <div ref={ref} className="relative w-full h-[80vh] md:h-screen flex items-center justify-center">
        
        {/* Parallax Background Image */}
        <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
          <Image
            src={content.image}
            alt={content.title}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-[#1a1a1a]/40" />
        </motion.div>

        <Container className="relative z-10 text-center flex flex-col items-center gap-6 md:gap-8 max-w-4xl">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
            <span className="text-sm md:text-base uppercase tracking-[0.4em] text-[#d4af37] mb-4 block">
              {content.tagline}
            </span>
            <h2 className="font-serif text-5xl md:text-8xl leading-[0.9] mb-6">
              {content.title}
            </h2>
            <p className="text-lg md:text-2xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed">
              {content.description}
            </p>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2 }}
          >
             <Button variant="outline-white" className="mt-8 px-12 py-4 text-sm tracking-widest">
               Read The Story
             </Button>
          </motion.div>
        </Container>
      </div>
    </Section>
  );
}
