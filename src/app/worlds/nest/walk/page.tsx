import type { Metadata } from "next";
import { NestWalk } from "@/components/worlds/nest-walk";

export const metadata: Metadata = {
  title: "NEST walk — in the room",
  description: "Drag to orbit. Same rooms, one dimension up. A reality by WASP.",
};

export default function Page() { return <NestWalk />; }
