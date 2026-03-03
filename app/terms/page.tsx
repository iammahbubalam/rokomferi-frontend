"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";

export default function TermsPage() {
  const sections = [
    {
      title: "Introduction",
      content: "Valancis is a modern lifestyle brand based in Bangladesh. By accessing or using our services, you agree to follow the terms and conditions outlined below, designed to ensure a seamless and premium experience for all our clients."
    },
    {
      title: "Payments & Transactions",
      content: "We currently accept Cash on Delivery (COD), bKash, Rocket, and Nagad for all orders within Bangladesh. Please note that we do not accept international credit or debit cards at this time. All transactions are processed in BDT (Bangladeshi Taka)."
    },
    {
      title: "Pre-order Policy",
      content: "Valancis offers exclusive pre-order opportunities for upcoming collections. To secure your selection from these limited production runs, an early advance payment is required via bKash, Rocket, or Nagad. Pre-order timelines are estimates and will be clearly communicated on the product page."
    },
    {
      title: "Shipping & Delivery",
      content: "Our services are currently limited to deliveries within Bangladesh. We do not offer international shipping at this time. In-stock items are typically processed within 2-3 business days, while delivery across Bangladesh generally takes 3-5 business days."
    },
    {
      title: "Returns & Exchanges",
      content: "Due to the artisanal and limited nature of our collections, we maintain a selective return policy. Please consult our support team for any concerns regarding fit or quality before making your purchase. We are committed to your total satisfaction."
    },
    {
      title: "Intellectual Property",
      content: "All content, designs, and intellectual property on this site are the exclusive property of Valancis. Unauthorized reproduction or exploitation of our products and brand assets is strictly prohibited."
    }
  ];

  return (
    <div className="min-h-screen bg-canvas text-primary pt-32 pb-24">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20 text-center"
          >
            <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-primary/40 mb-4">Terms of Service</p>
            <h1 className="font-serif text-4xl md:text-6xl mb-6 tracking-tight">Terms of Service</h1>
            <div className="w-12 h-[1px] bg-primary/20 mx-auto"></div>
          </motion.div>

          {/* Content */}
          <div className="space-y-16">
            {sections.map((section, idx) => (
              <motion.section
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="max-w-2xl mx-auto text-center"
              >
                <h2 className="font-serif text-2xl mb-4 italic text-primary/80">{section.title}</h2>
                <p className="text-primary/60 font-utility font-light leading-relaxed text-base md:text-lg">
                  {section.content}
                </p>
              </motion.section>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 pt-12 border-t border-accent-subtle text-center"
          >
            <p className="text-[10px] uppercase tracking-widest text-primary/30">
              Last Updated: March 2026 • Valancis Bangladesh
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
