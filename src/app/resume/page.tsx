"use client";

import { useState } from "react";

const EMAIL = "ibskhan2025@gmail.com";

const skills = [
  "Next.js / React",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "REST APIs",
  "Git & GitHub",
  "Vercel / Deployments",
  "Responsive UI",
  "Framer Motion",
];

export default function ResumePage() {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="resume-page">
      <div className="resume-actions">
        <button className="btn" type="button" onClick={() => window.print()}>
          Print / Save PDF
        </button>
        <button className="btn ghost resume-ghost" type="button" onClick={copyEmail}>
          {copied ? "Copied" : "Copy email"}
        </button>
      </div>

      <main className="resume-sheet" aria-label="Resume of Ibrahim F Khan">
        <header className="resume-head">
          <div>
            <h1>Ibrahim F Khan</h1>
            <p className="resume-role">Freelance Full-Stack Developer</p>
            <p className="resume-pill" aria-live="polite">
              <span className="resume-dot" aria-hidden /> Available for new projects · replies within 24h
            </p>
          </div>
          <ul className="resume-contact">
            <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><a href="https://instagram.com/Ibrahim_f_khan.ak" target="_blank" rel="noreferrer">Instagram · @Ibrahim_f_khan.ak</a></li>
          </ul>
        </header>

        <section aria-label="Summary">
          <h2>Summary</h2>
          <p>
            Freelancing entrepreneur building full-stack websites, web apps, apps and software end to end —
            from interface and database to deployment. I take client ideas from a rough brief to a working,
            hosted product.
          </p>
        </section>

        <section aria-label="Services and pricing">
          <h2>Services · fixed quote upfront</h2>
          <div className="resume-cards">
            <div className="resume-card">
              <strong>Landing / business site</strong>
              <span className="resume-price">from $99</span>
              <p>Design, copy polish, contact form, domain + launch. Live in days, not months.</p>
            </div>
            <div className="resume-card">
              <strong>Web app / store</strong>
              <span className="resume-price">from $399</span>
              <p>Auth, database, dashboard or cart, admin basics. Built to hand over clean.</p>
            </div>
            <div className="resume-card">
              <strong>Fix / upgrade / care</strong>
              <span className="resume-price">from $29</span>
              <p>Speed up, de-bug, redesign or add features to your existing site or app.</p>
            </div>
          </div>
          <p className="resume-note">No hourly-billing surprises: you approve a fixed quote before I start.</p>
        </section>

        <section aria-label="Skills">
          <h2>Working stack</h2>
          <ul className="resume-tags">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section aria-label="Experience">
          <h2>Experience</h2>
          <div className="resume-item">
            <div className="resume-item-head">
              <strong>Freelance Full-Stack Developer — Independent</strong>
              <span>Ongoing</span>
            </div>
            <ul>
              <li>Design and ship full-stack websites and web apps for clients, solo, from brief to launch.</li>
              <li>Build with Next.js + TypeScript + PostgreSQL: auth, databases, payments-ready backends, responsive UI.</li>
              <li>Handle deployment, domains and handover so non-technical clients get a product, not a repo.</li>
            </ul>
          </div>
        </section>

        <section aria-label="Selected work">
          <h2>Selected work</h2>
          <div className="resume-item">
            <div className="resume-item-head">
              <strong>WASP — 15-world studio site</strong>
              <span>Next.js · TypeScript · PostgreSQL</span>
            </div>
            <ul>
              <li>Fifteen interactive worlds: stores with carts, bookings, dashboards, games, publications.</li>
              <li>Real backends: validated APIs, server-side pricing, rate limits, Postgres persistence.</li>
            </ul>
          </div>
          <p className="resume-note">Further client work available on request — ask me what I&apos;ve shipped lately.</p>
        </section>

        <section aria-label="How I work">
          <h2>How I work</h2>
          <ol className="resume-steps">
            <li><strong>01 — Message me.</strong> Email or Instagram DM, one para on what you need.</li>
            <li><strong>02 — Fixed quote.</strong> Scope + price + timeline in writing within 48 hours.</li>
            <li><strong>03 — Build + launch.</strong> Weekly demos, then domain, deploy and handover.</li>
          </ol>
          <ul>
            <li>Fixed scope, plain language, weekly demos — no disappearing act.</li>
            <li>Code you can hand to another dev: typed, reviewed, documented.</li>
          </ul>
        </section>

        <section className="resume-cta" aria-label="Hire me">
          <div>
            <h2>Have something to build?</h2>
            <p>One message is enough to start. I reply within 24 hours.</p>
          </div>
          <div className="resume-cta-btns">
            <a className="btn resume-btn-dark" href={`mailto:${EMAIL}?subject=Project%20enquiry`}>Email me</a>
            <a className="btn ghost resume-ghost" href="https://ig.me/m/Ibrahim_f_khan.ak" target="_blank" rel="noreferrer">Instagram DM</a>
          </div>
        </section>
      </main>

      <div className="resume-sticky" role="navigation" aria-label="Quick contact">
        <span>Available now · 24h reply</span>
        <a href={`mailto:${EMAIL}?subject=Project%20enquiry`}>Hire me</a>
      </div>
    </div>
  );
}
