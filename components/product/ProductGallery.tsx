"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeImage = images[selectedIndex] || images[0] || "/placeholder.jpg";

  // --- Mobile Scroll Sync ---
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const newIndex = Math.round(scrollLeft / clientWidth);
    setSelectedIndex(newIndex);
  };

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
      setSelectedIndex(index);
    }
  };

  // --- Desktop Zoom ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="w-full">
      {/* --- MOBILE VIEW: Swipeable Carousel (Instagram Style) --- */}
      <div className="lg:hidden relative w-full aspect-[4/5] bg-gray-50">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {images.map((url, idx) => (
            <div
              key={idx}
              className="w-full h-full flex-shrink-0 snap-center relative"
            >
              <Image
                src={url}
                alt={`Product image ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToImage(idx)}
              className={clsx(
                "w-2 h-2 rounded-full transition-all duration-300 shadow-sm",
                selectedIndex === idx
                  ? "bg-white scale-125 ring-1 ring-black/10"
                  : "bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>

        {/* Count Badge */}
        <div className="absolute top-4 right-4 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* --- DESKTOP VIEW: Professional Grid + Main Stage --- */}
      <div className="hidden lg:grid grid-cols-6 gap-4 sticky top-24">
        {/* Thumbnails Column (Left) */}
        <div className="col-span-1 flex flex-col gap-3 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {images.map((url, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={clsx(
                "relative w-full aspect-[3/4] border transition-all duration-200",
                selectedIndex === idx
                  ? "border-primary ring-1 ring-primary/20 opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
              )}
            >
              <Image
                src={url}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image Stage (Right) */}
        <div
          className="col-span-5 relative bg-gray-50 aspect-[4/5] overflow-hidden cursor-crosshair group"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          {/* Normal Image */}
          <Image
            src={activeImage}
            alt="Product Main"
            fill
            className={clsx(
              "object-cover transition-opacity duration-200",
              isZoomed ? "opacity-0" : "opacity-100"
            )}
            priority
          />

          {/* Zoomed Image (Background) */}
          <div
            className={clsx(
              "absolute inset-0 w-full h-full bg-no-repeat transition-opacity duration-200",
              isZoomed ? "opacity-100" : "opacity-0"
            )}
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: "200%",
            }}
          />

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full shadow-sm">
            <Maximize2 className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
