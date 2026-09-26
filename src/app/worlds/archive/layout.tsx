import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ARCHIVE — A publication, not a blog skin",
  description: "Essays on building places instead of pages, from WASP. Save them, read them.",
};

export default function ArchiveLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
