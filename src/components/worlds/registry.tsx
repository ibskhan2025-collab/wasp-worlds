import dynamic from "next/dynamic";
import type { ComponentType } from "react";

function loading(label: string) {
  return function Loading() {
    return (
      <div style={{ minHeight: "60dvh", display: "grid", placeItems: "center", background: "#000", color: "#fff" }}>
        <p style={{ fontFamily: "monospace", letterSpacing: "0.2em", fontSize: 12 }}>ENTERING {label}…</p>
      </div>
    );
  };
}

/**
 * Alternate-reality renderers, code-split per reality so no visitor
 * downloads realities they never enter (performance requirement).
 * Export names must match: {World}{Reality} in each world's file.
 */
const R: Record<string, Record<string, ComponentType>> = {
  casa: {
    spatial: dynamic(() => import("@/components/worlds/casa-spatial").then((m) => m.CasaSpatial), { loading: loading("SPATIAL") }),
    "oceanic": dynamic(() => import("@/rb15w/Casa").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function CasaOceanic() { return <C reality="oceanic" />; } };
    }), { loading: loading("OCEANIC") }),

    "brutalist": dynamic(() => import("@/rb15w/Casa").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function CasaBrutalist() { return <C reality="brutalist" />; } };
    }), { loading: loading("BRUTALIST") }),
    "japanese": dynamic(() => import("@/rb15w/Casa").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function CasaJapanese() { return <C reality="japanese" />; } };
    }), { loading: loading("JAPANESE") }),
  },
  noir: {
    "editorial": dynamic(() => import("@/rb15w/Noir").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function NoirEditorial() { return <C reality="editorial" />; } };
    }), { loading: loading("EDITORIAL") }),
    "archive": dynamic(() => import("@/rb15w/Noir").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function NoirArchive() { return <C reality="archive" />; } };
    }), { loading: loading("ARCHIVE") }),
    "showroom": dynamic(() => import("@/rb15w/Noir").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function Noir3DShowroom() { return <C reality="showroom" />; } };
    }), { loading: loading("3D SHOWROOM") }),
  },
  orbit: {
    "console": dynamic(() => import("@/rb15w/Orbit").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function OrbitConsole() { return <C reality="console" />; } };
    }), { loading: loading("CONSOLE") }),
    "paper": dynamic(() => import("@/rb15w/Orbit").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function OrbitPaper() { return <C reality="paper" />; } };
    }), { loading: loading("PAPER") }),
    "light": dynamic(() => import("@/rb54w/Orbit").then((m) => {
      const C = m.default as ComponentType<{ reality: string; world?: unknown }>;
      return { default: function OrbitConsoleII54() { return <C reality="light" />; } };
    }), { loading: loading("CONSOLE II") }),
    "terminal": dynamic(() => import("@/rb54w/Orbit").then((m) => {
      const C = m.default as ComponentType<{ reality: string; world?: unknown }>;
      return { default: function OrbitTerminal54() { return <C reality="terminal" />; } };
    }), { loading: loading("TERMINAL") }),
  },
  still: {
    "gallery": dynamic(() => import("@/rb15w/Still").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function StillGallery() { return <C reality="gallery" />; } };
    }), { loading: loading("GALLERY") }),
    "contact": dynamic(() => import("@/rb15w/Still").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function StillContactsheet() { return <C reality="contact" />; } };
    }), { loading: loading("CONTACT SHEET") }),
    "hall": dynamic(() => import("@/rb15w/Still").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function StillVirtualhall() { return <C reality="hall" />; } };
    }), { loading: loading("VIRTUAL HALL") }),
  },
  signal: {
    "arcade": dynamic(() => import("@/rb15w/Signal").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function SignalArcade() { return <C reality="arcade" />; } };
    }), { loading: loading("ARCADE") }),
    "ink": dynamic(() => import("@/rb15w/Signal").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function SignalInk() { return <C reality="ink" />; } };
    }), { loading: loading("INK") }),
    "neon": dynamic(() => import("@/rb54w/Signal").then((m) => {
      const C = m.default as ComponentType<{ reality: string; world?: unknown }>;
      return { default: function SignalNeon54() { return <C reality="arcade" />; } };
    }), { loading: loading("NEON") }),
    "vector": dynamic(() => import("@/rb54w/Signal").then((m) => {
      const C = m.default as ComponentType<{ reality: string; world?: unknown }>;
      return { default: function SignalVector54() { return <C reality="vector" />; } };
    }), { loading: loading("VECTOR") }),
  },
  objects: {
    "workshop": dynamic(() => import("@/rb15w/Objects").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function ObjectsWorkshop() { return <C reality="workshop" />; } };
    }), { loading: loading("WORKSHOP") }),
    "inspect": dynamic(() => import("@/rb15w/Objects").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function Objects3DShelf() { return <C reality="inspect" />; } };
    }), { loading: loading("3D SHELF") }),
    "shelf": dynamic(() => import("@/rb54w/Objects").then((m) => {
      const C = m.default as ComponentType<{ reality: string; world?: unknown }>;
      return { default: function ObjectsShelf54() { return <C reality="shelf" />; } };
    }), { loading: loading("SHELF") }),
  },
  archive: {
  },
  motion: {
    "stage": dynamic(() => import("@/rb15w/Motion").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function MotionStage() { return <C reality="stage" />; } };
    }), { loading: loading("STAGE") }),
    "dopesheet": dynamic(() => import("@/rb15w/Motion").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function MotionDopesheet() { return <C reality="dopesheet" />; } };
    }), { loading: loading("DOPESHEET") }),
  },
  void: {
    "particles": dynamic(() => import("@/rb15w/Void").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function VoidParticles() { return <C reality="particles" />; } };
    }), { loading: loading("PARTICLES") }),
    "liquid": dynamic(() => import("@/rb15w/Void").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function VoidLiquid() { return <C reality="liquid" />; } };
    }), { loading: loading("LIQUID") }),
    "gravity": dynamic(() => import("@/rb15w/Void").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function VoidGravity() { return <C reality="gravity" />; } };
    }), { loading: loading("GRAVITY") }),
    "shader": dynamic(() => import("@/rb15w/Void").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function VoidShader() { return <C reality="shader" />; } };
    }), { loading: loading("SHADER") }),
    "space": dynamic(() => import("@/rb15w/Void").then((m) => {
      const C = m.default as ComponentType<{ reality: string }>;
      return { default: function Void3D() { return <C reality="space" />; } };
    }), { loading: loading("3D") }),
    "dust": dynamic(() => import("@/rb54w/Void").then((m) => {
      const C = m.default as ComponentType<{ reality: string; world?: unknown }>;
      return { default: function VoidDust54() { return <C reality="dust" />; } };
    }), { loading: loading("DUST") }),
    "glyphs": dynamic(() => import("@/rb54w/Void").then((m) => {
      const C = m.default as ComponentType<{ reality: string; world?: unknown }>;
      return { default: function VoidGlyphs54() { return <C reality="glyphs" />; } };
    }), { loading: loading("GLYPHS") }),
    "ink": dynamic(() => import("@/rb54w/Void").then((m) => {
      const C = m.default as ComponentType<{ reality: string; world?: unknown }>;
      return { default: function VoidInk54() { return <C reality="ink" />; } };
    }), { loading: loading("INK") }),
  },
  atlas: {
  },
  forge: {
  },
  pulse: {
  },
  civic: {
  },
  nest: {
  },
  vector: {
  },
};


export function getRenderer(world: string, reality: string): ComponentType | null {
  return R[world]?.[reality] ?? null;
}
