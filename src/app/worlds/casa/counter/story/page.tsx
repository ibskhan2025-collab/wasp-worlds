import type { Metadata } from "next";
import { CasaStoryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Counter story — eight stools at the pass",
  description: "The best seats in the valley are stools.",
};

export default function Page() { return <CasaStoryView reality="counter" />; }
