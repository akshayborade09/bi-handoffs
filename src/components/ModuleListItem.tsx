"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Module } from "@/data/modules";
import { ShareModal } from "./ShareModal";

interface ModuleListItemProps {
  module: Module;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectPage?: (pageId: string) => void;
  onCloseDock?: () => void;
}

export function ModuleListItem({
  module,
  isExpanded,
  onToggle,
  onSelectPage,
  onCloseDock,
}: ModuleListItemProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharePageId, setSharePageId] = useState<string>("");
  const [sharePageName, setSharePageName] = useState<string>("");
  return (
    <div className="overflow-hidden border-b border-white/20 last:border-b-0 dark:border-white/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-11 w-full min-w-0 touch-manipulation cursor-pointer items-center justify-between gap-2 p-2 rounded-lg text-left transition-colors hover:bg-white/20 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-zinc-100 sm:min-h-10"
        aria-expanded={isExpanded}
        aria-controls={`module-content-${module.id}`}
        id={`module-trigger-${module.id}`}
      >
        <span className="min-w-0 truncate text-sm font-medium text-zinc-900 drop-shadow-sm dark:text-zinc-100 sm:text-base">
          {module.title}
        </span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center text-zinc-900 dark:text-zinc-100`}
          aria-hidden
        >
          <span
            className={`material-symbols-outlined leading-none block text-[22px] text-zinc-900 dark:text-zinc-100 transition-transform duration-200 sm:text-2xl ${isExpanded ? "rotate-180" : ""}`}
            style={{ transformOrigin: "center" }}
          >
            keyboard_arrow_down
          </span>
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
            <div className="pb-3 pt-0.5 pl-2 sm:pb-4 sm:pt-1">
              {module.subNav ? (
                <ul className="flex flex-col gap-1" role="list">
                  {module.subNav.map((item) => (
                    <li key={item.title}>
                      <span className="cursor-pointer text-xs font-medium uppercase tracking-wide text-zinc-700 drop-shadow-sm dark:text-zinc-300 sm:text-sm">
                        {item.title}
                      </span>
                      <ul className="mt-1 flex flex-col gap-1 pl-2 sm:pl-3" role="list">
                        {item.children.map((child) => (
                          <li 
                            key={child.label}
                            className="group/item -mx-2 rounded-lg px-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            {child.pageId && onSelectPage ? (
                              <div className="flex items-center gap-2 py-1.5 pr-1">
                                <button
                                  type="button"
                                  onClick={() => onSelectPage(child.pageId!)}
                                  className="min-w-0 flex-1 cursor-pointer text-left text-sm text-zinc-800 transition-colors group-hover/item:text-zinc-900 dark:text-zinc-200 dark:group-hover/item:text-zinc-100 sm:text-base"
                                >
                                  {child.label}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSharePageId(child.pageId!);
                                    setSharePageName(`${item.title} - ${child.label}`);
                                    setShareModalOpen(true);
                                    onCloseDock?.();
                                  }}
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 opacity-0 transition-all group-hover/item:opacity-100 hover:!bg-zinc-300 hover:!text-zinc-900 dark:text-zinc-500 dark:hover:!bg-zinc-700 dark:hover:!text-zinc-100"
                                  aria-label="Share link"
                                  title="Share link"
                                >
                                  <span 
                                    className="material-symbols-outlined text-[18px]"
                                    style={{ transform: "scaleX(-1)" }}
                                  >
                                    reply
                                  </span>
                                </button>
                              </div>
                            ) : (
                              <span className="block cursor-pointer py-1.5 text-sm text-zinc-800 dark:text-zinc-200 sm:text-base">
                                {child.label}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500 sm:text-sm">
                  Version {module.version}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        pageId={sharePageId}
        pageName={sharePageName}
      />
    </div>
  );
}
