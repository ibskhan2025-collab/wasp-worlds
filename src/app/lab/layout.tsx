import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "LAB — Experiments that may become products",
  description: "WASP's workshop: type, scale and space, tuned live.",
};

export default function LabLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
