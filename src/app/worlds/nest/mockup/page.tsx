import type { Metadata } from "next";
import { NestMockup } from "@/components/worlds/nest-realities";

export const metadata: Metadata = {
  title: "NEST mockup - cardboard study",
  description: "Tape, not glue. A reality by WASP.",
};

export default function Page() { return <NestMockup />; }
