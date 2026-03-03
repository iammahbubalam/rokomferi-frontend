"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Our Commitment",
      content: "At Valancis, privacy is not just a policy—it is a cornerstone of our relationship with our clients. As a modern lifestyle brand based in Bangladesh, we are dedicated to protecting the personal information you entrust to us while providing you with an exceptional, curated experience."
    },
    {
      title: "Information Collection",
      content: "We collect information through various touchpoints, including when you create an account, place an order, or engage with our concierge service. This includes personal identifiers such as your name, contact details, and shipping address, as well as digital footprints that help us refine our service to your preferences."
    },
    {
      title: "Use of Information",
      content: "The data we collect is utilized solely to enhance your experience with Valancis. This includes processing transactions, providing dedicated support, and communicating invitations to new collections. We do not sell or trade your personal information to third parties."
    },
    {
      title: "Security & Retention",
      content: "We implement a rigorous set of technical and organizational measures to ensure your data is protected against unauthorized access. Your information is retained only as long as necessary to fulfill the purposes for which it was collected or to comply with legal obligations."
    },
    {
      title: "Your Rights",
      content: "You maintain full control over your data. You may request access to, correction of, or deletion of your personal information at any time by contacting our support team."
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
            <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-primary/40 mb-4">Legal & Privacy</p>
            <h1 className="font-serif text-4xl md:text-6xl mb-6 tracking-tight">Privacy Policy</h1>
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
