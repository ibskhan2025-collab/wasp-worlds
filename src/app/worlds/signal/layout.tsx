import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "SIGNAL — The interface notices you touching it",
  description: "A playable interception game. 45 seconds, three lives.",
};

export default function SignalLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
