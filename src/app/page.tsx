"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { LeftDock } from "@/components/LeftDock";
import { Header } from "@/components/Header";
import { PreSignUpV1 } from "@/components/pages/PreSignUpV1";
import { PostSignUpV1 } from "@/components/pages/PostSignUpV1";
import { CommentProvider, useComments } from "@/contexts/CommentContext";
import { CommentOverlay } from "@/components/CommentOverlay";

const DotScreenShader = dynamic(
  () =>
    import("@/components/ui/dot-shader-background").then((m) => m.DotScreenShader),
  { ssr: false }
);

function HomeContent() {
  const [isDockExpanded, setIsDockExpanded] = useState(() => {
    // Restore dock state from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isDockExpanded");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const { mode, setMode, setCurrentPageId } = useComments();
  const { resolvedTheme, setTheme } = useTheme();

  // Restore selected page from localStorage on mount
  useEffect(() => {
    const savedPageId = localStorage.getItem("selectedPageId");
    if (savedPageId) {
      setSelectedPageId(savedPageId);
    }
  }, []);

  // Keep dock open when on homepage
  useEffect(() => {
    if (!selectedPageId) {
      setIsDockExpanded(true);
    }
  }, [selectedPageId]);

  // Save selected page to localStorage whenever it changes
  useEffect(() => {
    if (selectedPageId) {
      localStorage.setItem("selectedPageId", selectedPageId);
    } else {
      localStorage.removeItem("selectedPageId");
    }
  }, [selectedPageId]);

  // Save dock state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isDockExpanded", JSON.stringify(isDockExpanded));
  }, [isDockExpanded]);

  // Update current page ID in context when it changes
  useEffect(() => {
    setCurrentPageId(selectedPageId || "home");
  }, [selectedPageId, setCurrentPageId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" key to toggle dock
      if (e.key === "/" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Ignore if typing in an input or textarea
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        setIsDockExpanded((prev: boolean) => !prev);
      }
      
      // "Shift + C" to toggle mode
      if (e.key === "C" && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Ignore if typing in an input or textarea
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        setMode(mode === "creator" ? "commenter" : "creator");
      }
      
      // "Shift + D" to toggle theme
      if (e.key === "D" && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Ignore if typing in an input or textarea
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, setMode, resolvedTheme, setTheme]);

  return (
    <div className="relative flex min-h-screen min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-zinc-950 md:min-h-screen">
      {/* Navigation Header - only on homepage */}
      {!selectedPageId && <Header />}
      
      {/* Dot shader background – does not move when dock opens/closes; same in light and dark */}
      {!selectedPageId && (
        <div
          className="fixed inset-0 z-0 cursor-default"
          onClick={() => isDockExpanded && setIsDockExpanded(false)}
          aria-hidden
        >
          <DotScreenShader />
        </div>
      )}
      <LeftDock
        isExpanded={isDockExpanded}
        onToggleExpand={() => setIsDockExpanded((prev: boolean) => !prev)}
        onSelectPage={(pageId) => {
          setSelectedPageId(pageId);
          setIsDockExpanded(false);
        }}
        mode={mode}
        onModeChange={setMode}
      />
      
      <motion.main
        className={`relative z-10 flex min-h-0 flex-1 flex-col overflow-auto ${!selectedPageId ? "pointer-events-none" : ""}`}
        onClick={selectedPageId && mode !== "commenter" ? () => isDockExpanded && setIsDockExpanded(false) : undefined}
        role="main"
        tabIndex={-1}
      >
        {/* Comment overlay - only visible in commenter mode */}
        <CommentOverlay
          isActive={mode === "commenter"}
          pageId={selectedPageId || "home"}
          isDockExpanded={isDockExpanded}
          onCloseDock={() => setIsDockExpanded(false)}
        />
        
        {selectedPageId === "pre-signup-v1" && <PreSignUpV1 />}
        {selectedPageId === "post-signup-v1" && <PostSignUpV1 />}
        {!selectedPageId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative min-h-dvh min-h-full flex-1 pointer-events-none"
          >
            <div className="absolute inset-0 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
              <h1 className="text-center text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                Bonds India x Design
              </h1>
            </div>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}

export default function Home() {
  return (
    <CommentProvider>
      <HomeContent />
    </CommentProvider>
  );
}
