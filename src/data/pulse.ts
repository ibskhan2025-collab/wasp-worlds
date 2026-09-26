import { media } from "@/lib/media";

export type Release = {
  slug: string;
  title: string;
  artist: string;
  date: string; // ISO
  cover: string;
  note: string;
  tracks: { name: string; secs: number }[];
};

export const releases: Release[] = [
  {
    slug: "glass-weather",
    title: "Glass Weather",
    artist: "Vela",
    date: "2026-11-14",
    cover: media.motion.red,
    note: "Nine tracks about storms you can dance in. Recorded in a lighthouse, mixed in a basement.",
    tracks: [
      { name: "Signal", secs: 214 },
      { name: "Glass Weather", secs: 268 },
      { name: "Low Pressure", secs: 191 },
      { name: "Harbour Lights", secs: 243 },
      { name: "Static Bloom", secs: 176 },
      { name: "Vela", secs: 302 },
      { name: "Rain Check", secs: 205 },
      { name: "Meridian", secs: 229 },
      { name: "Clearing", secs: 318 },
    ],
  },
  {
    slug: "paper-tigers",
    title: "Paper Tigers",
    artist: "Copper Line",
    date: "2026-04-02",
    cover: media.motion.fire,
    note: "Out now. Five songs, no skips, one harmonica solo the label begged them to cut.",
    tracks: [
      { name: "Paper Tigers", secs: 198 },
      { name: "Copper Line", secs: 224 },
      { name: "Floodplain", secs: 251 },
      { name: "Second Parade", secs: 183 },
      { name: "Tigers (reprise)", secs: 142 },
    ],
  },
];

export type Show = { id: string; city: string; venue: string; date: string; status: "Tickets" | "Low" | "Sold out" };

export const shows: Show[] = [
  { id: "s1", city: "Lisbon", venue: "Capitólio", date: "2026-10-03", status: "Tickets" },
  { id: "s2", city: "Barcelona", venue: "Razzmatazz", date: "2026-10-05", status: "Low" },
  { id: "s3", city: "Lyon", venue: "Transbordeur", date: "2026-10-07", status: "Tickets" },
  { id: "s4", city: "Berlin", venue: "Astra", date: "2026-10-10", status: "Sold out" },
  { id: "s5", city: "Amsterdam", venue: "Paradiso", date: "2026-10-12", status: "Tickets" },
];

export function fmtSecs(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
