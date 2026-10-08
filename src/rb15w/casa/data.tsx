import { rng } from "@/rb15l/plate";

export type Dish = { id: string; name: string; course: string; price: number; desc: string; ing: string; tags: string[]; color: string; accent: string; seed: number; story: string };

export const COURSES = ["All", "Small", "Pasta & rice", "Fire", "Sweet"];
export const DIETS: [string, string][] = [["v", "Vegetarian"], ["vg", "Vegan"], ["gf", "Gluten-free"], ["df", "Dairy-free"]];

export const DISHES: Dish[] = [
  { id: "tuna-crudo", name: "Tuna crudo", course: "Small", price: 16, desc: "Line-caught tuna, blood orange, fennel pollen, green olive oil.", ing: "tuna blood orange fennel olive oil sea salt", tags: ["gf", "df"], color: "#c2453a", accent: "#e98a3c", seed: 1, story: "Sliced to order and dressed at the pass. The fennel pollen comes from wild plants we pick near the quay every September." },
  { id: "burrata", name: "Burrata, charred peach", course: "Small", price: 14, desc: "Creamy burrata, grilled peach, basil oil, toasted crumb.", ing: "burrata peach basil bread", tags: ["v"], color: "#f2ead8", accent: "#e9a15a", seed: 2, story: "The peach is scorched on the wood grill until the sugar catches. The burrata arrives from a dairy forty minutes away, still cold from the morning." },
  { id: "courgette-flowers", name: "Courgette flowers", course: "Small", price: 13, desc: "Fried in sparkling batter, filled with lemon ricotta, finished with honey.", ing: "courgette flower ricotta lemon honey flour", tags: ["v"], color: "#e8b23a", accent: "#7a9a3c", seed: 3, story: "A dish that only exists for eight weeks of the year, so we serve it every night of those eight weeks." },
  { id: "octopus", name: "Octopus & potatoes", course: "Small", price: 18, desc: "Slow-braised octopus, smoked paprika potatoes, parsley, lemon.", ing: "octopus potato paprika parsley lemon", tags: ["gf", "df"], color: "#b9553b", accent: "#e7dca4", seed: 4, story: "Braised for two hours in its own liquor, chilled overnight, then blistered hard on the grill. Tender inside, crackling outside." },
  { id: "beetroot", name: "Roasted beetroot", course: "Small", price: 12, desc: "Salt-baked beetroot, whipped feta, pistachio, mint.", ing: "beetroot feta pistachio mint nuts", tags: ["v", "gf"], color: "#8c1f3e", accent: "#f2e8e0", seed: 5, story: "Baked in a crust of salt and egg white for ninety minutes, cracked open at the table side of the kitchen." },
  { id: "saffron-risotto", name: "Saffron risotto, clams", course: "Pasta & rice", price: 24, desc: "Carnaroli rice, saffron, palourde clams, bottarga.", ing: "rice saffron clams bottarga butter", tags: ["gf"], color: "#e5b42d", accent: "#f2e8d0", seed: 6, story: "Stirred for eighteen minutes by someone who is not allowed to do anything else. Bottarga is grated at the last second like a snowfall." },
  { id: "tagliolini", name: "Brown butter tagliolini", course: "Pasta & rice", price: 19, desc: "Fresh egg tagliolini, brown butter, lemon zest, crisp sage.", ing: "egg pasta butter lemon sage parmesan", tags: ["v"], color: "#e9cf8a", accent: "#7d8a4a", seed: 7, story: "Rolled at seven every morning. The butter is cooked past golden to the colour of a violin." },
  { id: "mushroom-orzo", name: "Wild mushroom orzo", course: "Pasta & rice", price: 20, desc: "Orzo cooked like risotto in mushroom broth, thyme, black garlic.", ing: "orzo mushroom thyme black garlic olive oil", tags: ["v", "vg", "df"], color: "#7a5a3c", accent: "#d9c9a0", seed: 8, story: "The broth takes two days and eleven kilos of trimmings. It is the most expensive vegan dish on the menu and the one we are proudest of." },
  { id: "sea-bream", name: "Grilled sea bream", course: "Fire", price: 29, desc: "Whole fillet, salmoriglio, charred lemon, wilted greens.", ing: "sea bream oregano lemon garlic greens olive oil", tags: ["gf", "df"], color: "#d6d2c6", accent: "#8aa33c", seed: 9, story: "Cooked skin-side down over vine cuttings, never flipped. The salmoriglio is whisked in a cold bowl so it stays bright." },
  { id: "lamb", name: "Lamb shoulder", course: "Fire", price: 32, desc: "Seven-hour shoulder, anchovy, rosemary, white beans.", ing: "lamb anchovy rosemary white beans garlic", tags: ["gf", "df"], color: "#8a4a2c", accent: "#d8cfa8", seed: 10, story: "Goes into the oven at 11am. By eight it falls off the bone at a stern look. Serves one generously, two politely." },
  { id: "cauliflower", name: "Charred cauliflower", course: "Fire", price: 18, desc: "Whole-head cauliflower, tahini, pomegranate, dukkah.", ing: "cauliflower tahini pomegranate sesame nuts", tags: ["v", "vg", "gf", "df"], color: "#ddd2b2", accent: "#b83a4a", seed: 11, story: "Roasted whole until the outside is almost black and the inside is sweet as cream. Carved at the pass." },
  { id: "chicken", name: "Hay-smoked chicken", course: "Fire", price: 26, desc: "Half bird smoked over hay, green olive, preserved lemon.", ing: "chicken hay green olive preserved lemon", tags: ["gf", "df"], color: "#c48a4a", accent: "#7a8a3a", seed: 12, story: "The hay comes from a farm that also supplies the horses of the local police. They have never once complained." },
  { id: "olive-cake", name: "Olive oil cake", course: "Sweet", price: 10, desc: "Moist olive oil sponge, bergamot cream, candied peel.", ing: "olive oil flour egg bergamot cream sugar", tags: ["v"], color: "#e8c870", accent: "#f4efe2", seed: 13, story: "Baked in a tin older than the restaurant. The bergamot peel is candied in-house across four days." },
  { id: "chocolate-pot", name: "Dark chocolate pot", course: "Sweet", price: 9, desc: "72% chocolate, olive oil, flaky salt, toasted bread.", ing: "dark chocolate olive oil sea salt bread", tags: ["v", "vg", "df"], color: "#3a2218", accent: "#d8b070", seed: 14, story: "No cream, no eggs. Just chocolate, good olive oil and patience. Served with bread, because it is also a snack." },
];

export function DishArt({ d, className = "" }: { d: Dish; className?: string }) {
  const R = rng(d.seed * 131);
  const blobs = Array.from({ length: 7 }, () => {
    const a = R() * 6.28, r = R() * 20;
    return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r, rx: 7 + R() * 10, ry: 5 + R() * 8, rot: R() * 180, c: R() > 0.35 ? d.color : d.accent };
  });
  const leaf = Array.from({ length: 9 }, () => ({ x: 28 + R() * 44, y: 28 + R() * 44, r: 0.8 + R() * 1.6 }));
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`Illustration of ${d.name}`}>
      <defs>
        <radialGradient id={`pl-${d.id}`} cx="40%" cy="35%"><stop offset="0" stopColor="#fbf7ee" /><stop offset="1" stopColor="#d9d0bd" /></radialGradient>
      </defs>
      <circle cx="52" cy="54" r="44" fill="rgba(0,0,0,.25)" />
      <circle cx="50" cy="50" r="45" fill={`url(#pl-${d.id})`} />
      <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="1" />
      {blobs.map((b, i) => <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} transform={`rotate(${b.rot} ${b.x} ${b.y})`} fill={b.c} opacity={0.92} />)}
      {leaf.map((l, i) => <circle key={i} cx={l.x} cy={l.y} r={l.r} fill="#5f7d2c" />)}
    </svg>
  );
}

export const GALLERY = [
  { id: "g1", src: "/img/casa-hero.jpg", pos: "50% 50%", scale: 1, cap: "Sea bream, salmoriglio, charred lemon" },
  { id: "g2", src: "/img/casa-room.jpg", pos: "30% 50%", scale: 1, cap: "The dining room before service" },
  { id: "g3", dish: "burrata", cap: "Burrata, charred peach" },
  { id: "g4", src: "/img/casa-hero.jpg", pos: "80% 20%", scale: 1.8, cap: "Detail: the plate, the linen, the light" },
  { id: "g5", dish: "saffron-risotto", cap: "Saffron risotto, clams" },
  { id: "g6", src: "/img/casa-room.jpg", pos: "85% 60%", scale: 1.6, cap: "Window table, arched glass" },
  { id: "g7", dish: "lamb", cap: "Seven-hour lamb shoulder" },
  { id: "g8", dish: "chocolate-pot", cap: "Dark chocolate pot" },
];

export const TABLES = [
  { id: "T1", label: "Table 1 · Window", seats: 2, pos: [-5, 0, -3.5] as [number, number, number], note: "Arched glass, late sun until 19:30. The couple's table.", dish: "tuna-crudo" },
  { id: "T2", label: "Table 2 · Window", seats: 2, pos: [-5, 0, 0] as [number, number, number], note: "Quieter corner, good for conversation.", dish: "burrata" },
  { id: "T3", label: "Table 3 · Centre", seats: 4, pos: [-1.2, 0, -2.5] as [number, number, number], note: "Under the largest pendant. The room's stage.", dish: "sea-bream" },
  { id: "T4", label: "Table 4 · Centre", seats: 4, pos: [2.2, 0, -1] as [number, number, number], note: "Closest to the pass; you can hear the kitchen.", dish: "saffron-risotto" },
  { id: "T5", label: "Table 5 · Terrace door", seats: 6, pos: [5.2, 0, -3.2] as [number, number, number], note: "Long table for groups, opens onto the terrace in summer.", dish: "lamb" },
  { id: "T6", label: "Table 6 · Back", seats: 4, pos: [0.5, 0, 3.2] as [number, number, number], note: "Candlelit alcove. Dark, warm, unhurried.", dish: "olive-cake" },
];
