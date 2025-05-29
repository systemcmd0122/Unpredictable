import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Interaction, UserPreferences } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomColor(saturation = 70, lightness = 60): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function randomShape(): string {
  const shapes = ['circle', 'square', 'triangle', 'hexagon', 'blob'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

export function randomPosition(maxWidth: number, maxHeight: number): { x: number; y: number } {
  return {
    x: Math.floor(Math.random() * maxWidth),
    y: Math.floor(Math.random() * maxHeight),
  };
}

export function saveUserPreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return getDefaultUserPreferences();
  }
  
  const stored = localStorage.getItem('userPreferences');
  
  if (!stored) {
    return getDefaultUserPreferences();
  }
  
  try {
    return JSON.parse(stored) as UserPreferences;
  } catch (e) {
    return getDefaultUserPreferences();
  }
}

export function getDefaultUserPreferences(): UserPreferences {
  return {
    theme: 'system',
    animations: true,
    visitInfo: {
      count: 1,
      lastVisit: new Date().toISOString(),
      firstVisit: new Date().toISOString(),
    },
    interactions: [],
  };
}

export function addInteraction(type: Interaction['type'], data?: any): void {
  if (typeof window === 'undefined') return;
  
  const preferences = getUserPreferences();
  
  preferences.interactions.push({
    id: Math.random().toString(36).substring(2, 9),
    type,
    timestamp: Date.now(),
    data,
  });
  
  if (preferences.interactions.length > 50) {
    preferences.interactions = preferences.interactions.slice(-50);
  }
  
  saveUserPreferences(preferences);
}

export function updateVisitInfo(): UserPreferences {
  if (typeof window === 'undefined') {
    return getDefaultUserPreferences();
  }
  
  const preferences = getUserPreferences();
  const now = new Date().toISOString();
  
  const lastVisit = new Date(preferences.visitInfo.lastVisit);
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  if (lastVisit < thirtyMinutesAgo) {
    preferences.visitInfo.count += 1;
    preferences.visitInfo.lastVisit = now;
  }
  
  saveUserPreferences(preferences);
  return preferences;
}

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 5) return "夜更かしですね...";
  if (hour < 12) return "おはようございます";
  if (hour < 18) return "こんにちは";
  return "こんばんは";
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    年: 31536000,
    ヶ月: 2592000,
    日: 86400,
    時間: 3600,
    分: 60,
    秒: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    
    if (interval >= 1) {
      return `${interval}${unit}前`;
    }
  }
  
  return "たった今";
}