import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { FooterSection, SiteConfig } from "@/lib/data";
import Link from "next/link";

interface FooterProps {
  siteConfig: SiteConfig;
  footerSections: FooterSection[];
}

export function Footer({ siteConfig, footerSections }: FooterProps) {

  return (
    <footer className="bg-[#f9f8f6] pt-20 pb-0 text-primary border-t border-primary/5 overflow-hidden relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
                 <div className="relative h-8 w-8">
                    <Image 
                        src={siteConfig.logo}
                        alt={siteConfig.name} 
                        fill
                        className="object-contain"
                    />
                 </div>
                 <span className="font-serif text-2xl font-bold uppercase tracking-widest text-primary">{siteConfig.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-secondary/80 max-w-xs font-light">
              {siteConfig.description}
            </p>
          </div>

          {/* Dynamic Links Columns */}
          {/* Limit to 2 columns for layout balance if needed, or map all */}
          {footerSections.slice(0, 2).map((section) => (
            <div key={section.title}>
              <h4 className="font-serif text-sm uppercase tracking-widest mb-6 text-primary">{section.title}</h4>
              <ul className="space-y-4 text-sm text-secondary/70 font-light">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
          <p>{siteConfig.copyright}</p>
          <div className="flex gap-6">
             {/* Use the 3rd section (Legal) if it exists, or simulated links */}
             {footerSections[2]?.links.map(link => (
                <Link key={link.label} href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
             ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
