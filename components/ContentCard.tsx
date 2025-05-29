"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GeminiResponse } from "@/lib/types";
import { RefreshCw as Refresh, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, addInteraction } from "@/lib/utils";
import { fadeIn, scaleUp } from "@/lib/animations";

interface ContentCardProps {
  content: GeminiResponse | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export function ContentCard({ content, onRefresh, isLoading }: ContentCardProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  if (!content && !isLoading) {
    return null;
  }

  const handleCopy = () => {
    if (!content) return;
    
    navigator.clipboard.writeText(content.content);
    setIsCopied(true);
    addInteraction('click', { element: 'copy-content' });
    
    toast({
      title: "コピーしました！",
      description: "コンテンツをクリップボードにコピーしました。",
      duration: 2000,
    });
  };

  const handleShare = async () => {
    if (!content) return;
    
    addInteraction('click', { element: 'share-content' });
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gemini生成コンテンツ',
          text: content.content,
        });
        
        toast({
          title: "共有完了！",
          description: "コンテンツを共有しました。",
          duration: 2000,
        });
      } catch (error) {
        console.error('共有エラー:', error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-background/80 border-none shadow-xl">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ) : content ? (
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <p className="whitespace-pre-line text-foreground">{content.content}</p>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  生成日時: {formatDate(content.timestamp)}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleCopy}
                    title="クリップボードにコピー"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleShare}
                    title="コンテンツを共有"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => {
                      onRefresh();
                      addInteraction('click', { element: 'refresh-content' });
                    }}
                    size="icon"
                    title="新しいコンテンツを生成"
                  >
                    <Refresh className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}