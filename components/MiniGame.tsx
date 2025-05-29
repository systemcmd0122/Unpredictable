"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { addInteraction } from '@/lib/utils';
import { fadeIn, slideUp } from '@/lib/animations';
import { Trophy, Timer, RefreshCw } from 'lucide-react';

interface Target {
  id: number;
  x: number;
  y: number;
  caught: boolean;
}

export function MiniGame({ onFinish }: { onFinish: () => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('miniGameHighScore');
    if (stored) {
      setHighScore(parseInt(stored, 10));
    }
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setTargets((prev) => {
        const newTarget = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          caught: false,
        };
        return [...prev.slice(-4), newTarget];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  const handleTargetClick = (targetId: number) => {
    if (gameOver) return;

    setTargets((prev) =>
      prev.map((target) =>
        target.id === targetId && !target.caught
          ? { ...target, caught: true }
          : target
      )
    );
    setScore((prev) => prev + 1);
    addInteraction('click', { element: 'game-target', score });
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    addInteraction('click', { element: 'start-game' });
  };

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('miniGameHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-background/80 border-none shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5" />
            キャッチ・ザ・ライト
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="flex justify-center items-center gap-4 mb-4">
              <p className="text-lg">スコア: {score}</p>
              <p className="text-lg flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {timeLeft}秒
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              ハイスコア: {highScore}
            </p>
          </div>

          {!gameStarted ? (
            <motion.div variants={fadeIn} className="text-center">
              <p className="mb-4">
                光る点をクリックしてポイントを獲得しましょう！
                制限時間は30秒です。
              </p>
              <Button onClick={startGame}>
                ゲームを開始
              </Button>
            </motion.div>
          ) : gameOver ? (
            <motion.div variants={fadeIn} className="text-center">
              <p className="text-xl mb-4">
                ゲーム終了！ スコア: {score}
              </p>
              <div className="flex justify-center gap-2">
                <Button onClick={startGame}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  もう一度
                </Button>
                <Button variant="outline" onClick={onFinish}>
                  コンテンツに戻る
                </Button>
              </div>
            </motion.div>
          ) : (
            <div
              className="relative w-full h-[300px] bg-background/50 rounded-lg overflow-hidden"
              style={{ cursor: 'crosshair' }}
            >
              {targets.map((target) => (
                <motion.div
                  key={target.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: target.caught ? 0 : 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute w-6 h-6"
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => handleTargetClick(target.id)}
                >
                  <div
                    className={`w-full h-full rounded-full bg-primary animate-pulse ${
                      target.caught ? 'opacity-0' : 'opacity-100 cursor-pointer'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}