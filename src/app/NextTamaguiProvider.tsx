"use client";

import { ReactNode } from "react";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../../tamagui.config";

export function NextTamaguiProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useRootTheme();

  return (
    <NextThemeProvider
      skipNextHead
      value={{ dark: "dark", light: "light" }}
      onChangeTheme={(next) => {
        setTheme(next as typeof theme);
      }}
    >
      <TamaguiProvider
        config={tamaguiConfig}
        disableRootThemeClass
        defaultTheme={theme}
      >
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  );
}
