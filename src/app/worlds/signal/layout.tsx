import type { Metadata } from "next";
import type { ReactNode } from "react";
import { UnderHood } from "@/components/worlds/under-hood";

export const metadata: Metadata = {
  title: "SIGNAL — The interface notices you touching it",
  description: "A playable interception game by WASP. 45 seconds, three lives.",
};

export default function SignalLayout({ children }: { children: ReactNode }) {
  return <>{children}
      <UnderHood world="signal" /></>;
}
