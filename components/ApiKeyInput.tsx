"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { addInteraction } from "@/lib/utils";
import { slideUp } from "@/lib/animations";

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }
    
    if (!apiKey.startsWith("AIza")) {
      setError("Invalid API key format. Gemini API keys usually start with 'AIza'");
      return;
    }
    
    addInteraction('input', { type: 'api-key-submitted' });
    onSubmit(apiKey);
  };

  return (
    <motion.div 
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="block text-sm font-medium">
            Gemini API Key
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setError(null);
            }}
            placeholder="Enter your Gemini API key"
            className="w-full"
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Get your API key from{" "}
            <a
              href="https://ai.google.dev/tutorials/setup"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-primary"
              onClick={() => addInteraction('click', { element: 'api-key-link' })}
            >
              Google AI Studio
            </a>
          </p>
        </div>
        <Button 
          type="submit" 
          className="w-full"
          onClick={() => addInteraction('click', { element: 'submit-api-key' })}
        >
          Continue
        </Button>
      </form>
    </motion.div>
  );
}