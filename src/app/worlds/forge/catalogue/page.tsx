import type { Metadata } from "next";
import { ForgeCatalogue } from "@/components/worlds/forge-realities";

export const metadata: Metadata = {
  title: "FORGE catalogue - every part in one scroll",
  description: "Every part in one scroll. A reality by WASP.",
};

export default function Page() { return <ForgeCatalogue />; }
