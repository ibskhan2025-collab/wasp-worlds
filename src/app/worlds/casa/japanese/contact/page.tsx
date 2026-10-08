import type { Metadata } from "next";
import { CasaContactView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Japanese contact — reserve in silence",
  description: "Two seatings nightly. Write softly.",
};

export default function Page() { return <CasaContactView reality="japanese" />; }
