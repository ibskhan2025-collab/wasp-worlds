import type { Metadata } from "next";
import { AtlasField } from "@/components/worlds/atlas-realities";

export const metadata: Metadata = {
  title: "ATLAS field notes - surveyor copy",
  description: "Pencil, stamps and tape. A reality by WASP.",
};

export default function Page() { return <AtlasField />; }
