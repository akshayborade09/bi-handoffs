"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ModuleListItem } from "./ModuleListItem";
import { ThemeToggle } from "./ThemeToggle";
import { modules } from "@/data/modules";

export const DOCK_WIDTH_EXPANDED = 320;
/** Tailwind spacing 3 = 12px – inset for floating dock */
export const DOCK_INSET = 12;

/** How far off-screen the dock slides when collapsed (panel width + inset) */
const DOCK_SLIDE_OFFSET = DOCK_WIDTH_EXPANDED + DOCK_INSET;

const dockTransition = {
  type: "tween" as const,
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as const,
};

interface LeftDockProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelectPage?: (pageId: string) => void;
}

export function LeftDock({ isExpanded, onToggleExpand, onSelectPage }: LeftDockProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const handleToggleModule = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Floating icon on top-left when dock is collapsed – click to slide dock in */}
      {!isExpanded && (
        <motion.button
          type="button"
          onClick={onToggleExpand}
          className="fixed left-3 top-3 z-[200] flex min-h-10 min-w-10 touch-manipulation cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          aria-label="Expand dock"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        >
          <span className="material-symbols-outlined select-none" aria-hidden>
            dock_to_right
          </span>
        </motion.button>
      )}

      {/* Dock panel – slides off-screen left when collapsed, in when expanded */}
      <motion.aside
        className="fixed left-3 top-3 bottom-3 z-20 flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        style={{ width: DOCK_WIDTH_EXPANDED }}
        animate={{ x: isExpanded ? 0 : -DOCK_SLIDE_OFFSET }}
        transition={dockTransition}
        aria-label={isExpanded ? "Modules dock expanded" : "Modules dock collapsed"}
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3">
            <header className="mb-4 sm:mb-5">
              <div className="flex min-h-11 items-center justify-between gap-2 sm:min-h-10 px-2">
                <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-xl">
                  Bonds India Handoffs
                </h1>
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="flex min-h-9 min-w-9 touch-manipulation shrink-0 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  aria-label="Collapse dock"
                >
                  <span className="material-symbols-outlined select-none" aria-hidden>
                    dock_to_left
                  </span>
                </button>
              </div>
            </header>
            <ul className="flex flex-col gap-1" role="list">
              {modules.map((module) => (
                <li key={module.id}>
                  <ModuleListItem
                    module={module}
                    isExpanded={expandedModuleId === module.id}
                    onToggle={() => handleToggleModule(module.id)}
                    onSelectPage={onSelectPage}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 flex justify-end border-t border-zinc-200 p-3 dark:border-zinc-700">
            <ThemeToggle />
          </div>
        </div>
      </motion.aside>
    </>
  );
}
