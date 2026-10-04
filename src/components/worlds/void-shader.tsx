"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Field } from "@/lib/three";
import * as THREE from "three";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { Orbit, RoomEnv, Stage3D } from "@/lib/three";

const VS = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
const FS = `precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_press;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ s+=a*n(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return s; }
void main(){
  vec2 uv = (gl_FragCoord.xy*2.-u_res)/min(u_res.x,u_res.y);
  vec2 m = (u_mouse*2.-u_res)/min(u_res.x,u_res.y);
  float d = length(uv-m);
  vec2 dir = normalize(uv-m+1e-4);
  uv += dir * (0.18 + u_press*0.3) * exp(-d*2.2) * sin(d*14. - u_time*3.);
  vec2 q = vec2(fbm(uv+u_time*.05), fbm(uv+vec2(5.2,1.3)-u_time*.04));
  vec2 r = vec2(fbm(uv+3.*q+vec2(1.7,9.2)+u_time*.12), fbm(uv+3.*q+vec2(8.3,2.8)-u_time*.1));
  float f = fbm(uv+3.*r);
  vec3 c = mix(vec3(.02,.0,.08), vec3(.48,.36,1.), clamp(f*f*2.4,0.,1.));
  c = mix(c, vec3(.1,.95,.9), clamp(length(q)*.55*f,0.,1.)*.75);
  c += vec3(.6,.4,1.) * exp(-d*4.) * (.25 + u_press*.6);
  c *= 1.1 - .4*length(uv*.45);
  gl_FragColor = vec4(c,1.);
}`;

function ShaderCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl");
    if (!gl) {
      queueMicrotask(() => setErr("WebGL is not available on this device. Try the particles or field instead."));
      return;
    }
    const sh = (t: number, s: string) => {
      const o = gl.createShader(t)!;
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) {
        queueMicrotask(() => setErr(gl.getShaderInfoLog(o) ?? "Shader error"));
      }
      return o;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const m = { x: 0, y: 0, press: 0, target: 0 };
    const size = () => {
      const d = Math.min(window.devicePixelRatio, 1.5) * 0.75;
      cv.width = cv.clientWidth * d;
      cv.height = cv.clientHeight * d;
      gl.viewport(0, 0, cv.width, cv.height);
      m.x = cv.width / 2;
      m.y = cv.height / 2;
    };
    size();
    const mv = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      m.x = ((e.clientX - r.left) / r.width) * cv.width;
      m.y = (1 - (e.clientY - r.top) / r.height) * cv.height;
    };
    const dn = () => { m.target = 1; };
    const up = () => { m.target = 0; };
    cv.addEventListener("pointermove", mv);
    cv.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    window.addEventListener("resize", size);
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      m.press += (m.target - m.press) * 0.1;
      gl.uniform2f(U("u_res"), cv.width, cv.height);
      gl.uniform1f(U("u_time"), (performance.now() - t0) / 1000);
      gl.uniform2f(U("u_mouse"), m.x, m.y);
      gl.uniform1f(U("u_press"), m.press);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointermove", mv);
      cv.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("resize", size);
    };
  }, []);
  return (
    <div style={{ position: "relative", height: "62vh", minHeight: 420, border: "1px solid rgba(191,227,255,0.3)" }}>
      {err ? (
        <p style={{ padding: 24 }}>{err}</p>
      ) : (
        <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }} aria-label="Domain-warped shader field. Move to stir, press to charge." />
      )}
      <p style={{ position: "absolute", left: 12, bottom: 8, fontSize: 11, letterSpacing: "0.2em", margin: 0 }}>MOVE TO STIR · PRESS TO CHARGE</p>
    </div>
  );
}

export function VoidShader() {
  return (
    <div style={{ background: "#050508", color: "#bfe3ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="void" label="Room 09 · VOID/SHADER" />
      <VoidNav current="shader" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>FIVE OCTAVES · COMPILED LIVE · NO TEXTURES</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0 20px" }}>SHADER</h1>
        <ShaderCanvas />
        <p style={{ fontSize: "0.85rem", color: "#5f7f99", marginTop: 12 }}>
          Fractional Brownian motion, domain-warped twice, charged by your pointer. The GPU does in parallel what particles do in sequence.
        </p>
      </div>
      <WorldProof
        proves="GLSL as a reality: the same void, computed per-pixel instead of per-particle."
        relatedHref="/worlds/signal"
        relatedName="SIGNAL"
      />
    </div>
  );
}

export function VoidSpace() {
  const [mode, setMode] = useState<"repel" | "attract">("repel");
  return (
    <div style={{ background: "#000", color: "#bfe3ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="void" label="Room 09 · VOID/SPACE" />
      <VoidNav current="space" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>400 BODIES · ONE FIELD · YOUR POINTER IS GRAVITY</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0 20px" }}>SPACE</h1>
        <div style={{ height: "62vh", minHeight: 420, border: "1px solid rgba(191,227,255,0.3)" }}>
          <Stage3D bg="#000" camera={[0, 0, 9]} label="3D particle volume. Move the pointer to push or pull the particles.">
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 0, 6]} intensity={30} color="#b6a4ff" />
            <Field n={400} mode={mode} />
          </Stage3D>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {(["repel", "attract"] as const).map((x) => (
            <button
              key={x}
              type="button"
              aria-pressed={mode === x}
              onClick={() => setMode(x)}
              style={{
                border: "1px solid rgba(191,227,255,0.4)",
                background: mode === x ? "#bfe3ff" : "transparent",
                color: mode === x ? "#000" : "#bfe3ff",
                padding: "10px 20px",
                fontSize: 12,
                letterSpacing: "0.15em",
              }}
            >
              {x.toUpperCase()}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "0.85rem", color: "#5f7f99" }}>Four hundred instanced bodies, one gravity you control. Push, then pull.</p>
      </div>
      <WorldProof
        proves="Volume as interface: depth you can push around, not a backdrop."
        relatedHref="/worlds/nest"
        relatedName="NEST"
      />
    </div>
  );
}

export function VoidNav({ current }: { current: string }) {
  return (
    <nav aria-label="VOID realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#020610", color: "#bfe3ff", borderBottom: "1px solid rgba(191,227,255,0.3)", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/void" style={{ padding: "12px 8px", letterSpacing: "0.25em", fontSize: 12, fontWeight: 800 }}>
        VOID◌
      </Link>
      {[
        ["classic", "Void", "/worlds/void"],
        ["abyss", "Abyss", "/worlds/void/abyss"],
        ["ink", "Ink", "/worlds/void/ink"],
        ["reactor", "Reactor", "/worlds/void/reactor"],
        ["orbit", "Orbit", "/worlds/void/orbit"],
        ["field", "Field", "/worlds/void/field"],
        ["shader", "Shader", "/worlds/void/shader"],
        ["space", "Space", "/worlds/void/space"],
      ].map(([id, label, href]) => (
        <Link
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: current === id ? "#020610" : "#bfe3ff",
            background: current === id ? "#bfe3ff" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
