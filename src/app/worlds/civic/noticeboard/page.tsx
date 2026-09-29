import type { Metadata } from "next";
import { CivicNoticeboard } from "@/components/worlds/civic-realities";

export const metadata: Metadata = {
  title: "CIVIC notices - pinned up",
  description: "Statutory gravity, zero wasted words. A reality by WASP.",
};

export default function Page() { return <CivicNoticeboard />; }
