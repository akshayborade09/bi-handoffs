import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Bonds India Handoffs",
  description: "Bonds India Handoffs app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body className="min-h-screen min-h-dvh bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100 md:min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
