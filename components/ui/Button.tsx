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
  // Magnetic effect removed for stability and professional feel
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={clsx(
        "relative uppercase tracking-[0.2em] text-[11px] font-medium px-10 py-4 transition-all duration-300 rounded-none border border-transparent",
        "flex items-center justify-center gap-2", // Ensure centered content
        
        // Primary: Solid Dark -> Solid Gold
        variant === "primary" && "bg-primary text-white hover:bg-accent-gold hover:text-white",
        
        // Secondary: Outline Dark -> Solid Dark
        variant === "secondary" && "bg-transparent border-primary text-primary hover:bg-primary hover:text-white",
        
        // White: Solid White -> Solid Dark (Standard luxury inverse)
        variant === "white" && "bg-white text-primary hover:bg-primary hover:text-white shadow-lg",
        
        // Outline White: Outline White -> White Fill
        variant === "outline-white" && "bg-transparent border-white text-white hover:bg-white hover:text-primary",
        
        className
      )}
      {...props as any}
    >
      {children}
    </motion.button>
  );
}
