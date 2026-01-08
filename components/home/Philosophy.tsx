"use client";

import Image from "next/image";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Philosophy() {
  return (
    <Section className="bg-main-secondary relative overflow-hidden">
       <Container className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
         <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image 
              src="/assets/silk-tunic.png"
              alt="Philosophy"
              fill
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
         </div>
         <div className="flex flex-col gap-8">
            <span className="text-xs uppercase tracking-[0.2em] text-accent-gold">Our Philosophy</span>
            <h3 className="font-serif text-4xl md:text-6xl leading-tight">
              We believe in the 
              <span className="italic block pl-12 text-primary/60">power of restraint.</span>
            </h3>
            <p className="text-secondary leading-loose max-w-md">
              In a world of noise, Rokomferi offers silence. Our garments are designed to be lived in, not just looked at. 
              We prioritize fabric over frills, and silhouette over trends.
            </p>
            <Button variant="primary" className="self-start">Read the Journal</Button>
         </div>
       </Container>
    </Section>
  );
}
