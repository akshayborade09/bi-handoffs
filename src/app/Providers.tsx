"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../../tamagui.config";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TamaguiProvider config={tamaguiConfig} disableRootThemeClass>
        {children}
      </TamaguiProvider>
    </ThemeProvider>
  );
}
