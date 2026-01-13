"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowRight, Loader2 } from "lucide-react";
import { searchProducts } from "@/lib/data";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image"; 

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Handle Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const data = await searchProducts(query);
          setResults(data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
           className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col"
        >
           {/* Header / Close */}
           <div className="flex justify-end p-8">
             <button 
                onClick={onClose}
                className="p-4 rounded-full hover:bg-black/5 transition-colors group"
             >
                <X className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
             </button>
           </div>

           {/* Content */}
           <div className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col pt-12">
              
              {/* Input */}
              <div className="relative border-b-2 border-primary/10 focus-within:border-primary transition-colors duration-500">
                 <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary/40" />
                 <input
                   ref={inputRef}
                   type="text"
                   placeholder="Search the collection..."
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   className="w-full bg-transparent p-6 pl-16 text-3xl md:text-5xl font-serif placeholder:text-primary/20 focus:outline-none text-primary"
                 />
                 {isLoading && (
                   <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-6 h-6 animate-spin text-accent-gold" />
                   </div>
                 )}
              </div>

              {/* Results Grid */}
              <div className="flex-1 overflow-y-auto mt-12 pb-24 scrollbar-hide">
                 {results.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {results.map((product, idx) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                           <Link 
                             href={`/product/${product.slug}`} 
                             onClick={onClose}
                             className="group flex gap-6 items-center p-4 rounded-xl hover:bg-primary/5 transition-colors"
                           >
                                 <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden bg-main-secondary">
                                 <Image 
                                    src={product.images?.[0] || "/assets/placeholder.png"} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                 />
                              </div>
                              <div>
                                 <h4 className="font-serif text-xl group-hover:text-accent-gold transition-colors">{product.name}</h4>
                                 <span className="text-secondary text-sm mt-1 block">{product.categories?.[0]?.name || "Collection"}</span>
                                 <span className="text-primary font-medium mt-2 block">৳{(product.basePrice || 0).toLocaleString()}</span>
                              </div>
                           </Link>
                        </motion.div>
                      ))}
                   </div>
                 ) : query.length > 1 && !isLoading ? (
                   <div className="text-center text-secondary py-20">
                      <p className="text-lg">No results found for "{query}"</p>
                      <p className="text-sm mt-2">Try searching for "silk", "wool", or "top".</p>
                   </div>
                 ) : null}
              </div>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
