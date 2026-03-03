"use client";

import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface HorizontalScrollProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * HorizontalScroll - Converts vertical scroll into smooth horizontal movement.
 *
 * Uses useSpring to add physics-based smoothing so the horizontal
 * translation feels buttery and cinematic rather than 1:1 jerky.
 */
export default function HorizontalScroll({ children, className }: HorizontalScrollProps) {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [scrollWidth, setScrollWidth] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Measure content and viewport dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (contentRef.current) {
                setScrollWidth(contentRef.current.scrollWidth);
            }
            setWindowWidth(window.innerWidth);
        };

        updateDimensions();
        const timer = setTimeout(updateDimensions, 800);
        window.addEventListener("resize", updateDimensions);
        return () => {
            window.removeEventListener("resize", updateDimensions);
            clearTimeout(timer);
        };
    }, [children]);

    // Calculate how far we need to translate horizontally (as a %)
    const scrollDistance = scrollWidth > windowWidth ? scrollWidth - windowWidth : 0;
    const scrollPercentage = scrollWidth > 0 ? (scrollDistance / scrollWidth) * 100 : 85;

    // Raw transform: map vertical scroll progress → horizontal position
    const xRaw = useTransform(scrollYProgress, [0, 1], ["0%", `-${scrollPercentage}%`]);

    // Smooth it with spring physics for a cinematic feel
    const x = useSpring(xRaw, {
        stiffness: 50,
        damping: 20,
        restDelta: 0.001,
    });

    // Section height = scroll space needed. More content = taller section.
    const sectionHeight = (() => {
        if (scrollWidth === 0 || windowWidth === 0) return 200;
        const ratio = scrollWidth / windowWidth;
        return Math.max(150, Math.min(300, ratio * 100));
    })();

    return (
        <section
            ref={targetRef}
            className="relative bg-canvas"
            style={{ height: `${sectionHeight}vh` }}
        >
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <motion.div
                    ref={contentRef}
                    style={{ x }}
                    className={`flex ${className || "gap-4 px-12 md:px-32"}`}
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
}
