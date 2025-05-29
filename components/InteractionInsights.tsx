"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserPreferences, addInteraction } from "@/lib/utils";
import { Interaction } from "@/lib/types";
import { slideUp } from "@/lib/animations";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

export function InteractionInsights() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    const preferences = getUserPreferences();
    setInteractions(preferences.interactions);
  }, []);

  if (interactions.length === 0) return null;

  const interactionTypes = {
    click: 'クリック',
    hover: 'ホバー',
    scroll: 'スクロール',
    input: '入力',
    visit: '訪問'
  };

  const interactionCounts = interactions.reduce((acc: Record<string, number>, interaction) => {
    const type = interactionTypes[interaction.type as keyof typeof interactionTypes] || interaction.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(interactionCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
      onClick={() => addInteraction('click', { element: 'interaction-insights' })}
    >
      <Card className="backdrop-blur-sm bg-background/80 border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-lg">インタラクションパターン</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {Object.entries(interactionCounts).map(([type, count]) => (
              <Badge key={type} variant="secondary">
                {type}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}