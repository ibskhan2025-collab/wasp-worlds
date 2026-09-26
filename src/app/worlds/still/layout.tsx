import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "STILL — Pictures first",
  description: "A photography world. Contact sheets, fullscreen, silence.",
};

export default function StillLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
