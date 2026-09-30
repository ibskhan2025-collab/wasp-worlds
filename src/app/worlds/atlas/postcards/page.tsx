import type { Metadata } from "next";
import { AtlasPostcards } from "@/components/worlds/atlas-realities";

export const metadata: Metadata = {
  title: "ATLAS postcards - wish you were here",
  description: "Every route as a postcard. A reality by WASP.",
};

export default function Page() { return <AtlasPostcards />; }
