import type { Metadata } from "next";
import { NestVolume } from "@/components/worlds/nest-volume";

export const metadata: Metadata = {
  title: "NEST volume - real geometry",
  description: "Four rooms as WebGL solids. A reality by WASP.",
};

export default function Page() { return <NestVolume />; }
