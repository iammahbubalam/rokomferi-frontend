"use client";

import { useState } from "react";
import Image from "next/image";
import { Container, Section } from "@/components/ui/Container";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
    alert("Thank you for joining our inner circle.");
  };

  return (
    <Section className="bg-[#f2f0eb] border-t border-primary/5 py-0 md:py-0"> 
    {/* Setting py-0 to allow full height image split */}
      <div className="flex flex-col md:flex-row h-auto md:h-[600px] w-full">
         
         {/* Left: Image */}
         <div className="w-full md:w-1/2 relative min-h-[400px]">
            <Image 
              src="/assets/texture-detail.png" // Ideally a texture close up using placeholder for now
              alt="Fabric Detail"
              fill
              className="object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
         </div>

         {/* Right: Content */}
         <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-24 relative overflow-hidden">
             
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} 
             />

             <div className="w-full max-w-md relative z-10">
                <span className="text-xs uppercase tracking-[0.3em] text-accent-gold mb-6 block">The Inner Circle</span>
                <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6 leading-tight">
                  Join the list for <br/> 
                  <span className="italic text-secondary">exclusive access.</span>
                </h2>
                <p className="text-secondary/80 font-light mb-10 leading-relaxed">
                   Be the first to know about new arrivals, private sales, and stories from the atelier.
                </p>
                
                <form onSubmit={handleSubmit} className="w-full relative mt-8 group">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-primary/20 py-4 text-left text-lg outline-none placeholder:text-primary/30 focus:border-primary transition-colors text-primary pl-2"
                    />
                    <button 
                      type="submit"
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest text-primary opacity-50 hover:opacity-100 hover:text-accent-gold transition-all"
                    >
                      Subscribe
                    </button>
                </form>

                <p className="text-[10px] uppercase tracking-widest text-secondary/40 mt-12 opacity-60">
                   No spam. Just beauty.
                </p>
             </div>
         </div>

      </div>
    </Section>
  );
}
