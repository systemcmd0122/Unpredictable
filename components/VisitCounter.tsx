"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserPreferences, updateVisitInfo, formatDate, timeAgo } from "@/lib/utils";
import { VisitInfo } from "@/lib/types";
import { slideUp } from "@/lib/animations";

export function VisitCounter() {
  const [visitInfo, setVisitInfo] = useState<VisitInfo | null>(null);

  useEffect(() => {
    const preferences = updateVisitInfo();
    setVisitInfo(preferences.visitInfo);
  }, []);

  if (!visitInfo) return null;

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="text-sm text-muted-foreground text-center"
    >
      <p>
        Visit #{visitInfo.count} • First visited {timeAgo(visitInfo.firstVisit)}
      </p>
    </motion.div>
  );
}