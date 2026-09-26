import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Newsreader,
  Syne,
} from "next/font/google";
import { WaspProvider } from "@/context/wasp-context";
import { SiteChrome } from "@/components/wasp/site-chrome";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const news = Newsreader({ subsets: ["latin"], variable: "--font-news", display: "swap" });
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://example.com"),
  title: "WASP — Websites are too small a word",
  description:
    "Independent premium web design and development studio. Don't look at the work. Get inside it.",
  openGraph: {
    title: "WASP — Websites are too small a word",
    description: "15 working worlds. One studio. Don't look at the work. Get inside it.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "WASP", description: "15 working worlds. Get inside them." },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${news.variable} ${plex.variable} ${mono.variable}`}
    >
      <body>
        <WaspProvider>
          <a className="skip" href="#main">
            Skip to content
          </a>
          <SiteChrome>{children}</SiteChrome>
        </WaspProvider>
      </body>
    </html>
  );
}
