"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { LeftDock } from "@/components/LeftDock";
import { InspectorPanel } from "@/components/InspectorPanel";
import { PreSignUpV1 } from "@/components/pages/PreSignUpV1";
import { PreSignUpV2 } from "@/components/pages/PreSignUpV2";
import { PostSignUpV1 } from "@/components/pages/PostSignUpV1";
import { CommentProvider, useComments } from "@/contexts/CommentContext";
import { CommentOverlay } from "@/components/CommentOverlay";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";
import { modules } from "@/data/modules";

// Map of valid pageIds to their components
const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  "pre-signup-v1": PreSignUpV1,
  "pre-signup-v2": PreSignUpV2,
  "post-signup-v1": PostSignUpV1,
};

// Get all valid pageIds from modules
const VALID_PAGE_IDS = modules.flatMap(
  (module) =>
    module.subNav?.flatMap((subNav) =>
      subNav.children.filter((child) => child.pageId).map((child) => child.pageId!)
    ) || []
);

function PageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = params.pageId as string;
  const isShareView = searchParams.get("share") === "true";
  const { data: session, status } = useSession();
  const [isDockExpanded, setIsDockExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isDockExpanded");
      return saved !== null ? JSON.parse(saved) : false; // Default to collapsed on page view
    }
    return false;
  });
  const { mode, setMode, setCurrentPageId } = useComments();
  const { resolvedTheme, setTheme } = useTheme();

  // Validate pageId - redirect to home if invalid
  useEffect(() => {
    if (!VALID_PAGE_IDS.includes(pageId)) {
      router.replace("/");
    }
  }, [pageId, router]);

  // Update current page ID in context
  useEffect(() => {
    setCurrentPageId(pageId);
  }, [pageId, setCurrentPageId]);

  // Save dock state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isDockExpanded", JSON.stringify(isDockExpanded));
  }, [isDockExpanded]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" key to toggle dock
      if (e.key === "/" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        setIsDockExpanded((prev: boolean) => !prev);
      }

      // "Shift + C" to cycle through modes
      if (e.key === "C" && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        setMode(mode === "creator" ? "commenter" : mode === "commenter" ? "code" : "creator");
      }

      // "Shift + D" to toggle theme
      if (e.key === "D" && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }

      // "Shift + I" to toggle Inspector (code mode)
      if (e.key === "I" && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        setMode(mode === "code" ? "creator" : "code");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, setMode, resolvedTheme, setTheme]);

  // Show loading spinner while checking auth (skip auth check in share view)
  if (!isShareView && status === "loading") {
    return (
      <div className="flex min-h-screen min-h-dvh items-center justify-center bg-zinc-50 dark:bg-zinc-950 md:min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  // Redirect to home if not authenticated (skip in share view)
  if (!isShareView && status === "unauthenticated") {
    router.replace("/");
    return null;
  }

  // Get the component for this page
  const PageComponent = PAGE_COMPONENTS[pageId];

  if (!PageComponent) {
    return null; // Will redirect via useEffect above
  }

  // Share view - just show the page without interface
  if (isShareView) {
    return (
      <div className="relative flex min-h-screen min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-zinc-950 md:min-h-screen">
        <motion.main
          className="relative z-10 flex min-h-0 flex-1 flex-col overflow-auto"
          role="main"
          tabIndex={-1}
        >
          <PageComponent />
        </motion.main>
        
        {/* Floating theme toggle for shared view */}
        <FloatingThemeToggle />
      </div>
    );
  }

  // Regular view with dock and comments
  return (
    <div className="relative flex min-h-screen min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-zinc-950 md:min-h-screen">
      {/* Only show dock when not in code mode */}
      {mode !== "code" && (
        <LeftDock
          isExpanded={isDockExpanded}
          onToggleExpand={() => setIsDockExpanded((prev: boolean) => !prev)}
          onSelectPage={(selectedPageId) => {
            if (selectedPageId) {
              router.push(`/${selectedPageId}`);
            } else {
              router.push("/");
            }
            setIsDockExpanded(false);
          }}
          mode={mode}
          onModeChange={setMode}
        />
      )}

      {/* Inspector panel - only visible in code mode */}
      <InspectorPanel isVisible={mode === "code"} />

      <motion.main
        className="relative z-10 flex min-h-0 flex-1 flex-col overflow-auto"
        onClick={mode !== "commenter" && mode !== "code" ? () => isDockExpanded && setIsDockExpanded(false) : undefined}
        role="main"
        tabIndex={-1}
      >
        {/* Comment overlay - only visible in commenter mode */}
        <CommentOverlay
          isActive={mode === "commenter"}
          pageId={pageId}
          isDockExpanded={isDockExpanded}
          onCloseDock={() => setIsDockExpanded(false)}
        />

        <PageComponent />
      </motion.main>
    </div>
  );
}

export default function Page() {
  return (
    <CommentProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen min-h-dvh items-center justify-center bg-zinc-50 dark:bg-zinc-950 md:min-h-screen">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
          </div>
        }
      >
        <PageContent />
      </Suspense>
    </CommentProvider>
  );
}
