// Every photograph on the site is licensed stock from Pexels (Pexels License —
// free to use, attribution appreciated). We keep the credit next to the asset
// so the /credits page and every figcaption can say exactly where it came from.
// These images art-direct fictional worlds; they are NOT documentary photos of
// real WASP clients.

export type Photo = { id: number; alt: string; by: string; tall?: boolean };

export const px = (p: Photo | number, w = 1200) => {
  const id = typeof p === "number" ? p : p.id;
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
};

export const srcSet = (p: Photo) => [480, 800, 1200, 1800].map((w) => `${px(p, w)} ${w}w`).join(", ");

const P = (id: number, alt: string, by: string, tall = false): Photo => ({ id, alt, by, tall });

export const media = {
  casa: {
    room: P(34507150, "A full table of people mid-conversation in a warm, low-lit dining room", "Viridiana Rivera"),
    candles: P(7956651, "Candlelit table with bread and a rice dish", "Thirdman", true),
    spread: P(20418288, "Several shared plates on a candlelit restaurant table", "Gül Işık", true),
    setting: P(37661851, "A single place setting with a wine glass and candle", "DΛVΞ GΛRCIΛ", true),
    friends: P(3938727, "Friends raising wine glasses by candlelight", "Andrea Piacquadio"),
    rigatoni: P(29039081, "Rigatoni with tomato sauce and basil on a patterned plate", "Nano Erdozain"),
    burrata: P(27327939, "Burrata with basil, tomatoes, radish and avocado on a wooden table", "Thomas Svensson"),
    squid: P(27402124, "Grilled squid with pesto, roasted vegetables and lemon", "Thomas Svensson"),
    fettuccine: P(4161714, "Fettuccine with meatballs and parmesan", "Ali Nafezarefi"),
    spaghetti: P(23106699, "Spaghetti with tomato and cheese on a black plate", "Ali Dashti"),
    noodles: P(10966377, "Hand-pulled noodles with vegetables and spices", "elif tekkaya"),
    flour: P(16620746, "Eggs, flour and dried pasta laid out before cooking", "Marcelo Verfe"),
    broth: P(6493568, "The end of a bowl of broth, oil still on the surface", "Piotr Arnoldes"),
  },
  noir: [
    P(36298417, "Black and white portrait of a woman in motion", "Abiodun Moses", true),
    P(6501891, "Grayscale portrait, seated, black tank top", "Pressi", true),
    P(17945059, "Woman on a studio stool in a black blazer and boots", "Nur Demirbaş", true),
    P(34691207, "Black and white street portrait", "Mert Coşkun", true),
    P(17393964, "Black dress and sunglasses against a neutral wall", "James L", true),
    P(38290951, "Woman with a fashion magazine in an urban setting", "Esra Saltürk", true),
    P(12367876, "Portrait in fog, black and white", "Anastasiia Chaikovska", true),
  ],
  still: [
    P(20349964, "A single tree disappearing into fog", "Alexey Chudin", true),
    P(14968041, "Boulders at a lakeshore in thick fog", "Tuğçe Açıkyürek", true),
    P(14499187, "Mountains reflected in still water at dawn", "Serhat Tuğ"),
    P(20875082, "A single post in a misty lake, Copenhagen", "Ryan Klaus", true),
    P(19100099, "Reeds reflected in a foggy lake", "Artem", true),
    P(19562164, "Wooden post in a winter field", "Csankovszki Tibor", true),
    P(35671575, "Morning fog over an open field", "Ilia Bronskiy", true),
    P(30951400, "Two people walking into fog on grassland", "Marcelo Mora"),
  ],
  nest: {
    hall: P(15663488, "Symmetrical concrete hallway, black and white", "IAN"),
    stairs: P(12884282, "Concrete stairs under skylights", "Mathias Reding"),
    lamp: P(12147912, "Hanging lamp inside a geometric stairwell", "Adrien Olichon", true),
    ceiling: P(6908212, "Geometric concrete ceiling", "Shirish Desai", true),
    elevator: P(35288711, "Glass elevator between concrete walls", "Göksun Barış Gökalp", true),
  },
  forge: {
    gears: P(7568421, "Stacked metal gears on a workshop shelf", "cottonbro studio", true),
    lock: P(28119420, "Lock barrel parts with coloured reflections", "Nic Wood"),
    color: P(39277865, "Interlocking painted gears", "Rafael Minguet Delgado"),
    japan: P(36552344, "Machinery plate reading Made in Japan", "Johanna"),
    engine: P(7564856, "Engine components in low light", "cottonbro studio", true),
  },
  pulse: {
    room: P(30215324, "Indoor concert crowd with smoke and moving lights", "Jeremy Li"),
    night: P(26447525, "Crowd at a night concert under dramatic lights", "Noland Live", true),
    stage: P(36675302, "Large crowd under stage lighting", "Fausto Ferreira"),
    festival: P(35777523, "Festival crowd under a light show", "Noland Live", true),
    stadium: P(761543, "Crowd inside a dark stadium, London", "Jack Gittoes"),
    dj: P(13137879, "DJ at the mixer, Istanbul", "Sami Abdullah", true),
  },
  atlas: {
    alley: P(37167198, "Stone alleyway opening onto the sea", "M.Emin Bilir", true),
    white: P(28588396, "Whitewashed alley leading to the ocean", "Mathias Reding", true),
    marmaris: P(36874336, "Stone houses in an alley in Marmaris", "MÖV Frame", true),
    bay: P(20659015, "Alley with a view over a bay and mountains", "Efnan Yılmaz"),
    cottages: P(3473344, "A man walking past seaside cottages", "Lisa Fotios"),
    aerial: P(6135332, "Aerial view of a small town by calm water", "Pok Rie"),
    amasra: P(33019670, "The coastal town of Amasra", "Mustafa S."),
  },
  objects: [
    P(15028227, "Sculptural ceramic vase on black", "Vural Yavas"),
    P(29904622, "Minimal ceramic vase in warm sunlight", "Tiarra Sorte"),
    P(39199677, "White ceramic pitcher on a dark background", "William Finn"),
    P(13344056, "Three ceramic bowls in different colours", "Mustapha Ouhammouch"),
    P(18273385, "Floral ceramic teapot set", "Sứ Bát Tràng"),
    P(39680456, "Simple wooden stool on a dark background", "Israyosoy S."),
    P(29463558, "Spice grinder on a rustic kitchen table", "Marcelo Verfe"),
  ],
  civic: {
    library: P(18199325, "Modern public library interior with blue seating", "Asia Culture Center"),
    square: P(18882645, "Urban square with people and greenery", "Asia Culture Center"),
    poznan: P(11618739, "Raczyński Library in Poznań on a sunny day", "Egor Komarov"),
    walking: P(16461165, "People walking across a busy town square", "Lukas Kosc"),
    hall: P(4318449, "Library hall seen from above", "Gunnar Ridderström"),
  },
  archive: {
    spread: P(31362777, "Vintage books and loose pages laid out", "Arturo A"),
    overhead: P(30938260, "Open old books in dramatic overhead light", "Liana Tril'", true),
    diagrams: P(5153472, "Old open books with diagrams", "Jesus Alejandro Moron Guadarrama", true),
    spanish: P(31362775, "Antique pages of Spanish literature", "Arturo A"),
  },
  bench: {
    sketch: P(4238498, "Hand sketching ideas in a spiral notebook", "Ivan S"),
    pencil: P(4238483, "Pencil sketch in progress", "Ivan S"),
    blueprint: P(7257232, "Hand annotating architectural blueprints", "Anete Lusina"),
    plans: P(5292194, "Hands drafting floor plans", "Antoni Shkraba", true),
    laptop: P(4491918, "Laptop open on a carpentry workbench", "Ivan S"),
    ruler: P(6790758, "Measuring a wooden panel next to a notebook", "Tima Miroshnichenko"),
  },
};

export function allPhotos(): Photo[] {
  const out: Photo[] = [];
  const walk = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object" && "id" in (v as object)) out.push(v as Photo);
    else if (v && typeof v === "object") Object.values(v as object).forEach(walk);
  };
  walk(media);
  return out;
}
