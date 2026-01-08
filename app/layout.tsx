import type { Metadata } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
  // Italic is included in variable fonts by default, but we can adhere to specific weights if needed
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rokomferi | Opulence Minimal",
  description: "A premium minimalist e-commerce experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodoni.variable} ${montserrat.variable} antialiased bg-main text-primary flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-grow pt-[88px] md:pt-[104px]"> 
          {/* pt to offset fixed header height approx */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
