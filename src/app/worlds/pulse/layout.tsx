import type { ReactNode } from "react";
import { UnderHood } from "@/components/worlds/under-hood";

export default function PulseLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <UnderHood world="pulse" />
    </>
  );
}
