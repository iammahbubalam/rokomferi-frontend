"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const selectedImage = images[selectedIndex] || images[0] || "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 h-fit lg:sticky lg:top-24">
      {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto scrollbar-hide lg:max-h-[70vh]">
        {images.map((url, idx) => (
          <button
            key={url}
            onClick={() => setSelectedIndex(idx)}
            className={clsx(
              "relative flex-shrink-0 w-20 h-28 lg:w-24 lg:h-36 border transition-all duration-300",
              selectedIndex === idx
                ? "border-primary opacity-100"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={url}
              alt="Product Thumbnail"
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-grow bg-bg-secondary aspect-[2/3] lg:h-[75vh] w-full overflow-hidden cursor-crosshair group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative"
          >
            {/* Normal Image */}
            <Image
              src={selectedImage}
              alt="Product Image"
              fill
              className={clsx(
                "object-cover transition-opacity duration-300",
                isZoomed ? "opacity-0" : "opacity-100"
              )}
              priority
            />

            {/* Zoomed Image (Background) */}
            <div
              className={clsx(
                "absolute inset-0 w-full h-full bg-no-repeat transition-opacity duration-300",
                isZoomed ? "opacity-100" : "opacity-0"
              )}
              style={{
                backgroundImage: `url(${selectedImage})`,
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundSize: "200%", // 2x Zoom level
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Hint Badge */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-primary text-[10px] uppercase tracking-widest px-3 py-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Zoom
        </div>
      </div>
    </div>
  );
}
