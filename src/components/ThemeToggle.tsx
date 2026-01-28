"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg p-2.5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 sm:min-h-10 sm:min-w-10"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
      ) : (
        <Moon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
      )}
    </button>
  );
}
