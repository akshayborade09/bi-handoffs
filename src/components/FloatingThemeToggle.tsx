"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function FloatingThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-xl transition-all hover:scale-110 hover:shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode (Shift + D)`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {isDark ? (
        <span className="material-symbols-outlined text-[24px] text-yellow-500">
          light_mode
        </span>
      ) : (
        <span className="material-symbols-outlined text-[24px] text-zinc-700">
          dark_mode
        </span>
      )}
    </motion.button>
  );
}
