"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ContentCard } from "@/components/ContentCard";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Button } from "@/components/ui/button";
import { useGeminiContent } from "@/hooks/useGeminiContent";
import { addInteraction } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeIn, pulse, slideUp, staggerContainer } from "@/lib/animations";
import { BrainCog, Sparkles } from "lucide-react";
import { InteractionInsights } from "@/components/InteractionInsights";
import { MiniGame } from "@/components/MiniGame";

const DEFAULT_API_KEY = "AIzaSyCuspouVwXN6VKZK6U_ppWfkCdoT8YLJns";

export default function Home() {
  const [apiKey, setApiKey] = useState<string>(DEFAULT_API_KEY);
  const { content, isLoading, error, fetchContent } = useGeminiContent(apiKey);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("gemini-api-key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    if (apiKey && !content && !isLoading && !error) {
      fetchContent();
    }
  }, [apiKey, content, isLoading, error, fetchContent]);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem("gemini-api-key", key);
    setApiKey(key);
  };

  const handleRefresh = () => {
    fetchContent();
    setShowGame(false);
  };

  const handleResetApiKey = () => {
    localStorage.removeItem("gemini-api-key");
    setApiKey("");
    addInteraction('click', { element: 'reset-api-key' });
  };

  const toggleGame = () => {
    setShowGame(!showGame);
    addInteraction('click', { element: 'toggle-game' });
  };

  return (
    <Layout>
      <motion.div 
        className="w-full space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {!apiKey ? (
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center space-y-2 mb-8">
              <motion.div 
                className="inline-block mb-4"
                variants={pulse}
                initial="hidden"
                animate="visible"
              >
                <BrainCog size={48} className="text-primary mx-auto" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">予測不能へようこそ</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                AIが生成する予想外のコンテンツで、訪れるたびに新しい発見があります。
                クイズやパズル、創作的なコンテンツをお楽しみください。
              </p>
            </motion.div>

            <Card className="backdrop-blur-sm bg-background/80 border-none shadow-xl">
              <CardHeader>
                <CardTitle>はじめましょう</CardTitle>
                <CardDescription>
                  Gemini APIキーを入力して体験を開始
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiKeyInput onSubmit={handleApiKeySubmit} />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="text-center mb-6"
              variants={slideUp}
            >
              <h1 className="text-2xl sm:text-3xl font-bold">今日はどんな発見があるでしょうか？</h1>
              <p className="text-muted-foreground mt-2">
                クイズ、パズル、創作的なコンテンツをお楽しみください
              </p>
              <Button
                variant="outline"
                onClick={toggleGame}
                className="mt-4"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {showGame ? "コンテンツを表示" : "ミニゲームで遊ぶ"}
              </Button>
            </motion.div>

            {showGame ? (
              <MiniGame onFinish={() => setShowGame(false)} />
            ) : (
              <ContentCard
                content={content}
                onRefresh={handleRefresh}
                isLoading={isLoading}
              />
            )}

            {error && (
              <motion.div 
                variants={fadeIn}
                className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-center"
              >
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={handleResetApiKey}
                >
                  APIキーをリセット
                </Button>
              </motion.div>
            )}

            {content && !showGame && <InteractionInsights />}

            <motion.div 
              variants={fadeIn}
              className="text-center mt-8"
            >
              <Button
                variant="outline"
                onClick={handleResetApiKey}
                className="text-xs"
              >
                別のAPIキーを使用
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>
    </Layout>
  );
}