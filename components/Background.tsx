"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RandomElement } from "@/hooks/useRandomEffect";

interface BackgroundProps {
  elements: RandomElement[];
}

export function Background({ elements }: BackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {elements.map((element) => (
        <BackgroundElement key={element.id} element={element} />
      ))}
    </div>
  );
}

function BackgroundElement({ element }: { element: RandomElement }) {
  const { shape, color, position, size, rotation, opacity } = element;

  // Different shapes
  const shapeElements = {
    circle: (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          x: [position.x - 20, position.x + 20, position.x],
          y: [position.y - 20, position.y + 20, position.y],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "reverse",
          times: [0, 0.5, 1],
        }}
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          opacity: opacity,
          borderRadius: '50%',
          position: 'absolute',
          left: position.x,
          top: position.y,
          transform: `rotate(${rotation}deg)`,
        }}
      />
    ),
    square: (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          rotate: [rotation, rotation + 45, rotation],
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity,
          repeatType: "reverse",
          times: [0, 0.5, 1],
        }}
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          opacity: opacity,
          position: 'absolute',
          left: position.x,
          top: position.y,
        }}
      />
    ),
    triangle: (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 0.8], 
          rotate: [rotation, rotation + 360, rotation],
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        style={{
          width: 0,
          height: 0,
          opacity: opacity,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
          position: 'absolute',
          left: position.x,
          top: position.y,
        }}
      />
    ),
    hexagon: (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          x: [position.x, position.x + 50, position.x],
          y: [position.y, position.y - 50, position.y],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity,
          repeatType: "reverse",
          times: [0, 0.5, 1],
        }}
        style={{
          width: size,
          height: `${size * 0.866}px`,
          backgroundColor: color,
          opacity: opacity,
          position: 'absolute',
          left: position.x,
          top: position.y,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        }}
      />
    ),
    blob: (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0.9, 1.1, 0.9],
          rotate: [rotation, rotation + 20, rotation], 
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          opacity: opacity,
          position: 'absolute',
          left: position.x,
          top: position.y,
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        }}
      />
    ),
  };

  // Return the appropriate shape
  return shapeElements[shape as keyof typeof shapeElements] || shapeElements.circle;
}