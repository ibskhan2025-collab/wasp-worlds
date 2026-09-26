import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Start — Make something",
  description: "A brief that is actually a brief. Six questions, one project.",
};

export default function StartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
