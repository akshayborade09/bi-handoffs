"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Module } from "@/data/modules";

interface ModuleListItemProps {
  module: Module;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ModuleListItem({
  module,
  isExpanded,
  onToggle,
}: ModuleListItemProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-12 w-full touch-manipulation items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/80 sm:min-h-11 sm:px-5 sm:py-3.5"
        aria-expanded={isExpanded}
        aria-controls={`module-content-${module.id}`}
        id={`module-trigger-${module.id}`}
      >
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:text-base">
          {module.title}
        </span>
        <span className="shrink-0 text-zinc-500 dark:text-zinc-400">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
          ) : (
            <ChevronDown className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`module-content-${module.id}`}
            role="region"
            aria-labelledby={`module-trigger-${module.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-5 sm:py-4">
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
                {module.description}
              </p>
              <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-500 sm:mt-3 sm:text-sm">
                Version {module.version}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
