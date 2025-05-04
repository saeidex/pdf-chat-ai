"use client";

import { useRef } from "react";
import { motion, useInView, UseInViewOptions } from "framer-motion";

interface FloatingElementProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    distance?: number;
    once?: boolean;
    margin?: UseInViewOptions["margin"];
    yOffset?: number;
}

export function FloatingElement({
    children,
    className,
    delay = 0,
    duration = 3,
    distance = 15,
    once = true,
    margin = "-100px",
    yOffset = 0,
}: FloatingElementProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{
                opacity: 0,
                y: yOffset,
            }}
            animate={
                isInView
                    ? {
                          opacity: 1,
                          y: yOffset,
                      }
                    : {
                          opacity: 0,
                          y: yOffset,
                      }
            }
            transition={{
                opacity: {
                    duration: 0.5,
                    delay,
                },
                y: {
                    duration: 0.5,
                    delay,
                },
            }}
        >
            <motion.div
                animate={{
                    y: [0, distance, 0],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
