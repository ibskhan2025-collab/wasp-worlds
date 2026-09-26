import { media } from "@/lib/media";

export const stillCollections = [
  {
    id: "foliage",
    title: "Through leaves",
    year: "2025",
    note: "Portraits that refuse to be fully seen.",
    images: [
      { src: media.still.foliage, alt: "Portrait seen through blurred leaves.", w: 3, h: 2 },
      { src: media.still.upward, alt: "A person looking up, outdoors, in monochrome.", w: 3, h: 2 },
      { src: media.still.tower, alt: "Portrait with a historic tower behind.", w: 3, h: 2 },
    ],
  },
  {
    id: "city",
    title: "Civic quiet",
    year: "2024",
    note: "Streets after the event has already happened.",
    images: [
      { src: media.still.street, alt: "Vintage street architecture in black and white.", w: 3, h: 2 },
      { src: media.still.city, alt: "Monochrome cityscape at dusk.", w: 3, h: 2 },
      { src: media.still.valley, alt: "Aerial river valley under cloud.", w: 3, h: 2 },
    ],
  },
  {
    id: "structure",
    title: "Structure",
    year: "2026",
    note: "Corridors, columns, the pleasure of a repeating line.",
    images: [
      { src: media.still.colonnade, alt: "Columned walkway, black and white.", w: 2, h: 3 },
      { src: media.still.alley, alt: "Architectural corridor with hard shadows.", w: 2, h: 3 },
      { src: media.still.pillars, alt: "Empty pillared corridor.", w: 2, h: 3 },
      { src: media.still.tunnel, alt: "Urban tunnel in monochrome.", w: 2, h: 3 },
      { src: media.still.corridor, alt: "Modern geometric corridor.", w: 2, h: 3 },
      { src: media.still.underground, alt: "Underground passage with a single light.", w: 2, h: 3 },
    ],
  },
];

export const stillPhotographer = {
  name: "Still Studio",
  location: "Lisbon / nowhere in particular",
  bio: "A photography world built to prove a point: the site should get out of the way of the picture. Contact sheets, fullscreen, keyboard, silence.",
};
