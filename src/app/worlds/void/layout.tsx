import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "VOID — No category. No reason. Good.",
  description: "A generative experiment by WASP. Move, type, hold still.",
};

export default function VoidLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
