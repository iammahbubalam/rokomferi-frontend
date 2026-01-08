import { Container } from "@/components/ui/Container";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-main-secondary py-20 text-primary">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col items-start gap-4">
            <div className="relative h-8 w-32">
                <Image 
                    src="/assets/logo_rokomferi.png" 
                    alt="Rokomferi" 
                    fill
                    className="object-contain object-left"
                />
            </div>
            <p className="text-sm leading-relaxed text-secondary max-w-xs">
              Defining quiet luxury through texture, form, and timeless restraint. 
              Designed for the modern sophisticate.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ready to Wear</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Editorial</a></li>
            </ul>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-xs text-secondary mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex border-b border-primary/20 pb-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent w-full text-sm outline-none placeholder:text-secondary/50"
              />
              <button type="button" className="text-xs uppercase tracking-widest hover:text-accent-gold transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center text-xs text-secondary gap-4">
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
