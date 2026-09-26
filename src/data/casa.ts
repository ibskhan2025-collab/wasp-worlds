import { media } from "@/lib/media";

export const casa = {
  name: "Casa Valle",
  tag: "Restaurant",
  city: "Ojai",
  address: "14 Canyon Road, Ojai, California",
  phone: "+1 805 555 0142",
  email: "table@casavalle.study",
  hours: [
    { day: "Tuesday – Thursday", time: "17:30 – 22:00" },
    { day: "Friday – Saturday", time: "17:00 – 23:00" },
    { day: "Sunday", time: "16:00 – 21:00" },
    { day: "Monday", time: "Closed" },
  ],
  times: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
};

export type Dish = {
  id: string;
  name: string;
  category: "Fire" | "Garden" | "Sea" | "Sweet" | "Wine";
  price: number;
  desc: string;
  note: string;
  image: string;
  dietary: string[];
};

export const dishes: Dish[] = [
  {
    id: "ember-leek",
    name: "Ember leek",
    category: "Garden",
    price: 18,
    desc: "Charred allium, brown butter, smoked almond, lemon thyme.",
    note: "The first thing you should eat.",
    image: media.casa.dish7,
    dietary: ["vegetarian"],
  },
  {
    id: "stone-salad",
    name: "Valley greens",
    category: "Garden",
    price: 16,
    desc: "Bitter leaves, warm vinaigrette, pecorino, crushed walnut.",
    note: "Changes with the truck.",
    image: media.casa.dish6,
    dietary: ["vegetarian"],
  },
  {
    id: "quail",
    name: "Quail, honey, chile",
    category: "Fire",
    price: 29,
    desc: "Spatchcocked over oak. Wildflower honey, dried chile, grilled citrus.",
    note: "For two to share, or one who is hungry.",
    image: media.casa.dish5,
    dietary: [],
  },
  {
    id: "rib",
    name: "Rib of beef",
    category: "Fire",
    price: 48,
    desc: "Dry-aged, coal-finished, bone marrow butter, grilled onion.",
    note: "Ask for it blushing.",
    image: media.casa.dish2,
    dietary: [],
  },
  {
    id: "chicken",
    name: "Bird, whole",
    category: "Fire",
    price: 64,
    desc: "A whole chicken for the table. Pan juices, garlic, bitter greens.",
    note: "Forty minutes. Worth it.",
    image: media.casa.dish8,
    dietary: [],
  },
  {
    id: "crudo",
    name: "Crudo",
    category: "Sea",
    price: 24,
    desc: "Whatever came in cold. Olive oil from down the road, flaked salt.",
    note: "The kitchen decides.",
    image: media.casa.dish1,
    dietary: [],
  },
  {
    id: "prawn",
    name: "Prawns, head-on",
    category: "Sea",
    price: 32,
    desc: "Garlic, dried oregano, wood smoke, grilled bread for the oil.",
    note: "Use your hands.",
    image: media.casa.dish4,
    dietary: [],
  },
  {
    id: "beef-bowl",
    name: "Slow beef",
    category: "Fire",
    price: 36,
    desc: "Shoulder, red wine, arugula, burnt onion jus.",
    note: "The house plate.",
    image: media.casa.dish3,
    dietary: [],
  },
  {
    id: "olive-oil-cake",
    name: "Olive oil cake",
    category: "Sweet",
    price: 14,
    desc: "Citrus leaf, whipped cream, last of the season's fruit.",
    note: "Soft. Not precious.",
    image: media.casa.wineClose,
    dietary: ["vegetarian"],
  },
  {
    id: "fire-fruit",
    name: "Fruit, fire",
    category: "Sweet",
    price: 13,
    desc: "Whatever is ripe, kissed by the grill, salted caramel.",
    note: "If they have it, order it.",
    image: media.casa.candle,
    dietary: ["vegetarian"],
  },
  {
    id: "house-red",
    name: "House red",
    category: "Wine",
    price: 14,
    desc: "A Grenache blend from a vineyard you can see on a clear day.",
    note: "Glass. Bottle on request.",
    image: media.casa.wine,
    dietary: ["vegan"],
  },
  {
    id: "skin-contact",
    name: "Skin contact",
    category: "Wine",
    price: 16,
    desc: "Amber, oxidative, orange peel, a little wild.",
    note: "Pairs with the crudo.",
    image: media.casa.glasses,
    dietary: ["vegan"],
  },
];

export const casaGallery = [
  { src: media.casa.hero, alt: "Dim restaurant interior, wine glasses waiting on the bar." },
  { src: media.casa.table, alt: "A table set for two with wine glasses." },
  { src: media.casa.night, alt: "Fine dining table setting at night." },
  { src: media.casa.chef, alt: "Chef working over an open flame." },
  { src: media.casa.fire, alt: "Kitchen fire catching as meat hits the grill." },
  { src: media.casa.dish1, alt: "Seafood plated with herbs on black ceramic." },
  { src: media.casa.dish2, alt: "Steak with an exact, quiet presentation." },
  { src: media.casa.wine, alt: "Two wine glasses at a set table." },
];
