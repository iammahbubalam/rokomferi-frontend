import { Facebook, Instagram, Youtube } from "lucide-react";

import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { FooterSection, SiteConfig } from "@/lib/data";
import Link from "next/link";

const TikTok = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const SocialIcon = ({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) => {
  switch (platform.toLowerCase()) {
    case "facebook":
    case "fb":
      return <Facebook className={className} />;
    case "instagram":
      return <Instagram className={className} />;
    case "youtube":
      return <Youtube className={className} />;
    case "tiktok":
      return <TikTok className={className} />;
    default:
      return null;
  }
};

interface FooterProps {
  siteConfig: SiteConfig;
  footerSections: FooterSection[];
}

export function Footer({ siteConfig, footerSections }: FooterProps) {
  return (
    <footer className="bg-[#f9f8f6] pt-20 pb-0 text-primary border-t border-primary/5 overflow-hidden relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
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
              <span className="font-serif text-2xl font-bold uppercase tracking-widest text-primary">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-secondary/80 max-w-xs font-light">
              {siteConfig.description}
            </p>

            {/* Social Links */}
            {siteConfig.socials && siteConfig.socials.length > 0 && (
              <div className="flex items-center gap-4 mt-2">
                {siteConfig.socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white border border-primary/10 text-primary/70 hover:text-primary hover:border-primary/30 transition-all hover:scale-110"
                    aria-label={social.platform}
                  >
                    <SocialIcon
                      platform={social.platform}
                      className="w-4 h-4"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Links Columns */}
          {/* Limit to 2 columns for layout balance if needed, or map all */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-serif text-sm uppercase tracking-widest mb-6 text-primary">
                {section.title}
              </h4>
              <ul className="space-y-4 text-sm text-secondary/70 font-light">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors"
                    >
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

        <div className="py-8 flex justify-center items-center text-[10px] uppercase tracking-widest text-secondary/50">
          <p>{siteConfig.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
