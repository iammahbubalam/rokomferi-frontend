"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "white" | "outline-white";
  children: React.ReactNode;
}

export function Button({ 
  variant = "primary", 
  children, 
  className,
  ...props 
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.15; // Magnetic strength
    const y = (clientY - (top + height / 2)) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={clsx(
        "relative uppercase tracking-[0.15em] text-xs font-bold px-8 py-4 transition-all duration-300 rounded-none",
        // Variants
        variant === "primary" && "bg-primary text-white hover:bg-accent-gold hover:text-white border border-transparent",
        variant === "secondary" && "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white",
        variant === "white" && "bg-white text-primary border border-transparent hover:bg-primary hover:text-white shadow-sm",
        variant === "outline-white" && "bg-transparent border border-white text-white hover:bg-white/10",
        className
      )}
      {...props as any}
    >
      {children}
    </motion.button>
  );
}
