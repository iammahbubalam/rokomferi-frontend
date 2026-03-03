"use client";

import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Ordering",
      items: [
        {
          question: "Can I customize my order?",
          answer: "Currently, we operate on a ready-to-wear model to ensure the highest standards of quality and consistency. However, for specialized bridal inquiries or bespoke requests, our Concierge team is available for direct consultation."
        },
        {
          question: "How do I know my size?",
          answer: "We provide a detailed Size Guide on every product page. If you are between sizes or need specific measurements, please contact our support team for personalized assistance."
        }
      ]
    },
    {
      title: "Payments & Pre-orders",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept Cash on Delivery (COD), bKash, Nagad, and Rocket for all local orders within Bangladesh. Please note that we do not accept international credit or debit cards at this time."
        },
        {
          question: "How do pre-orders work?",
          answer: "Valancis offers pre-order opportunities for upcoming collections. Please note that all pre-orders require an early advance payment via bKash, Nagad, or Rocket to secure your piece from our limited production runs."
        }
      ]
    },
    {
      title: "Shipping",
      items: [
        {
          question: "Do you ship internationally?",
          answer: "Currently, we only ship within Bangladesh. We do not offer international shipping at this time, but we are working to expand our reach in the future."
        },
        {
          question: "How long will my order take?",
          answer: "In-stock items are typically processed within 2-3 business days and delivered within 3-5 business days across Bangladesh. For pre-orders, the estimated shipping date will be clearly indicated on the product page."
        }
      ]
    },
    {
      title: "Care & Maintenance",
      items: [
        {
          question: "How do I care for my silk saree?",
          answer: "To maintain the luster and integrity of your Katan, Jamdani, and Silk garments, we strictly recommend dry cleaning only. Store your pieces in a breathable muslin bag away from direct sunlight."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-canvas text-primary pt-32 pb-24">
      <Container>
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-serif text-4xl md:text-6xl mb-6 tracking-tight">Frequently Asked Questions</h1>
            <p className="text-primary/60 font-utility font-light text-lg md:text-xl max-w-2xl leading-relaxed">
              Valancis is a modern lifestyle brand from Bangladesh, dedicated to quiet luxury and timeless craftsmanship.
              Find answers to common inquiries below.
            </p>
          </motion.div>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          {/* Navigation Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-40 space-y-4">
              <p className="uppercase tracking-widest text-[10px] font-bold text-primary/40 mb-6">Categories</p>
              {faqCategories.map((cat) => (
                <button
                  key={cat.title}
                  onClick={() => {
                    const element = document.getElementById(cat.title.toLowerCase().replace(/\s+/g, '-'));
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="block w-full text-left font-serif text-lg hover:translate-x-2 transition-transform duration-300"
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-9 space-y-24">
            {faqCategories.map((category, idx) => (
              <motion.section
                key={category.title}
                id={category.title.toLowerCase().replace(/\s+/g, '-')}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <h2 className="uppercase tracking-[0.2em] text-[11px] font-bold text-primary/40 mb-8 border-b border-accent-subtle pb-4">
                  {category.title}
                </h2>
                <Accordion items={category.items} />
              </motion.section>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 p-12 bg-accent-subtle/30 rounded-2xl text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Still need assistance?</h2>
          <p className="text-primary/60 font-light mb-10 max-w-xl mx-auto">
            Our Concierge team is here to help with sizing, product details, or bespoke order inquiries.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/contact"
              className="px-8 py-4 bg-primary text-canvas rounded-full flex items-center gap-2 hover:scale-105 transition-transform duration-300"
            >
              Contact Support <ArrowRight size={18} />
            </Link>
            <a
              href="mailto:support@valancis.com"
              className="px-8 py-4 border border-primary text-primary rounded-full flex items-center gap-2 hover:bg-primary hover:text-canvas transition-all duration-300"
            >
              Email Us <Mail size={18} />
            </a>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
