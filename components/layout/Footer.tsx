import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  const brandName = "ROKOMFERI".split("");

  return (
    <footer className="bg-[#f9f8f6] pt-20 pb-0 text-primary border-t border-primary/5 overflow-hidden relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
                 <div className="relative h-8 w-8">
                    <Image 
                        src="/assets/logo_rokomferi.png" 
                        alt="Rokomferi" 
                        fill
                        className="object-contain"
                    />
                 </div>
                 <span className="font-serif text-2xl font-bold uppercase tracking-widest text-primary">Rokomferi</span>
            </div>
            <p className="text-sm leading-relaxed text-secondary/80 max-w-xs font-light">
              Defining quiet luxury through texture, form, and timeless restraint. 
              Designed for the modern sophisticate.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-6 text-primary">Shop</h4>
            <ul className="space-y-4 text-sm text-secondary/70 font-light">
              <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ready to Wear</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Editorial</a></li>
            </ul>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-6 text-primary">Support</h4>
            <ul className="space-y-4 text-sm text-secondary/70 font-light">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>


        </div>
        
        {/* Giant Footer Branding - Animated Vector */}
        <div className="w-full flex justify-center border-t border-primary/5 pt-12 pb-6 overflow-hidden relative">
           <BrandLogo 
             className="w-[90vw] h-auto text-primary" 
             animated={true} 
             variant="draw"
             duration={2.5} 
             repeatOnScroll={true} 
             repeatInterval={7000} 
           />
        </div>


        <div className="py-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-secondary/50 gap-4">
          <p>© 2026 Rokomferi. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
