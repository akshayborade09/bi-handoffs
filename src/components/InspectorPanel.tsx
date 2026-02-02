"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InspectorPanelProps {
  isVisible: boolean;
  onClose?: () => void;
}

export function InspectorPanel({ isVisible, onClose }: InspectorPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [dockPosition, setDockPosition] = useState<"left" | "right">("right");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  if (!isVisible) return null;

  const handleDockChange = (position: "left" | "right") => {
    setDockPosition(position);
    setIsMenuOpen(false);
  };

  const panelWidth = 400;
  const headerHeight = 56;

  return (
    <motion.div
      className={`fixed bottom-3 z-[150] flex flex-col rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 ${
        dockPosition === "left" ? "left-3" : "right-3"
      }`}
      style={{ width: panelWidth }}
      initial={{ y: "100%", opacity: 0 }}
      animate={{
        y: isMinimized ? `calc(100% - ${headerHeight}px)` : 0,
        opacity: 1,
      }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* Header */}
      <div
        className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800"
        style={{ height: headerHeight }}
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Inspector</h2>
        
        <div className="flex items-center gap-1">
          {/* 3 Dots Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Inspector menu"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <button
                    type="button"
                    onClick={() => handleDockChange("left")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <span className="material-symbols-outlined text-[20px]">dock_to_left</span>
                    <span>Dock to Left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDockChange("right")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <span className="material-symbols-outlined text-[20px]">dock_to_right</span>
                    <span>Dock to Right</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Minimize/Maximize Button */}
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label={isMinimized ? "Maximize inspector" : "Minimize inspector"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMinimized ? "expand_content" : "collapse_content"}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Assets Section */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Assets</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex shrink-0 flex-col gap-2">
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">IMG</span>
                  </div>
                  <select className="w-24 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                    <option>SVG</option>
                    <option>1x PNG</option>
                    <option>1.5x PNG</option>
                    <option>2x PNG</option>
                    <option>3x PNG</option>
                    <option>All-x PNG</option>
                    <option>JPG</option>
                    <option>PDF</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Code Snippet Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Code Snippet</h3>
              <select className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                <option>React Native</option>
                <option>React</option>
                <option>Vue</option>
                <option>HTML</option>
                <option>Swift</option>
                <option>Android</option>
              </select>
            </div>
            <div className="h-64 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
