"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const pageVariants = {
  leftToRight: {
    initial: { opacity: 0, x: -100 }, // Slide in from the left
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100, transition: { duration: 0 } }, // Slide out to the right
  },
  rightToLeft: {
    initial: { opacity: 0, x: 100 }, // Slide in from the right
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0 } }, // Slide out to the left
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0 } },
  },
};

const pageTransition = {
  duration: 0.5,
  ease: "easeInOut",
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current page path

  // Define animation direction based on the current page
  const getAnimationType = () => {
    switch (pathname) {
      case "/":
        return "fade";
      case "/items":
        return "fade";
      case "/places":
        return "fade";
      default:
        return "rightToLeft"; // Default animation
    }
  };

  const animationType = getAnimationType();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants[animationType]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ position: "absolute", width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
