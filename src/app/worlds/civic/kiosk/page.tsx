import type { Metadata } from "next";
import { CivicKiosk } from "@/components/worlds/civic-realities";

export const metadata: Metadata = {
  title: "CIVIC kiosk - public terminal",
  description: "Touch to begin. A reality by WASP.",
};

export default function Page() { return <CivicKiosk />; }
