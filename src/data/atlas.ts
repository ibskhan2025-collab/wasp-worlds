import { media } from "@/lib/media";

export type Destination = {
  slug: string;
  name: string;
  region: "Coast" | "Hills" | "Town";
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  days: number;
  price: number;
  rating: number;
  image: string;
  blurb: string;
  stops: { name: string; note: string }[];
};

export const destinations: Destination[] = [
  {
    slug: "salt-road",
    name: "The Salt Road",
    region: "Coast",
    season: "Summer",
    days: 5,
    price: 1450,
    rating: 4.9,
    image: media.still.valley,
    blurb: "Five days down the coast: cliffs, a working salt pan, and a lake house with no television.",
    stops: [
      { name: "Cliff path", note: "Morning walk, 3 hours, ends at the lighthouse café." },
      { name: "Salt pans", note: "Afternoon with the harvesters. Bring sandals." },
      { name: "Lake house", note: "Two nights. Swim before breakfast." },
    ],
  },
  {
    slug: "old-town",
    name: "Old Town Week",
    region: "Town",
    season: "Autumn",
    days: 4,
    price: 980,
    rating: 4.7,
    image: media.still.city,
    blurb: "A town that rewards slow walkers: arcades, a print shop, three wine bars you will argue about.",
    stops: [
      { name: "Arcade quarter", note: "Covered streets, best in the rain." },
      { name: "Print shop", note: "Letterpress workshop, Thursday evenings." },
      { name: "Hill cellar", note: "Tasting with the maker, not the rep." },
    ],
  },
  {
    slug: "high-pass",
    name: "High Pass",
    region: "Hills",
    season: "Spring",
    days: 6,
    price: 1720,
    rating: 4.8,
    image: media.still.upward,
    blurb: "Spring in the hills: orchards in flower, a monastery guesthouse, one serious climb.",
    stops: [
      { name: "Orchard stay", note: "Two nights among blossom. Bees included." },
      { name: "Guesthouse", note: "Silence after nine. Breakfast at six." },
      { name: "The climb", note: "One day, 1400m, a guide who walks slowly on purpose." },
    ],
  },
  {
    slug: "winter-quay",
    name: "Winter Quay",
    region: "Coast",
    season: "Winter",
    days: 3,
    price: 760,
    rating: 4.6,
    image: media.still.street,
    blurb: "Off-season coast: storms watched from a glass-fronted room, oysters, early nights.",
    stops: [
      { name: "Storm room", note: "Floor-to-ceiling glass. Book the corner." },
      { name: "Oyster sheds", note: "Lunch standing up, as intended." },
      { name: "Night walk", note: "Lanterns provided. Stars if lucky." },
    ],
  },
];

export const atlasRegions = ["All", "Coast", "Hills", "Town"] as const;
export const atlasSeasons = ["All", "Spring", "Summer", "Autumn", "Winter"] as const;
