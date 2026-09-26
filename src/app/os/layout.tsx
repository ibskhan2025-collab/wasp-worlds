import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "OS — The studio as software",
  description: "Pipeline, record, SOPs, content. The studio as a loop.",
};

export default function OsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
