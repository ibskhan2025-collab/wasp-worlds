export type WorkshopObj = {
  id: string;
  name: string;
  cat: string;
  maker: string;
  price: number;
  desc: string;
  profile: [number, number][];
  color: string;
  metal: number;
  rough: number;
  glass?: boolean;
  h: number;
};

export type WorkshopMaker = {
  id: string;
  name: string;
  craft: string;
  place: string;
  story: string;
};

export const WORKSHOP_MAKERS: WorkshopMaker[] = [
  { id: "ines", name: "Inês Carvalho", craft: "Stoneware", place: "Lisbon", story: "Inês fires in a kiln she built from reclaimed brick, and throws everything on a wheel she has had since she was nineteen. Her glazes are made from ash she collects from the bakery next door, which is why no two batches match. She says the best pot is the one you forget is a pot." },
  { id: "tomas", name: "Tomas Weil", craft: "Turned wood", place: "Black Forest", story: "Tomas turns green wood while it is still wet, so the bowl moves and dries into its own shape. He only uses timber from trees that came down in storms. Every piece is sanded until, in his words, it stops arguing with your hand." },
  { id: "nadia", name: "Nadia Okafor", craft: "Blown glass", place: "Bristol", story: "Nadia works in borrowed time on a shared furnace, blowing glass in the early hours when the heat is steadiest. She makes objects that are meant to be used daily and dropped occasionally. Her cardinal rule: if it cannot survive a dishwasher, it is not finished." },
  { id: "ruben", name: "Ruben Vos", craft: "Spun metal", place: "Rotterdam", story: "Ruben spins brass and pewter over wooden forms cut by his father, a pattern-maker. Metal spinning is 80% listening — to the pitch, to the tool, to the moment the sheet starts to give. He has never once used a computer to decide when to stop." },
];

export const WORKSHOP_OBJS: WorkshopObj[] = [
  { id: "tide", name: "Tide Vase", cat: "Ceramics", maker: "ines", price: 86, desc: "A tall stoneware vase with a swelling belly and a narrow neck. Ash-glazed in a pale, slightly uneven sea-foam.", profile: [[0, 0], [0.45, 0], [0.6, 0.12], [0.7, 0.45], [0.52, 0.85], [0.26, 1.02], [0.28, 1.18], [0.36, 1.26], [0.3, 1.27], [0.22, 1.18], [0.2, 1.05]], color: "#b9c4b5", metal: 0, rough: 0.7, h: 1.3 },
  { id: "dune", name: "Dune Bowl", cat: "Ceramics", maker: "ines", price: 54, desc: "A wide, shallow serving bowl the colour of dry sand. Food sits in it the way a hand rests on a table.", profile: [[0, 0], [0.35, 0], [0.75, 0.15], [0.92, 0.42], [0.9, 0.45], [0.72, 0.22], [0, 0.2]], color: "#d4c2a0", metal: 0, rough: 0.8, h: 0.5 },
  { id: "ember", name: "Ember Lamp Base", cat: "Ceramics", maker: "ines", price: 148, desc: "A heavy, tapering lamp base in a rust-red glaze that pools darker at the foot.", profile: [[0, 0], [0.5, 0], [0.56, 0.1], [0.42, 0.6], [0.22, 0.95], [0.15, 1.35], [0.1, 1.42], [0, 1.42]], color: "#a8452c", metal: 0.05, rough: 0.45, h: 1.45 },
  { id: "candlestick", name: "Turned Ash Candlestick", cat: "Wood", maker: "tomas", price: 62, desc: "A slim, beaded candlestick turned from a single ash billet.", profile: [[0, 0], [0.4, 0], [0.4, 0.06], [0.1, 0.12], [0.1, 0.5], [0.22, 0.6], [0.1, 0.7], [0.1, 0.9], [0.26, 1.0], [0.3, 1.08], [0.2, 1.1], [0.18, 1.0], [0, 1.0]], color: "#cfb58a", metal: 0, rough: 0.6, h: 1.1 },
  { id: "walnut", name: "Walnut Bowl", cat: "Wood", maker: "tomas", price: 96, desc: "A deep bowl turned from storm-fallen walnut, finished with food-safe oil.", profile: [[0, 0], [0.3, 0], [0.65, 0.2], [0.85, 0.5], [0.84, 0.54], [0.62, 0.26], [0, 0.22]], color: "#5a3a26", metal: 0, rough: 0.55, h: 0.55 },
  { id: "salt", name: "Oak Salt Pot", cat: "Wood", maker: "tomas", price: 38, desc: "A small lidless pot for flaky salt, with a pinch-friendly mouth.", profile: [[0, 0], [0.4, 0], [0.45, 0.25], [0.35, 0.4], [0.3, 0.4], [0.36, 0.25], [0, 0.1]], color: "#a0784a", metal: 0, rough: 0.6, h: 0.4 },
  { id: "carafe", name: "Sable Carafe", cat: "Glass", maker: "nadia", price: 72, desc: "A smoked-glass water carafe with a long neck. Holds 900ml and looks good half empty.", profile: [[0, 0], [0.45, 0], [0.52, 0.1], [0.5, 0.5], [0.28, 0.85], [0.2, 1.2], [0.25, 1.32], [0.21, 1.32], [0.15, 1.2], [0.2, 0.85], [0.43, 0.5], [0.44, 0.12], [0, 0.08]], color: "#7c7670", metal: 0.1, rough: 0.05, glass: true, h: 1.35 },
  { id: "tumbler", name: "Tumbler (set of four)", cat: "Glass", maker: "nadia", price: 48, desc: "Four thick-walled tumblers with slightly different weights, because hand-blown never means identical.", profile: [[0, 0], [0.3, 0], [0.43, 0.75], [0.41, 0.75], [0.28, 0.06], [0, 0.06]], color: "#c6d6d2", metal: 0.1, rough: 0.05, glass: true, h: 0.75 },
  { id: "bud", name: "Brass Bud Vase", cat: "Metal", maker: "ruben", price: 58, desc: "A small spun-brass vase with a slender neck. It will patina. We recommend letting it.", profile: [[0, 0], [0.25, 0], [0.32, 0.12], [0.26, 0.45], [0.1, 0.7], [0.09, 0.95], [0.16, 1.05], [0.14, 1.05], [0.07, 0.95], [0.08, 0.7], [0.24, 0.45], [0.3, 0.12], [0, 0.05]], color: "#c79a3c", metal: 1, rough: 0.28, h: 1.05 },
  { id: "pewter", name: "Spun Pewter Dish", cat: "Metal", maker: "ruben", price: 88, desc: "A shallow dish for keys, rings and the things you are not ready to put away.", profile: [[0, 0], [0.5, 0], [0.9, 0.08], [0.95, 0.13], [0.92, 0.14], [0.85, 0.1], [0, 0.04]], color: "#a8adb3", metal: 1, rough: 0.3, h: 0.15 },
];
