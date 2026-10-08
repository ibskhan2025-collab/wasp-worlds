import type { Metadata } from "next";
import { CasaContactView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Counter contact — claim a stool",
  description: "Address, hours and lines for the counter.",
};

export default function Page() { return <CasaContactView reality="counter" />; }
