import type { Metadata } from "next";
import { CasaReservationsView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Counter reservations — take a stool",
  description: "Book one of eight seats at the pass.",
};

export default function Page() { return <CasaReservationsView reality="counter" />; }
