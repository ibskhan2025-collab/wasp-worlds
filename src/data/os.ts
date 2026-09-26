export type PipelineStatus =
  | "New lead"
  | "Qualified"
  | "Consultation"
  | "Proposal"
  | "Signed"
  | "Paid"
  | "Onboarding"
  | "Design"
  | "Development"
  | "QA"
  | "Live";

export const PIPELINE: PipelineStatus[] = [
  "New lead",
  "Qualified",
  "Consultation",
  "Proposal",
  "Signed",
  "Paid",
  "Onboarding",
  "Design",
  "Development",
  "QA",
  "Live",
];

export type OsProject = {
  id: string;
  client: string;
  company: string;
  project: string;
  budget: string;
  scope: string;
  timeline: string;
  status: PipelineStatus;
  notes: string;
  payment: "Unpaid" | "Deposit" | "Scheduled" | "Paid";
  onboarding: "Not started" | "In progress" | "Complete";
  tasks: { id: string; title: string; done: boolean }[];
};

export const seedProjects: OsProject[] = [
  {
    id: "os1",
    client: "Sample — not a real client",
    company: "Placeholder Co.",
    project: "Homepage rewrite",
    budget: "Mid",
    scope: "5 pages, no ecommerce, light motion",
    timeline: "6 weeks",
    status: "Consultation",
    notes: "Demonstration record. Replace with real work.",
    payment: "Unpaid",
    onboarding: "Not started",
    tasks: [
      { id: "t1", title: "Send fit questions", done: true },
      { id: "t2", title: "Book call", done: false },
    ],
  },
  {
    id: "os2",
    client: "Sample — not a real client",
    company: "Study Shop",
    project: "Catalogue + cart",
    budget: "Upper",
    scope: "Store, CMS, 20 products",
    timeline: "10 weeks",
    status: "Design",
    notes: "Demonstration record.",
    payment: "Deposit",
    onboarding: "Complete",
    tasks: [
      { id: "t3", title: "Art direction", done: true },
      { id: "t4", title: "PDP states", done: false },
    ],
  },
  {
    id: "os3",
    client: "Sample — not a real client",
    company: "Civic North",
    project: "Service dashboard",
    budget: "Upper",
    scope: "App UI, 8 views",
    timeline: "12 weeks",
    status: "Proposal",
    notes: "Demonstration record.",
    payment: "Unpaid",
    onboarding: "Not started",
    tasks: [{ id: "t5", title: "Write proposal", done: false }],
  },
];

export const contentIdeas = [
  { id: "ci1", title: "Build in public: the reservation flow", pillar: "Build in public", status: "Draft" },
  { id: "ci2", title: "Why restaurant websites fail at Tuesday night", pillar: "Education", status: "Idea" },
  { id: "ci3", title: "Before / after: a homepage that wouldn't shut up", pillar: "Redesign", status: "Idea" },
  { id: "ci4", title: "VOID: notes from an unjustified experiment", pillar: "Experiments", status: "Published" },
];
