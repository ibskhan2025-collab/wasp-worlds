import type { Metadata } from "next";
import type { ReactNode } from "react";
import { UnderHood } from "@/components/worlds/under-hood";

export const metadata: Metadata = {
  title: "MOTION — Type, image, sound and time as one material",
  description: "A scroll-driven campaign by WASP. Don't watch the film — scroll it.",
};

export default function MotionLayout({ children }: { children: ReactNode }) {
  return <>{children}
      <UnderHood world="motion" /></>;
}
