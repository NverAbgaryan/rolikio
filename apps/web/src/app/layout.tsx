import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "rolik.io — Reels, done for you.",
  description:
    "Upload your clips, share a reference, and we’ll deliver a post‑ready reel in 48–72h.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100`}
      >
        {children}
      </body>
    </html>
  );
}
