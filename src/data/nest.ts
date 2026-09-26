import { media } from "@/lib/media";

export type NestMaterial = { id: string; name: string; hex: string; note: string };

export const nestMaterials: NestMaterial[] = [
  { id: "plaster", name: "Lime plaster", hex: "#efeae2", note: "Soft, chalky, forgiving of old walls." },
  { id: "oak", name: "Oiled oak", hex: "#a97a3f", note: "Darkens where hands land. That is the point." },
  { id: "steel", name: "Brushed steel", hex: "#9aa0a3", note: "For kitchens that actually cook." },
  { id: "moss", name: "Moss wool", hex: "#7a8b6f", note: "Curtains and cushions. Quietens the room." },
];

export type NestRoom = {
  slug: string;
  name: string;
  size: string;
  light: string;
  image: string;
  desc: string;
  // position on the 400x300 plan
  rect: { x: number; y: number; w: number; h: number };
};

export const nestRooms: NestRoom[] = [
  {
    slug: "reading-corner",
    name: "Reading corner",
    size: "3.2 × 2.8 m",
    light: "West, 4pm",
    image: media.objects.room,
    desc: "Deep seat, honest arms, a lamp that draws its own outline. For long pages.",
    rect: { x: 20, y: 20, w: 150, h: 120 },
  },
  {
    slug: "oak-table",
    name: "Oak table room",
    size: "4.6 × 3.4 m",
    light: "South, all day",
    image: media.objects.vases,
    desc: "One table, six chairs, nothing that wobbles. Dinners that end after midnight.",
    rect: { x: 180, y: 20, w: 200, h: 120 },
  },
  {
    slug: "linen-bedroom",
    name: "Linen bedroom",
    size: "3.8 × 3.0 m",
    light: "East, morning",
    image: media.objects.bedroom,
    desc: "Heavy linen, low bed, a window placed for waking up slowly.",
    rect: { x: 20, y: 150, w: 170, h: 130 },
  },
  {
    slug: "maker-niche",
    name: "Maker niche",
    size: "2.4 × 2.0 m",
    light: "North, even",
    image: media.objects.studio,
    desc: "A bench, a stool, daylight that never flatters and never lies.",
    rect: { x: 200, y: 150, w: 180, h: 130 },
  },
];
