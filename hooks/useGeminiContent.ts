"use client";

import { useState, useEffect } from "react";
import { getGeminiResponse, generateRandomPrompt } from "@/lib/gemini";
import { GeminiResponse } from "@/lib/types";

export function useGeminiContent(apiKey?: string) {
  const [content, setContent] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch new content
  const fetchContent = async (customPrompt?: string) => {
    if (!apiKey) {
      setError("API key is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const prompt = customPrompt || generateRandomPrompt();
      const response = await getGeminiResponse(prompt, apiKey);
      
      setContent({
        content: response,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get content");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    content,
    isLoading,
    error,
    fetchContent
  };
}