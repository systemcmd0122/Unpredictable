"use client";

import { useState, useEffect } from 'react';
import { randomColor, randomShape, randomPosition } from '@/lib/utils';

export interface RandomElement {
  id: string;
  color: string;
  shape: string;
  position: { x: number; y: number };
  size: number;
  rotation: number;
  opacity: number;
}

export function useRandomElements(count = 5) {
  const [elements, setElements] = useState<RandomElement[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial setup
    updateDimensions();

    // Add event listener
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Generate random elements when dimensions change
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const newElements: RandomElement[] = [];
    
    for (let i = 0; i < count; i++) {
      const position = randomPosition(dimensions.width, dimensions.height);
      
      newElements.push({
        id: `element-${i}`,
        color: randomColor(),
        shape: randomShape(),
        position,
        size: Math.floor(Math.random() * 100) + 50,
        rotation: Math.floor(Math.random() * 360),
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    setElements(newElements);
  }, [dimensions, count]);

  // Function to regenerate elements
  const regenerateElements = () => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const newElements: RandomElement[] = elements.map(el => {
      const position = randomPosition(dimensions.width, dimensions.height);
      
      return {
        ...el,
        color: randomColor(),
        position,
        rotation: Math.floor(Math.random() * 360),
        opacity: Math.random() * 0.5 + 0.1
      };
    });
    
    setElements(newElements);
  };

  return { elements, regenerateElements };
}