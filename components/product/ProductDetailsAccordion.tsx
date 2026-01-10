"use client";

import { Product } from "@/lib/data";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}

function AccordionItem({ title, children, isOpen: defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-primary/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="font-serif text-lg text-primary group-hover:text-accent-gold transition-colors">{title}</span>
        <ChevronDown className={clsx("w-4 h-4 text-primary transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-secondary leading-relaxed font-light">
               {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductDetailsAccordion({ product }: { product: Product }) {
  return (
    <div className="border-t border-primary/10 mt-8">
      {product.weaversNote && (
        <AccordionItem title="The Weaver's Note" isOpen>
          <p className="italic text-primary/80">"{product.weaversNote}"</p>
        </AccordionItem>
      )}
      
      {product.fabricStory && (
        <AccordionItem title="Fabric Story">
           <p>{product.fabricStory}</p>
        </AccordionItem>
      )}

      {product.specifications && (
        <AccordionItem title="Specifications">
           <dl className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-dashed border-primary/10">
                 <dt className="text-secondary">Material</dt>
                 <dd className="font-medium text-primary text-right">{product.specifications.material}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-primary/10">
                 <dt className="text-secondary">Weave</dt>
                 <dd className="font-medium text-primary text-right">{product.specifications.weave}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-primary/10">
                 <dt className="text-secondary">Origin</dt>
                 <dd className="font-medium text-primary text-right">{product.specifications.origin}</dd>
              </div>
              <div className="py-2">
                 <dt className="text-secondary mb-2">Care</dt>
                 <dd className="font-medium text-primary">
                    <ul className="list-disc pl-4 space-y-1">
                       {product.specifications.care.map(c => <li key={c}>{c}</li>)}
                    </ul>
                 </dd>
              </div>
           </dl>
        </AccordionItem>
      )}

      <AccordionItem title="Shipping & Returns">
         <p>
           We offer complimentary express shipping on all orders within Dhaka. 
           International shipping is calculated at checkout. 
           <br/><br/>
           Returns are accepted within 7 days of delivery, provided the security tag remains attached.
         </p>
      </AccordionItem>
    </div>
  );
}
