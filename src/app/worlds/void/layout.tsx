import type { Metadata } from "next";
import type { ReactNode } from "react";
import { UnderHood } from "@/components/worlds/under-hood";

export const metadata: Metadata = {
  title: "VOID — No category. No reason. Good.",
  description: "A generative experiment by WASP. Move, type, hold still.",
};

export default function VoidLayout({ children }: { children: ReactNode }) {
  return <>{children}
      <UnderHood world="void" /></>;
}
