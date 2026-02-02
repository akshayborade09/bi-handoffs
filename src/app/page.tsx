"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LeftDock } from "@/components/LeftDock";
import { InspectorPanel } from "@/components/InspectorPanel";
import { Header } from "@/components/Header";
import { CommentProvider, useComments } from "@/contexts/CommentContext";

const DotScreenShader = dynamic(
  () =>
    import("@/components/ui/dot-shader-background").then((m) => m.DotScreenShader),
  { ssr: false }
);

function HomeContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isDockExpanded, setIsDockExpanded] = useState(() => {
    // Restore dock state from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isDockExpanded");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const { mode, setMode, setCurrentPageId } = useComments();
  const { resolvedTheme, setTheme } = useTheme();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Set current page to home
  useEffect(() => {
    setCurrentPageId("home");
  }, [setCurrentPageId]);

  // Keep dock open when on homepage (only if authenticated)
  useEffect(() => {
    if (status === "authenticated") {
      setIsDockExpanded(true);
    }
  }, [status]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsSigningIn(false);
    }
  };

  // Save dock state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isDockExpanded", JSON.stringify(isDockExpanded));
  }, [isDockExpanded]);

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
      
      // "Shift + C" to toggle between creator and commenter modes
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

      // "Shift + I" to toggle Inspector (code mode)
      if (e.key === "I" && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Ignore if typing in an input or textarea
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

  // Show loading spinner while checking auth
  if (status === "loading") {
    return (
      <div className="flex min-h-screen min-h-dvh items-center justify-center bg-zinc-50 dark:bg-zinc-950 md:min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  // Show login screen when not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="relative flex min-h-screen min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-zinc-950 md:min-h-screen">
        {/* Navigation Header */}
        <Header />
        
        {/* Dot shader background */}
        <div className="fixed inset-0 z-0" aria-hidden>
          <DotScreenShader />
        </div>
        
        {/* Login content */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md text-center"
          >
            <h1 className="mb-12 text-center text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              BondsIndia x Design
            </h1>
            
            {/* Login card */}
            <div className="rounded-2xl border border-gray-100 bg-white/60 p-8 backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/40 sm:p-10">
              <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
                Sign in to access design handoffs
              </p>
              
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-6 py-3.5 text-base font-medium text-zinc-900 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                {isSigningIn ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                      <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
              
              {/* Footer note */}
              <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Authenticated user - show main app with dock
  return (
    <div className="relative flex min-h-screen min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-zinc-950 md:min-h-screen">
      {/* Navigation Header */}
      <Header />
      
      {/* Dot shader background – does not move when dock opens/closes; same in light and dark */}
      <div
        className="fixed inset-0 z-0 cursor-default"
        onClick={() => isDockExpanded && mode !== "code" && setIsDockExpanded(false)}
        aria-hidden
      >
        <DotScreenShader />
      </div>
      
      {/* Dock - can expand even in code mode, Inspector will auto-minimize and move */}
      <LeftDock
        isExpanded={isDockExpanded}
        onToggleExpand={() => setIsDockExpanded((prev: boolean) => !prev)}
        onSelectPage={(pageId) => {
          if (pageId) {
            router.push(`/${pageId}`);
          }
          setIsDockExpanded(false);
        }}
        mode={mode}
        onModeChange={setMode}
      />

      {/* Inspector panel - only visible in code mode */}
      <InspectorPanel isVisible={mode === "code"} isDockExpanded={isDockExpanded} />
      
      <motion.main
        className="relative z-10 flex min-h-0 flex-1 flex-col overflow-auto pointer-events-none"
        role="main"
        tabIndex={-1}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative min-h-dvh min-h-full flex-1 pointer-events-none"
        >
          <div className="absolute inset-0 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
            <h1 className="text-center text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
              BondsIndia x Design
            </h1>
          </div>
        </motion.div>
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
