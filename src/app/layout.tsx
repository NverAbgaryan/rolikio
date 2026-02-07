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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rolik.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "rolik.io — Professional Reels & Photo Editing for Businesses",
    template: "%s | rolik.io",
  },
  description:
    "We edit your content so you don\u2019t have to. Professional reels, photo editing, and content suggestions for small businesses. Subscribe from $299/mo or order one-off.",
  keywords: [
    "video editing service",
    "reel editing service",
    "content editing for small business",
    "instagram reels editing",
    "tiktok video editing",
    "photo editing service",
    "social media content editing",
    "content editing subscription",
    "done for you reels",
    "professional video editing",
  ],
  authors: [{ name: "rolik.io" }],
  creator: "rolik.io",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "rolik.io",
    title: "rolik.io — Professional Reels & Photo Editing for Businesses",
    description:
      "We edit your content so you don\u2019t have to. Professional reels, photo editing, and content suggestions. Subscribe or order one-off.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "rolik.io — Content Editing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "rolik.io — Professional Reels & Photo Editing for Businesses",
    description:
      "We edit your content so you don\u2019t have to. Subscribe from $299/mo or order a single piece.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
