import type { Metadata } from "next";
import { PulseFlyer } from "@/components/worlds/pulse-realities";

export const metadata: Metadata = {
  title: "PULSE flyer - wheatpaste",
  description: "Loud nights, cheap beer. A reality by WASP.",
};

export default function Page() { return <PulseFlyer />; }
