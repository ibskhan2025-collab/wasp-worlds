export type OrbitCustomer = {
  id: string;
  name: string;
  company: string;
  plan: "Studio" | "House" | "Orbit";
  spend: number;
  health: "Quiet" | "Watch" | "Risk";
  last: string;
  email: string;
};

export const orbitCustomers: OrbitCustomer[] = [
  { id: "c1", name: "Mira Chen", company: "Northline", plan: "Orbit", spend: 18400, health: "Quiet", last: "2h ago", email: "mira@northline.study" },
  { id: "c2", name: "Jonas Hale", company: "Hale Atelier", plan: "House", spend: 6200, health: "Watch", last: "1d ago", email: "j@hale.study" },
  { id: "c3", name: "Imani Okoye", company: "Okoye Goods", plan: "Studio", spend: 2100, health: "Quiet", last: "4h ago", email: "imani@okoye.study" },
  { id: "c4", name: "Eva Rost", company: "Rost Press", plan: "House", spend: 9100, health: "Quiet", last: "3d ago", email: "eva@rost.study" },
  { id: "c5", name: "Leo Park", company: "Park Civic", plan: "Orbit", spend: 24000, health: "Risk", last: "12d ago", email: "leo@parkcivic.study" },
  { id: "c6", name: "Sofia Berg", company: "Berg Objects", plan: "Studio", spend: 1600, health: "Watch", last: "6h ago", email: "s@berg.study" },
  { id: "c7", name: "Noah Adeyemi", company: "Adeyemi", plan: "House", spend: 7400, health: "Quiet", last: "1h ago", email: "noah@adeyemi.study" },
  { id: "c8", name: "Clara Voss", company: "Voss Room", plan: "Orbit", spend: 15800, health: "Quiet", last: "22h ago", email: "clara@voss.study" },
];

export type OrbitProject = {
  id: string;
  name: string;
  client: string;
  stage: "Discovery" | "Design" | "Build" | "QA" | "Live";
  due: string;
  owner: string;
};

export const orbitProjects: OrbitProject[] = [
  { id: "p1", name: "Northline relaunch", client: "Northline", stage: "Build", due: "12 May", owner: "A. Shah" },
  { id: "p2", name: "Okoye store", client: "Okoye Goods", stage: "Design", due: "28 Apr", owner: "M. Ellis" },
  { id: "p3", name: "Rost issue 04", client: "Rost Press", stage: "QA", due: "02 May", owner: "A. Shah" },
  { id: "p4", name: "Civic portal", client: "Park Civic", stage: "Discovery", due: "19 May", owner: "J. Kade" },
  { id: "p5", name: "Berg catalogue", client: "Berg Objects", stage: "Live", due: "—", owner: "M. Ellis" },
  { id: "p6", name: "Voss booking", client: "Voss Room", stage: "Build", due: "07 May", owner: "J. Kade" },
];

export const orbitTeam = [
  { name: "Asha Shah", role: "Product", status: "In build" },
  { name: "Morgan Ellis", role: "Design", status: "Review" },
  { name: "Jules Kade", role: "Engineering", status: "In build" },
  { name: "Rin Sato", role: "Ops", status: "Away" },
];

export const orbitActivity = [
  { id: "a1", who: "Mira Chen", what: "upgraded to Orbit", when: "2h" },
  { id: "a2", who: "Jules Kade", what: "moved Civic portal to Discovery", when: "3h" },
  { id: "a3", who: "Eva Rost", what: "approved issue 04 proofs", when: "5h" },
  { id: "a4", who: "Leo Park", what: "invoice overdue", when: "12d" },
  { id: "a5", who: "Morgan Ellis", what: "uploaded Okoye store frames", when: "1d" },
];

export const orbitSeries: Record<string, number[]> = {
  "7d": [12, 18, 16, 22, 19, 28, 31],
  "30d": [40, 42, 38, 51, 48, 55, 61, 58, 64, 70],
  "90d": [30, 34, 33, 40, 38, 44, 48, 52, 49, 57, 61, 66],
};
