"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface LegalPageLayoutProps {
  children: ReactNode;
}

export function LegalPageLayout({ children }: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen min-h-dvh bg-zinc-50 dark:bg-zinc-950 md:min-h-screen">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 sm:px-6 md:px-8 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300 sm:text-xl"
        >
          BondsIndiaXDesign
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Home
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Terms of Service
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-[968px] px-4 pb-16 pt-24 sm:px-6 md:px-8">
        {children}
      </main>
    </div>
  );
}
