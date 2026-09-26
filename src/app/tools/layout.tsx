import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tools — Value before the invoice",
  description: "Audits, estimators, checklists. Useful before you hire anyone.",
};

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
