"use client";
import { useEffect, useRef, useState } from "react";

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

export default function Shader() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    const cv = ref.current!;
    const gl = cv.getContext("webgl");
    if (!gl) { setErr("WebGL is not available on this device. Try the Particles or Liquid reality."); return; }
    const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { setErr(gl.getShaderInfoLog(o) ?? "Shader error"); } return o; };
    const pr = gl.createProgram()!; gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const m = { x: 0, y: 0, press: 0, target: 0 };
    const size = () => { const d = Math.min(window.devicePixelRatio, 1.5) * 0.75; cv.width = cv.clientWidth * d; cv.height = cv.clientHeight * d; gl.viewport(0, 0, cv.width, cv.height); m.x = cv.width / 2; m.y = cv.height / 2; };
    size();
    const mv = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); m.x = ((e.clientX - r.left) / r.width) * cv.width; m.y = (1 - (e.clientY - r.top) / r.height) * cv.height; };
    const dn = () => (m.target = 1), up = () => (m.target = 0);
    cv.addEventListener("pointermove", mv); cv.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up); window.addEventListener("resize", size);
    let raf = 0; const t0 = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (n: number) => { m.press += (m.target - m.press) * 0.1; gl.uniform2f(U("u_res"), cv.width, cv.height); gl.uniform1f(U("u_time"), reduce ? 2 : (n - t0) / 1000); gl.uniform2f(U("u_mouse"), m.x, m.y); gl.uniform1f(U("u_press"), m.press); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); cv.removeEventListener("pointermove", mv); cv.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); window.removeEventListener("resize", size); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, []);
  if (err) return <div role="alert" className="flex h-full items-center justify-center p-8 text-center text-sm">{err}</div>;
  return <canvas ref={ref} className="block h-full w-full touch-none" role="img" aria-label="Interactive GLSL fragment shader. Move the pointer to distort the field, press to intensify." />;
}
