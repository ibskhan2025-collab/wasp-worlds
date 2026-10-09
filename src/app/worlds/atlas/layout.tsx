import type { ReactNode } from "react";
import { UnderHood } from "@/components/worlds/under-hood";

export default function AtlasLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <UnderHood world="atlas" />
    </>
  );
}
