"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * `useReducedMotion()` from Framer can disagree between SSR and the first client
 * paint (e.g. null/false vs true for prefers-reduced-motion), which breaks hydration.
 * This value is only `true` after mount and only when the user prefers reduced motion.
 * Until then it stays `false` so the server and first client render match.
 */
export function useHydrationSafeReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const prefersReduced = useReducedMotion();
  return mounted && prefersReduced === true;
}
