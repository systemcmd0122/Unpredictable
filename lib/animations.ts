import { Variants } from "framer-motion";

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Slide up animation
export const slideUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

// Scale animation
export const scaleUp: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

// Rotate animation for icons or elements
export const rotate: Variants = {
  hidden: { rotate: -5, opacity: 0 },
  visible: { 
    rotate: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

// Bounce animation
export const bounce: Variants = {
  hidden: { y: 0 },
  visible: { 
    y: [0, -10, 0],
    transition: { 
      duration: 0.6, 
      times: [0, 0.5, 1],
      ease: "easeInOut",
      repeat: 0
    }
  },
};

// Pulse animation
export const pulse: Variants = {
  hidden: { scale: 1 },
  visible: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 1.5, 
      times: [0, 0.5, 1],
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  },
};