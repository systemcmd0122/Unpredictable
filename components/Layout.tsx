"use client";

import { useState, useEffect } from "react";
import { Background } from "./Background";
import { ThemeToggle } from "./ui/theme-toggle";
import { useRandomElements } from "@/hooks/useRandomEffect";
import { motion } from "framer-motion";
import { VisitCounter } from "./VisitCounter";
import { addInteraction, getTimeBasedGreeting } from "@/lib/utils";
import { fadeIn, staggerContainer } from "@/lib/animations";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { elements, regenerateElements } = useRandomElements(6);
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    setGreeting(getTimeBasedGreeting());
    
    // Regenerate background elements every 30 seconds
    const interval = setInterval(() => {
      regenerateElements();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [regenerateElements]);

  // Track page interaction
  useEffect(() => {
    addInteraction('visit', { page: 'home' });
  }, []);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      onClick={() => regenerateElements()}
    >
      {/* Background elements */}
      <Background elements={elements} />
      
      {/* Header with theme toggle */}
      <motion.header 
        className="w-full max-w-5xl mx-auto flex justify-between items-center mb-8 z-10"
        variants={fadeIn}
      >
        <motion.h1 
          className="text-lg sm:text-xl font-medium"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {greeting}
        </motion.h1>
        <ThemeToggle />
      </motion.header>
      
      {/* Main content */}
      <motion.main 
        className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center z-10"
        variants={fadeIn}
      >
        {children}
      </motion.main>
      
      {/* Footer with visit counter */}
      <motion.footer 
        className="w-full max-w-5xl mx-auto mt-8 z-10"
        variants={fadeIn}
      >
        <VisitCounter />
      </motion.footer>
    </motion.div>
  );
}