import { media } from "@/lib/media";

export type ForgeProduct = {
  slug: string;
  name: string;
  family: "Fastening" | "Bearing" | "Enclosure";
  load: number; // kN
  tolerance: string;
  finishes: string[];
  lead: string;
  image: string;
  desc: string;
  dims: { w: number; h: number; bore: number };
};

export const forgeProducts: ForgeProduct[] = [
  {
    slug: "hex-bolt-m12",
    name: "Hex bolt M12",
    family: "Fastening",
    load: 38,
    tolerance: "±0.05mm",
    finishes: ["Zinc", "Black oxide", "Hot-dip"],
    lead: "6 days",
    image: media.objects.studio,
    desc: "The bolt that holds the frame together. Rolled threads, marked heads, certs in the box.",
    dims: { w: 120, h: 40, bore: 12 },
  },
  {
    slug: "flange-bearing-40",
    name: "Flange bearing 40",
    family: "Bearing",
    load: 22,
    tolerance: "±0.02mm",
    finishes: ["Steel", "Stainless"],
    lead: "11 days",
    image: media.objects.lamp,
    desc: "A two-bolt flange unit for shafts that never stop. Sealed, greased, quiet.",
    dims: { w: 140, h: 100, bore: 40 },
  },
  {
    slug: "control-box-ip65",
    name: "Control box IP65",
    family: "Enclosure",
    load: 4,
    tolerance: "±0.2mm",
    finishes: ["Powder grey", "Stainless"],
    lead: "9 days",
    image: media.objects.shelves,
    desc: "Dust-tight, hose-proof, with a door that closes like a car. Glands included.",
    dims: { w: 160, h: 120, bore: 0 },
  },
  {
    slug: "anchor-stud-m16",
    name: "Anchor stud M16",
    family: "Fastening",
    load: 61,
    tolerance: "±0.08mm",
    finishes: ["Hot-dip", "Zinc"],
    lead: "7 days",
    image: media.objects.hands,
    desc: "For concrete you trust and concrete you don't. Proof-tested, batch-marked.",
    dims: { w: 160, h: 30, bore: 16 },
  },
  {
    slug: "pillow-block-30",
    name: "Pillow block 30",
    family: "Bearing",
    load: 18,
    tolerance: "±0.02mm",
    finishes: ["Cast iron", "Stainless"],
    lead: "8 days",
    image: media.objects.bowl,
    desc: "The honest workhorse of the line. Swap it in minutes, not shifts.",
    dims: { w: 120, h: 80, bore: 30 },
  },
];

export const forgeFamilies = ["All", "Fastening", "Bearing", "Enclosure"] as const;
