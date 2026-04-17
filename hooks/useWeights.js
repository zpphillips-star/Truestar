import { useState, useCallback, useEffect } from "react";
import { CATEGORIES, DEFAULT_WEIGHTS } from "../lib/constants";

export function useWeights() {
  const [weights, setWeights] = useState(() => {
    try {
      const saved = localStorage.getItem("ts_weights");
      return saved ? JSON.parse(saved) : DEFAULT_WEIGHTS;
    } catch { return DEFAULT_WEIGHTS; }
  });

  useEffect(() => {
    try { localStorage.setItem("ts_weights", JSON.stringify(weights)); } catch {}
  }, [weights]);

  const [totalFlash, setTotalFlash] = useState(false);

  const handleWeight = useCallback((id, newVal) => {
    setWeights((prev) => {
      const others = CATEGORIES.filter((c) => c.id !== id);
      const remaining = 100 - newVal;
      const currentOtherTotal = others.reduce((a, c) => a + prev[c.id], 0);
      const next = { ...prev, [id]: newVal };
      if (currentOtherTotal === 0) {
        const each = Math.floor(remaining / others.length);
        const leftover = remaining - each * others.length;
        others.forEach((c, i) => { next[c.id] = each + (i === 0 ? leftover : 0); });
      } else {
        let distributed = 0;
        others.forEach((c, i) => {
          if (i < others.length - 1) {
            const share = Math.round((prev[c.id] / currentOtherTotal) * remaining);
            next[c.id] = share;
            distributed += share;
          } else {
            next[c.id] = remaining - distributed;
          }
        });
      }
      Object.keys(next).forEach((k) => { if (next[k] < 0) next[k] = 0; });
      const newTotal = Object.values(next).reduce((a, b) => a + b, 0);
      if (newTotal === 100) {
        setTotalFlash(true);
        setTimeout(() => setTotalFlash(false), 600);
      }
      return next;
    });
  }, []);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const resetWeights = () => setWeights(DEFAULT_WEIGHTS);

  return { weights, handleWeight, total, totalFlash, resetWeights };
}
