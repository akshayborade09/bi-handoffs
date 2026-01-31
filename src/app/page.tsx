"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { LeftDock, DOCK_WIDTH_EXPANDED, DOCK_INSET } from "@/components/LeftDock";
import { PreSignUpV1 } from "@/components/pages/PreSignUpV1";
import { PostSignUpV1 } from "@/components/pages/PostSignUpV1";

const DotScreenShader = dynamic(
  () =>
    import("@/components/ui/dot-shader-background").then((m) => m.DotScreenShader),
  { ssr: false }
);

export default function Home() {
  const [isDockExpanded, setIsDockExpanded] = useState(true);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const mainMarginLeft = isDockExpanded ? DOCK_INSET + DOCK_WIDTH_EXPANDED : 0;

  return (
    <div className="relative flex min-h-screen min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-zinc-950 md:min-h-screen">
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
        onToggleExpand={() => setIsDockExpanded((prev) => !prev)}
        onSelectPage={(pageId) => {
          setSelectedPageId(pageId);
          setIsDockExpanded(false);
        }}
      />
      <motion.main
        className={`relative z-10 flex min-h-0 flex-1 flex-col overflow-auto ${!selectedPageId ? "pointer-events-none" : ""}`}
        animate={{ marginLeft: mainMarginLeft }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        onClick={selectedPageId ? () => isDockExpanded && setIsDockExpanded(false) : undefined}
        role="main"
        tabIndex={-1}
      >
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
