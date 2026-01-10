"use client";

import { useRef } from "react";
import Image from "next/image";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import { PhilosophyContent } from "@/lib/data";

interface PhilosophyProps {
  content: PhilosophyContent;
}

export function Philosophy({ content }: PhilosophyProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect for the image
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <Section className="bg-[#f8f5f1] overflow-hidden py-32 md:py-48" ref={containerRef}>
       <Container>
         <div className="relative flex flex-col md:flex-row items-center">
            
           {/* Parallax Image Container */}
            <div className="w-full md:w-3/5 relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
               <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                  <Image 
                    src={content.image}
                    alt={content.imageAlt}
                    fill
                    className="object-cover"
                  />
                  {/* Grain Overlay for texture */}
                  <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
               </motion.div>
            </div>

            {/* Content Container - Overlapping */}
            <div className="w-full md:w-1/2 md:-ml-20 relative z-10 pt-12 md:pt-0 pl-6 md:pl-0">
               <motion.div 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="bg-white/80 backdrop-blur-md p-8 md:p-16 border border-white/40 shadow-2xl shadow-primary/5"
               >
                  <span className="text-xs uppercase tracking-[0.3em] text-accent-gold mb-6 block border-b border-accent-gold/20 pb-4 w-fit">
                    {content.tagline}
                  </span>
                  <h3 className="font-serif text-4xl md:text-5xl text-primary leading-[1.1] mb-8">
                    {content.headline.line1} <br/>
                    <span className="italic text-secondary">{content.headline.line2}</span>
                  </h3>
                  <div className="space-y-6 text-secondary font-light leading-relaxed">
                    {content.paragraphs.map((para, index) => (
                      <p key={index}>{para}</p>
                    ))}
                  </div>
                  <div className="mt-10">
                    <Button variant="primary">{content.ctaText}</Button>
                  </div>
               </motion.div>
            </div>

         </div>
       </Container>
    </Section>
  );
}
