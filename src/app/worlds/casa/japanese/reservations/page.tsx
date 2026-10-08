import type { Metadata } from "next";
import { CasaReservationsView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Japanese reservations — 予約",
  description: "Book by meditation. Two seatings nightly.",
};

export default function Page() { return <CasaReservationsView reality="japanese" />; }
