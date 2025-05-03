"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  margin?: string;
};

export function FadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 50,
  once = true,
  margin = "-100px",
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin 
  });

  const getDirectionProps = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      case "none":
        return {};
      default:
        return { y: distance };
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...getDirectionProps(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}