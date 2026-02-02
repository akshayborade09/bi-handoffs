"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { ModuleListItem } from "./ModuleListItem";
import { ThemeToggle } from "./ThemeToggle";
import { ResolvedComments } from "./ResolvedComments";
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
  mode: "creator" | "commenter" | "code";
  onModeChange: (mode: "creator" | "commenter" | "code") => void;
}

export function LeftDock({ isExpanded, onToggleExpand, onSelectPage, mode, onModeChange }: LeftDockProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showResolvedComments, setShowResolvedComments] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { data: session } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);

  // Detect OS on mount
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const modKey = isMac ? '⌘' : 'Ctrl';

  const handleToggleModule = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id));
  };

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Debug logging
  useEffect(() => {
    if (session) {
      console.log("Session data:", session);
      console.log("User image:", userImage);
    }
  }, [session, userImage]);

  // Reset image error when image changes
  useEffect(() => {
    setImageError(false);
  }, [userImage]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <>
      {/* Floating icon on top-left when dock is collapsed – click to slide dock in */}
      {!isExpanded && (
        <motion.button
          type="button"
          onClick={onToggleExpand}
          className="fixed left-3 top-3 z-[200] flex min-h-10 min-w-10 touch-manipulation cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-lg transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-950 dark:hover:text-white"
          aria-label="Expand dock"
          title="Expand dock (/)"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        >
          <span className="material-symbols-outlined leading-none select-none" aria-hidden>
            dock_to_right
          </span>
        </motion.button>
      )}

      {/* Dock panel – slides off-screen left when collapsed, in when expanded */}
      <motion.aside
        className="fixed left-3 top-3 bottom-3 z-20 flex flex-col overflow-hidden rounded-lg bg-white/80 dark:bg-black/60 border border-white/30 shadow-2xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/20"
        style={{ width: DOCK_WIDTH_EXPANDED }}
        animate={{ x: isExpanded ? 0 : -DOCK_SLIDE_OFFSET }}
        transition={dockTransition}
        aria-label={isExpanded ? "Modules dock expanded" : "Modules dock collapsed"}
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3">
            <header className="mb-4 sm:mb-5">
              <div className="flex min-h-11 items-center justify-between gap-2 sm:min-h-10 px-2">
                <button
                  type="button"
                  onClick={() => onSelectPage?.(null as any)}
                  className="text-lg font-semibold tracking-tight text-zinc-900 drop-shadow-sm dark:text-zinc-100 sm:text-xl transition-opacity hover:opacity-70"
                  aria-label="Go to home"
                >
                  BondsIndiaXDesign
                </button>
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="flex min-h-9 min-w-9 touch-manipulation shrink-0 items-center justify-center rounded-md text-zinc-900 transition-colors hover:bg-white/20 hover:text-zinc-900 dark:text-zinc-100 dark:hover:bg-white/10 dark:hover:text-zinc-100"
                  aria-label="Collapse dock"
                  title="Collapse dock (/)"
                >
                  <span className="material-symbols-outlined leading-none select-none" aria-hidden>
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
                    onCloseDock={() => onToggleExpand()}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Mode Toggle */}
          <div className="shrink-0 border-t border-white/40 p-3 dark:border-white/20">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-zinc-900 drop-shadow-sm dark:text-zinc-100">
                  Mode
                </span>
                <button
                  type="button"
                  onClick={() => setShowResolvedComments(true)}
                  className="flex items-center justify-center rounded-md p-1 text-zinc-900 transition-colors hover:bg-white/20 hover:text-zinc-900 dark:text-zinc-100 dark:hover:bg-white/10 dark:hover:text-zinc-100"
                  aria-label="View resolved comments"
                  title="View resolved comments"
                >
                  <span className="material-symbols-outlined leading-none text-[20px]">history</span>
                </button>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-white/40 bg-gray-100 p-1 backdrop-blur-sm dark:border-white/20 dark:bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => onModeChange("creator")}
                  className={`flex min-h-7 min-w-7 items-center justify-center rounded-md transition-colors ${
                    mode === "creator"
                      ? "bg-white/90 text-zinc-900 shadow-sm backdrop-blur-sm dark:bg-white/30 dark:text-zinc-100"
                      : "text-zinc-900 hover:bg-white/10 hover:text-zinc-900 dark:text-zinc-100 dark:hover:bg-white/10 dark:hover:text-zinc-100"
                  }`}
                  aria-label="Creator mode"
                  title="Creator mode (Shift + C)"
                >
                  <span className="material-symbols-outlined leading-none text-[20px]">edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange("commenter")}
                  className={`flex min-h-7 min-w-7 items-center justify-center rounded-md transition-colors ${
                    mode === "commenter"
                      ? "bg-white/90 text-zinc-900 shadow-sm backdrop-blur-sm dark:bg-white/30 dark:text-zinc-100"
                      : "text-zinc-900 hover:bg-white/10 hover:text-zinc-900 dark:text-zinc-100 dark:hover:bg-white/10 dark:hover:text-zinc-100"
                  }`}
                  aria-label="Commenter mode"
                  title="Commenter mode (Shift + C)"
                >
                  <span className="material-symbols-outlined leading-none text-[20px]">chat_add_on</span>
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange("code")}
                  className={`flex min-h-7 min-w-7 items-center justify-center rounded-md transition-colors ${
                    mode === "code"
                      ? "bg-white/90 text-zinc-900 shadow-sm backdrop-blur-sm dark:bg-white/30 dark:text-zinc-100"
                      : "text-zinc-900 hover:bg-white/10 hover:text-zinc-900 dark:text-zinc-100 dark:hover:bg-white/10 dark:hover:text-zinc-100"
                  }`}
                  aria-label="Code mode"
                  title="Code mode"
                >
                  <span className="material-symbols-outlined leading-none text-[20px]">code</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="relative shrink-0 flex items-center justify-between gap-3 border-t border-white/40 p-3 dark:border-white/20">
            <div ref={profileRef} className="relative min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex w-full min-w-0 items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/20 dark:hover:bg-white/10"
              >
                {userImage && !imageError ? (
                  <img
                    src={userImage}
                    alt={userName}
                    onError={() => setImageError(true)}
                    className="h-10 w-10 shrink-0 rounded-full border border-white/30 bg-white/50 object-cover dark:border-white/20 dark:bg-white/10"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/50 text-sm font-semibold text-zinc-900 dark:border-white/20 dark:bg-white/10 dark:text-zinc-100">
                    {userInitials}
                  </div>
                )}
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-zinc-900 drop-shadow-sm dark:text-zinc-100">
                    {userName}
                  </p>
                  <p className="truncate text-xs text-zinc-700 drop-shadow-sm dark:text-zinc-300">
                    {userEmail}
                  </p>
                </div>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg border border-white/30 bg-white/90 shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-zinc-900/90"
                  >
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-zinc-900 transition-colors hover:bg-white/50 dark:text-zinc-100 dark:hover:bg-white/20"
                    >
                      <span className="material-symbols-outlined leading-none text-[20px]" aria-hidden>
                        logout
                      </span>
                      <span>Sign out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </motion.aside>

      {/* Resolved Comments Modal */}
      <ResolvedComments
        isOpen={showResolvedComments}
        onClose={() => setShowResolvedComments(false)}
      />
    </>
  );
}
