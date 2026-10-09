import type { ReactNode } from "react";
import { UnderHood } from "@/components/worlds/under-hood";

export default function CivicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <UnderHood world="civic" />
    </>
  );
}
