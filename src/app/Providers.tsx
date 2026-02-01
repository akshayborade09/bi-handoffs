"use client";

import { ReactNode } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "./ThemeProvider";
import { LoginModal } from "@/components/LoginModal";

function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginModal />;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthGate>{children}</AuthGate>
      </ThemeProvider>
    </SessionProvider>
  );
}
