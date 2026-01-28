"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ModuleListItem } from "@/components/ModuleListItem";
import { modules } from "@/data/modules";

export default function Home() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative flex min-h-screen min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-zinc-950 md:min-h-screen">
      <div className="absolute right-2 top-2 z-10 sm:right-4 sm:top-4">
        <ThemeToggle />
      </div>
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-8 md:py-10 lg:py-12"
      >
        <header className="mb-6 sm:mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl md:text-3xl">
            Bonds India Handoffs
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            Expand a module to view description and version.
          </p>
        </header>
        <ul className="flex flex-col gap-3 sm:gap-4" role="list">
          {modules.map((module) => (
            <li key={module.id}>
              <ModuleListItem
                module={module}
                isExpanded={expandedId === module.id}
                onToggle={() => handleToggle(module.id)}
              />
            </li>
          ))}
        </ul>
      </motion.main>
    </div>
  );
}
