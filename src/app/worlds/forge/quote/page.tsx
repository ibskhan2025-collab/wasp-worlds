import type { Metadata } from "next";
import { QuoteBuilder } from "./client";

export const metadata: Metadata = {
  title: "Request a quote — FORGE",
  description: "Three questions, one human reply. Pick parts, quantities, send.",
};

export default function QuotePage() {
  return <QuoteBuilder />;
}
