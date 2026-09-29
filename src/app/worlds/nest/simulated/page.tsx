import type { Metadata } from "next";
import { NestSimulated } from "@/components/worlds/nest-realities";

export const metadata: Metadata = {
  title: "NEST telemetry - live sim",
  description: "House sensors, all nominal. A reality by WASP.",
};

export default function Page() { return <NestSimulated />; }
