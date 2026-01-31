"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LeftDock, DOCK_WIDTH_EXPANDED, DOCK_INSET } from "@/components/LeftDock";
import { PreSignUpV1 } from "@/components/pages/PreSignUpV1";
import { PostSignUpV1 } from "@/components/pages/PostSignUpV1";

export default function Home() {
  const [isDockExpanded, setIsDockExpanded] = useState(true);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const mainMarginLeft = isDockExpanded ? DOCK_INSET + DOCK_WIDTH_EXPANDED : 0;

  return (
    <div className="relative flex min-h-screen min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-zinc-950 md:min-h-screen">
      <LeftDock
        isExpanded={isDockExpanded}
        onToggleExpand={() => setIsDockExpanded((prev) => !prev)}
        onSelectPage={(pageId) => {
          setSelectedPageId(pageId);
          setIsDockExpanded(false);
        }}
      />
      <motion.main
        className="relative flex min-h-0 flex-1 flex-col overflow-auto"
        animate={{ marginLeft: mainMarginLeft }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      >
        {selectedPageId === "pre-signup-v1" && <PreSignUpV1 />}
        {selectedPageId === "post-signup-v1" && <PostSignUpV1 />}
        {!selectedPageId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
          >
            <h1 className="text-center text-7xl font-light leading-tight tracking-tight text-zinc-900 dark:text-zinc-100">
              Bonds India <br /> x <br /> Product Design
            </h1>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
