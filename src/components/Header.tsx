"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="pointer-events-auto fixed right-0 top-0 z-50 flex items-center gap-6 rounded-bl-lg sm:gap-8 sm:p-6">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
      >
        Home
      </Link>
      <Link
        href="/privacy-policy"
        className="text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
      >
        Privacy Policy
      </Link>
      <Link
        href="/terms-of-service"
        className="text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
      >
        Terms of Service
      </Link>
    </header>
  );
}
