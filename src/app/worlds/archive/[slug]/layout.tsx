import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Article — ARCHIVE",
  description: "An essay from THE ARCHIVE, a demo publication by WASP.",
};

export default function ArticleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
