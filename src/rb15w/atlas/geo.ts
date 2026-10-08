export type Dest = { id: string; name: string; country: string; lat: number; lon: number; rating: number; months: number[]; perDay: number; days: number; tags: string[]; blurb: string; pack: string[] };

export const DESTS: Dest[] = [
  { id: "lisbon", name: "Lisbon", country: "Portugal", lat: 38.72, lon: -9.14, rating: 4.7, months: [4, 5, 6, 9, 10], perDay: 130, days: 4, tags: ["Culture", "Food", "Coast"], blurb: "Seven hills, tiled streets, custard tarts at 7am and fado at midnight. Walkable, if you like stairs.", pack: ["Flat shoes with grip", "Light scarf", "Sunscreen", "Tram pass"] },
  { id: "kyoto", name: "Kyoto", country: "Japan", lat: 35.01, lon: 135.77, rating: 4.9, months: [3, 4, 10, 11], perDay: 190, days: 6, tags: ["Culture", "Food"], blurb: "Temples at dawn before the crowds, kaiseki at dusk after them. Cherry blossom and autumn maples both book out early.", pack: ["Slip-on shoes", "IC travel card", "Cash (yen)", "Small towel"] },
  { id: "marrakech", name: "Marrakech", country: "Morocco", lat: 31.63, lon: -7.99, rating: 4.4, months: [3, 4, 5, 10, 11], perDay: 95, days: 4, tags: ["Culture", "Food"], blurb: "Medina, rooftops, mint tea and a good guide. Bargain gently; get lost on purpose in the mornings.", pack: ["Modest layers", "Sun hat", "Small change", "Phrasebook"] },
  { id: "reykjavik", name: "Reykjavík", country: "Iceland", lat: 64.15, lon: -21.94, rating: 4.6, months: [6, 7, 8], perDay: 260, days: 5, tags: ["Nature", "Coast"], blurb: "Base for waterfalls, black beaches and geothermal pools. The midnight sun makes June feel unreasonable.", pack: ["Waterproof shell", "Swimwear", "Sleep mask", "Layers, then layers"] },
  { id: "capetown", name: "Cape Town", country: "South Africa", lat: -33.92, lon: 18.42, rating: 4.8, months: [11, 12, 1, 2, 3], perDay: 120, days: 7, tags: ["Nature", "Coast", "Food"], blurb: "A mountain in the middle of a city, vineyards forty minutes away, penguins at the beach. The wind is part of it.", pack: ["Windbreaker", "Hiking shoes", "Sunscreen", "Swimwear"] },
  { id: "patagonia", name: "El Chaltén", country: "Argentina", lat: -49.33, lon: -72.89, rating: 4.9, months: [11, 12, 1, 2, 3], perDay: 140, days: 7, tags: ["Nature", "Mountains"], blurb: "The trekking capital of Argentina. Fitz Roy at sunrise is worth the 4am alarm, most of the time.", pack: ["Broken-in boots", "Trekking poles", "Windproof layers", "Headtorch"] },
  { id: "oaxaca", name: "Oaxaca", country: "Mexico", lat: 17.07, lon: -96.72, rating: 4.7, months: [10, 11, 12, 1, 2, 3, 4], perDay: 85, days: 5, tags: ["Culture", "Food"], blurb: "Mole in seven colours, mezcal tastings, markets that take all morning. Day of the Dead in early November is unforgettable.", pack: ["Comfortable sandals", "Sun hat", "Stomach-friendly optimism", "Small bills"] },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", lat: 21.03, lon: 105.85, rating: 4.5, months: [10, 11, 12, 1, 2, 3, 4], perDay: 60, days: 4, tags: ["Culture", "Food"], blurb: "Motorbikes, egg coffee, bún chả for lunch. Cross the street slowly and predictably; they will flow around you.", pack: ["Light rain jacket", "Breathable shirts", "Hand sanitiser", "Offline maps"] },
  { id: "queenstown", name: "Queenstown", country: "New Zealand", lat: -45.03, lon: 168.66, rating: 4.8, months: [12, 1, 2, 3], perDay: 175, days: 6, tags: ["Nature", "Mountains"], blurb: "Lakes, peaks and every adrenaline activity invented. Or just a long lunch at a winery near Gibbston.", pack: ["Fleece", "Sun protection", "Hiking shoes", "Swimwear"] },
  { id: "dubrovnik", name: "Dubrovnik", country: "Croatia", lat: 42.65, lon: 18.09, rating: 4.3, months: [5, 6, 9], perDay: 150, days: 3, tags: ["Coast", "Culture"], blurb: "City walls, limestone streets, clear Adriatic. Go in shoulder season and walk the walls at opening time.", pack: ["Water shoes", "Sun hat", "Light linen", "Euro coins"] },
  { id: "banff", name: "Banff", country: "Canada", lat: 51.18, lon: -115.57, rating: 4.8, months: [6, 7, 8, 9], perDay: 210, days: 5, tags: ["Nature", "Mountains"], blurb: "Turquoise lakes, elk on the golf course, hot springs at the end of a hike. Book Lake Louise shuttles early.", pack: ["Bear spray (rent)", "Layers", "Sturdy boots", "Swimwear"] },
  { id: "tromso", name: "Tromsø", country: "Norway", lat: 69.65, lon: 18.96, rating: 4.6, months: [9, 10, 11, 12, 1, 2, 3], perDay: 230, days: 4, tags: ["Nature", "Coast"], blurb: "Northern lights chase by minibus, reindeer stew, and a proper winter. Clear nights matter more than the calendar.", pack: ["Thermal base layers", "Insulated boots", "Tripod", "Hand warmers"] },
];

export const LAND: [number, number][][] = [
  [[-168, 66], [-155, 71], [-125, 70], [-95, 72], [-80, 73], [-62, 60], [-55, 50], [-67, 44], [-76, 35], [-81, 25], [-90, 29], [-97, 26], [-97, 20], [-88, 16], [-83, 9], [-77, 8], [-80, 7], [-86, 12], [-95, 16], [-105, 20], [-112, 30], [-117, 32], [-124, 40], [-125, 49], [-135, 58], [-150, 60], [-165, 55]],
  [[-55, 60], [-45, 60], [-20, 70], [-18, 80], [-40, 83], [-65, 80], [-70, 77]],
  [[-78, 8], [-70, 12], [-60, 10], [-50, 0], [-35, -5], [-38, -15], [-48, -26], [-58, -38], [-65, -42], [-68, -52], [-72, -54], [-75, -48], [-73, -38], [-71, -20], [-76, -14], [-81, -5], [-80, 0]],
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [10, 58], [5, 62], [15, 69], [28, 71], [40, 67], [30, 60], [28, 55], [30, 46], [26, 40], [22, 36], [12, 38], [8, 44], [3, 43], [-5, 36]],
  [[-17, 21], [-10, 30], [-6, 36], [10, 37], [20, 32], [32, 31], [43, 12], [51, 12], [40, -2], [40, -15], [33, -26], [20, -35], [17, -30], [12, -17], [9, -1], [9, 4], [-8, 4], [-16, 12]],
  [[26, 40], [36, 36], [35, 30], [43, 13], [58, 22], [67, 25], [73, 19], [77, 8], [80, 15], [88, 22], [93, 17], [98, 8], [103, 1], [106, 10], [109, 21], [122, 30], [122, 40], [130, 43], [141, 52], [160, 60], [180, 68], [140, 73], [100, 78], [70, 73], [50, 68], [40, 67], [30, 60], [30, 46]],
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [141, -38], [130, -32], [115, -34]],
  [[172, -34], [178, -38], [175, -41], [172, -41]], [[167, -46], [174, -41], [171, -46]],
  [[130, 31], [135, 34], [140, 36], [142, 40], [140, 43], [145, 44], [141, 40], [139, 35], [132, 33]],
  [[-6, 50], [2, 51], [0, 54], [-3, 58], [-6, 57], [-5, 54]], [[-24, 64], [-14, 64], [-14, 66], [-22, 66]],
];

export const MW = 1000, MH = 500;
export const proj = (lon: number, lat: number): [number, number] => [((lon + 180) / 360) * MW, ((90 - lat) / 180) * MH];
export function km(a: Dest, b: Dest) {
  const R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
