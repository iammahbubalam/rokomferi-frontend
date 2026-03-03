"use client";

import { motion } from "framer-motion";

export function PremiumLoading() {
    const ringCount = 8;
    const rings = Array.from({ length: ringCount });

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#142934] overflow-hidden"
            aria-busy="true"
            aria-label="Loading"
        >
            {/* Background Ambient Glow */}
            <motion.div
                className="absolute w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <div className="relative flex items-center justify-center">
                {/* Abstract Geometric Sequence */}
                {rings.map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute border-[0.5px] border-white/10 rounded-[40%]"
                        style={{
                            width: 100 + i * 40,
                            height: 100 + i * 40,
                        }}
                        animate={{
                            rotate: [i * 45, i * 45 + 360],
                            borderRadius: ["40%", "50%", "40%"],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}

                {/* Central Complex Element */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute w-full h-full border-t border-white/40 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 2 + i * 0.5,
                                repeat: Infinity,
                                ease: [0.45, 0, 0.55, 1],
                                delay: i * 0.1,
                            }}
                        />
                    ))}

                    <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{
                            scale: [1, 2, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-24 flex flex-col items-center gap-4">
                <div className="h-[1px] w-40 bg-white/5 overflow-hidden">
                    <motion.div
                        className="h-full bg-white/40 w-full origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: [0.65, 0, 0.35, 1],
                        }}
                    />
                </div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-light font-utility">
                    Refining Experience
                </p>
            </div>
        </div>
    );
}
