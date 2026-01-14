import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IntroProvider } from "@/context/IntroContext";
import { IntroOverlay } from "@/components/layout/IntroOverlay";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    title: {
      default: config.name,
      template: `%s | ${config.name}`,
    },
    description: config.description,
    icons: {
      icon: config.favicon || "/favicon.ico",
      shortcut: config.favicon || "/favicon.ico",
      apple: config.favicon || "/favicon.ico",
    },
    openGraph: {
      images: [config.logo], // Fallback/Default OG
    },
  };
}

import {
  getCategoryTree,
  getFooterSections,
  getSiteConfig,
  getCollections,
} from "@/lib/data";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthContextProvider } from "@/context/AuthContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global data on server
  const [siteConfig, categories, footerSections, collections] =
    await Promise.all([
      getSiteConfig(),
      getCategoryTree(),
      getFooterSections(),
      getCollections(),
    ]);

  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased bg-main text-primary flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <AuthContextProvider>
            <IntroProvider>
              <IntroOverlay />
              <CartProvider>
                <Navbar
                  categories={categories}
                  collections={collections}
                  siteConfig={siteConfig}
                />
                <main className="flex-grow pt-[88px] md:pt-[104px]">
                  {/* pt to offset fixed header height approx */}
                  {children}
                </main>
                <Footer
                  siteConfig={siteConfig}
                  footerSections={footerSections}
                />
                <CartDrawer />
              </CartProvider>
            </IntroProvider>
          </AuthContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
