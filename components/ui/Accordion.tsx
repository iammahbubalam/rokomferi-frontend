"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface AccordionItemProps {
    question: string;
    answer: React.ReactNode;
    isOpen?: boolean;
    onClick?: () => void;
}

function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
    return (
        <div className="border-b border-accent-subtle overflow-hidden">
            <button
                onClick={onClick}
                className="w-full py-6 flex justify-between items-center text-left group transition-all duration-300"
            >
                <span className="font-serif text-lg md:text-xl text-primary transition-colors group-hover:text-primary/70">
                    {question}
                </span>
                <div className="flex-shrink-0 ml-4 p-1 rounded-full border border-accent-subtle text-primary/50 group-hover:text-primary transition-all duration-300">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="pb-8 text-primary/70 font-utility font-light leading-relaxed text-base md:text-lg max-w-2xl">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface AccordionProps {
    items: { question: string; answer: React.ReactNode }[];
}

export function Accordion({ items }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="flex flex-col">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
            ))}
        </div>
    );
}
