import type { Metadata } from "next";
import { AtlasTimetable } from "@/components/worlds/atlas-realities";

export const metadata: Metadata = {
  title: "ATLAS timetable - departures",
  description: "Every route priced, dated, and boarding. A reality by WASP.",
};

export default function Page() { return <AtlasTimetable />; }
