# Hero Section Rebuild Handoff (Full Context)

## Goal
Recreate the hero pixel keyvisual behavior using the provided reference animation script, integrated into this Next.js app.

This handoff includes:
1. Current project/runtime context
2. Current homepage code (exact)
3. Current pixel animation component code (exact)
4. Relevant current CSS block (exact excerpt)
5. Reference script to implement (verbatim from user)
6. Practical implementation checklist and acceptance criteria

## Project Context
- Framework: Next.js App Router + React + TypeScript
- Styling: global CSS in app/globals.css
- Commands:
  - dev: npm run dev -- --port 4000
  - build: npm run build

### package.json (exact)
```json
{
  "name": "nexaflow-ai-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "seed": "tsx --env-file=.env.local scripts/seed.ts",
    "create-admin": "tsx --env-file=.env.local scripts/create-admin.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "latest",
    "@react-three/drei": "latest",
    "@react-three/fiber": "latest",
    "bcryptjs": "latest",
    "framer-motion": "latest",
    "jose": "latest",
    "lucide-react": "latest",
    "mongoose": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-hook-form": "latest",
    "sanitize-html": "latest",
    "three": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "latest",
    "@types/bcryptjs": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@types/sanitize-html": "latest",
    "@types/three": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "tailwindcss": "latest",
    "tsx": "latest",
    "typescript": "latest"
  },
  "overrides": { "postcss": "^8.5.10" }
}
```

## Current Homepage Code (exact)
File: app/page.tsx
```tsx
import { ArrowDownRight, ArrowRight, CircleDot, CornerDownRight, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { AutomationCommand } from "@/components/AutomationCommand";
import { WorkflowVisualizer } from "@/components/WorkflowVisualizer";
import { ServiceGrid } from "@/components/ServiceGrid";
import { ProjectCards } from "@/components/ProjectCards";
import { TechSignal } from "@/components/TechSignal";
import { ContactForm } from "@/components/ContactForm";
import { AIAssistant } from "@/components/AIAssistant";
import { ProcessFlow } from "@/components/ProcessFlow";
import { SystemConstellation } from "@/components/SystemConstellation";
import { SiteEffects } from "@/components/SiteEffects";
import { processSteps } from "@/lib/content";

const metrics = [["50+", "workflows engineered"], ["20+", "projects delivered"], ["15+", "platforms connected"], ["08", "agents in one ecosystem"]];

export default function Home() {
  return <main className="os-page">
    <Navigation />
    <section id="home" className="os-hero pixel-hero">
      <div className="shell pixel-hero-head">
        <div className="pixel-title-block"><div className="os-kicker"><span className="os-live-dot" />MEHEDI / AI AUTOMATION DEVELOPER</div><h1>SYSTEMS,<br /><span>ENGINEERED.</span></h1></div>
        <div className="pixel-hero-deck"><h2>AN AI AUTOMATION PARTNER FOR MODERN OPERATIONS</h2><div><span className="pixel-mini-mark">M</span><p>I design agents, workflows and digital products that turn fragmented work into dependable operating systems.</p></div></div>
      </div>
      <div className="shell pixel-hero-foot"><p>Automation should feel less like another tool-and more like the business finally moving as one.</p><div><div className="os-hero-actions"><a href="#projects" className="os-action-primary">Explore deployments <ArrowDownRight size={17} /></a><a href="#playground" className="os-action-ghost"><span className="os-play">▶</span> Test my workflow</a></div><AutomationCommand /></div></div>
    </section>
    <section className="os-marquee" aria-label="Core capabilities"><div>AI AGENTS <i>✦</i> N8N WORKFLOWS <i>✦</i> API SYSTEMS <i>✦</i> SAAS PRODUCTS <i>✦</i> CRM AUTOMATION <i>✦</i> AI AGENTS <i>✦</i> N8N WORKFLOWS <i>✦</i></div></section>

    <section id="about" className="section os-about"><div className="shell">
      <div className="os-section-head"><span>01 / IDENTITY</span><h2>Not an agency.<br />One builder, end to end.</h2><p>I translate business friction into systems that are useful, observable and maintainable-from the first architecture sketch to production deployment.</p></div>
      <div className="os-profile-grid">
        <article className="os-profile-card os-profile-main"><div className="os-card-label">PROFILE.LOG</div><h3>From workflow builder<br />to systems architect.</h3><p>Over 2+ years I’ve moved from connecting individual tools to designing coordinated AI agents, customer lifecycle engines and client-facing platforms.</p><div className="os-signature">MEHEDI <span>×</span> INDEPENDENT BUILDER</div></article>
        <article className="os-profile-card"><div className="os-card-label">I THINK IN</div>{["Inputs", "Decisions", "Connections", "Failure paths", "Outcomes"].map((item, index) => <div className="os-thinking-row" key={item}><span>0{index + 1}</span>{item}<CornerDownRight size={15} /></div>)}</article>
        <article className="os-profile-card os-profile-quote"><Sparkles size={22} /><blockquote>“The best automation feels less like software-and more like the business finally breathing.”</blockquote><small>MY BUILDING PRINCIPLE</small></article>
      </div>
    </div></section>

    <section id="projects" className="section os-projects"><div className="shell"><div className="os-section-head os-section-head-row"><div><span>02 / SELECTED WORK</span><h2>Systems I’ve<br />put into motion.</h2></div><p>Three projects. Three different operating models. Each one designed around the real business-not a generic template.</p></div><ProjectCards /></div></section>

    <section id="playground" className="section os-playground"><div className="shell"><div className="os-playground-head"><div><span className="os-terminal-dot" /> LIVE PLAYGROUND</div><h2>Open the system.<br /><em>Trace the logic.</em></h2><p>Click through a lead-to-booking workflow to see how I connect tools, intelligence and outcomes.</p></div><WorkflowVisualizer /></div></section>

    <section id="services" className="section os-services"><div className="shell"><div className="os-section-head os-section-head-row"><div><span>03 / CAPABILITIES</span><h2>What I can<br />build with you.</h2></div><div className="os-head-note"><Radio size={17} />Available for freelance, contract<br />and selected full-time roles.</div></div><ServiceGrid /></div></section>

    <section className="os-metrics"><div className="shell os-metric-grid">{metrics.map(([value, label], index) => <div className="os-metric" key={label}><small>0{index + 1}</small><strong>{value}</strong><span>{label}</span></div>)}</div><p className="shell os-estimate-note">Portfolio indicators · editable estimates where noted in the case studies</p></section>

    <section id="technology" className="section os-technology"><div className="shell">
      <div className="os-section-head os-section-head-row"><div><span>04 / TOOL SIGNAL</span><h2>Technology is<br />a design decision.</h2></div><p>I choose tools for reliability, fit and ownership-not because they happen to be trending.</p></div>
      <TechSignal />
      <div className="constellation-intro"><span>SYSTEM INTELLIGENCE / LIVE</span><h3>Signals enter messy.<br />Decisions leave verified.</h3><p>Move through the field or inspect a stage. The system separates truth, skills, output and validation instead of hiding everything inside one black box.</p></div>
      <SystemConstellation />
    </div></section>

    <section id="process" className="section os-process"><div className="shell">
      <div className="process-section-head"><span>05 / EXECUTION</span><h2>From chaos to a system<br />that can keep moving.</h2><p>The blue field begins loose and unpredictable. By the other side, it has become a visible, testable operating rhythm.</p></div>
      <ProcessFlow />
      <div className="os-process-layout"><div className="os-process-intro"><span>THE WORK BEHIND THE MOTION</span><h2>How ideas become dependable systems.</h2><p>Clear stages, visible decisions, fewer surprises.</p><a href="#contact">Bring me a messy process <ArrowRight size={15} /></a></div><ol className="os-process-list">{processSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step}</h3><CircleDot size={17} /></li>)}</ol></div>
    </div></section>

    <section id="contact" className="section os-contact"><div className="shell os-contact-layout"><div className="os-contact-copy"><div className="os-kicker"><span className="os-live-dot" />READY FOR A NEW SYSTEM</div><h2>Let’s remove the work<br />that shouldn’t be manual.</h2><p>Project, contract, collaboration or role-tell me what is slowing the business down. I’ll personally review it.</p><div className="os-contact-trust"><ShieldCheck size={18} />Your details stay private and are only used to reply.</div></div><ContactForm /></div></section>

    <footer className="os-footer"><div className="shell"><div className="os-footer-mark">M<span>/AI</span></div><div>MEHEDI · AI AUTOMATION DEVELOPER</div><div>© {new Date().getFullYear()} MEHEDI / AI</div><a href="#home">BACK TO TOP ↑</a></div></footer>
    <SiteEffects />
    <AIAssistant />
  </main>;
}
```

## Current Pixel Field Component (exact, currently not mounted)
File: components/InteractiveSignalField.tsx
```tsx
"use client";

import { useEffect, useRef } from "react";

type Shockwave = { x: number; y: number; radius: number; strength: number };

const cell = 9;
const brush = 10;
const palette = ["#1c2541", "#3b5bd9", "#f5c518", "#e0492a", "#d8ff00"];

function hash(value: number) {
  const result = Math.sin(value * 12.9898) * 43758.5453;
  return result - Math.floor(result);
}

function smoothstep(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function heatColor(value: number) {
  if (value > 1.02) return palette[4];
  if (value > .76) return palette[3];
  if (value > .49) return palette[2];
  if (value > .22) return palette[1];
  return palette[0];
}

export function InteractiveSignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = fieldRef.current;
    if (!canvas || !root) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const ctx = context;
    const canvasElement = canvas;
    const rootElement = root;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let dpr = 1;
    let heat = new Float32Array(0);
    let base = new Float32Array(0);
    let tone = new Uint8Array(0);
    let animationFrame = 0;
    let visible = true;
    let lastFrame = performance.now();
    let autoPhase = Math.random() * Math.PI * 2;
    const shocks: Shockwave[] = [];
    const pointer = {
      x: 0, y: 0, renderX: 0, renderY: 0,
      previousX: 0, previousY: 0,
      inside: false, moved: false,
      lastMove: performance.now(), pressedAt: 0,
    };

    function seedField() {
      heat = new Float32Array(columns * rows);
      base = new Float32Array(columns * rows);
      tone = new Uint8Array(columns * rows);

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
          const x = col / Math.max(1, columns - 1);
          const y = row / Math.max(1, rows - 1);
          const wave = .24 + Math.sin(col * .095) * .055 + Math.sin(col * .027 + 1.7) * .09;
          const canopy = 1 - smoothstep((y - wave + .04) / .17);
          const granular = hash(col * 5.31 + row * 19.17);
          const ragged = hash(col * 1.73 + row * 7.91) > (.28 + y * .72);
          const edgeBand = Math.max(0, 1 - Math.abs(y - wave) / .19);

          if ((canopy > .06 && ragged) || (edgeBand > .45 && granular > .76)) {
            const index = row * columns + col;
            base[index] = Math.min(1, canopy * (.56 + granular * .7) + edgeBand * .24);
            if (x < .17 || x > .86) tone[index] = granular > .76 ? 3 : 2;
            else if (granular > .79) tone[index] = 0;
            else tone[index] = 1;
          }
        }
      }
    }

    function resize() {
      const rect = rootElement.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      columns = Math.ceil(width / cell) + 1;
      rows = Math.ceil(height / cell) + 1;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasElement.width = Math.round(width * dpr);
      canvasElement.height = Math.round(height * dpr);
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointer.x = pointer.renderX = width * .58;
      pointer.y = pointer.renderY = height * .66;
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
      seedField();
    }

    function deposit(x: number, y: number, strength = 1, radius = brush) {
      const centerCol = Math.round(x / cell);
      const centerRow = Math.round(y / cell);
      const radiusSquared = radius * radius;
      for (let oy = -radius; oy <= radius; oy += 1) {
        const row = centerRow + oy;
        if (row < 0 || row >= rows) continue;
        for (let ox = -radius; ox <= radius; ox += 1) {
          const col = centerCol + ox;
          if (col < 0 || col >= columns) continue;
          const distanceSquared = ox * ox + oy * oy;
          if (distanceSquared > radiusSquared) continue;
          const energy = Math.exp(-distanceSquared / Math.max(1, radiusSquared * .25)) * strength;
          const index = row * columns + col;
          heat[index] = Math.min(1.32, heat[index] + energy);
        }
      }
    }

    function stroke(fromX: number, fromY: number, toX: number, toY: number, strength = .72) {
      const distance = Math.hypot(toX - fromX, toY - fromY);
      const steps = Math.max(1, Math.ceil(distance / Math.max(3, cell * .7)));
      for (let step = 0; step <= steps; step += 1) {
        const progress = step / steps;
        deposit(fromX + (toX - fromX) * progress, fromY + (toY - fromY) * progress, strength);
      }
    }

    function triggerShock(x: number, y: number, strength: number) {
      shocks.push({ x, y, radius: cell * 2, strength });
      deposit(x, y, Math.min(1.32, strength * 1.25), Math.round(brush * 1.35));
    }

    function drawPixel(x: number, y: number, color: string, alpha = 1, size = cell - 1) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x / cell) * cell, Math.round(y / cell) * cell, size, size);
    }

    function drawCursor(now: number) {
      if (!pointer.inside || coarsePointer) return;
      const idle = now - pointer.lastMove > 1500;
      const cx = Math.round(pointer.renderX / cell) * cell;
      const cy = Math.round(pointer.renderY / cell) * cell;

      if (idle) {
        const pacman = [
          [-2, -2], [-1, -2], [0, -2], [1, -2],
          [-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1],
          [-3, 0], [-2, 0], [-1, 0], [0, 0],
          [-3, 1], [-2, 1], [-1, 1], [0, 1], [1, 1],
          [-2, 2], [-1, 2], [0, 2], [1, 2],
        ];
        pacman.forEach(([x, y]) => drawPixel(cx + x * cell, cy + y * cell, palette[2], .98));
        drawPixel(cx - cell, cy - cell, palette[0], 1);
        if (Math.sin(now * .012) > 0) drawPixel(cx + cell, cy, palette[2], 1);
        for (let pellet = 3; pellet < 8; pellet += 2) drawPixel(cx + pellet * cell, cy, palette[1], .75, Math.max(2, cell - 3));
        return;
      }

      for (let y = -4; y <= 4; y += 1) {
        for (let x = -4; x <= 4; x += 1) {
          const distance = Math.hypot(x, y);
          if (distance > 4.2 || distance < 1.1) continue;
          const color = distance < 2.05 ? palette[4] : distance < 3.05 ? palette[2] : distance < 3.7 ? palette[3] : palette[0];
          drawPixel(cx + x * cell, cy + y * cell, color, .98, cell - 1);
        }
      }
      drawPixel(cx, cy, palette[4], 1, cell - 1);
    }

    function draw(now: number) {
      animationFrame = window.requestAnimationFrame(draw);
      if (!visible) return;
      const delta = Math.min(40, Math.max(8, now - lastFrame));
      lastFrame = now;
      ctx.clearRect(0, 0, width, height);

      autoPhase += delta * .0008;
      const autoX = width * (.5 + Math.sin(autoPhase * .8) * .38);
      const autoY = height * (.52 + Math.cos(autoPhase * 1.25) * .2);
      if (!pointer.inside || now - pointer.lastMove > 1500) {
        pointer.x += (autoX - pointer.x) * .025;
        pointer.y += (autoY - pointer.y) * .025;
      }

      if (coarsePointer && !reducedMotion) {
        const nextX = width * (.5 + Math.sin(autoPhase * .73) * .36);
        const nextY = height * (.63 + Math.sin(autoPhase * 1.43) * .18);
        stroke(pointer.previousX, pointer.previousY, nextX, nextY, .2);
        pointer.previousX = nextX;
        pointer.previousY = nextY;
      } else {
        pointer.renderX += (pointer.x - pointer.renderX) * .22;
        pointer.renderY += (pointer.y - pointer.renderY) * .22;
      }

      for (let index = shocks.length - 1; index >= 0; index -= 1) {
        const shock = shocks[index];
        shock.radius += delta * .22 * shock.strength;
        shock.strength *= .956;
        const samples = Math.max(20, Math.round(shock.radius / 3));
        for (let sample = 0; sample < samples; sample += 1) {
          const angle = sample / samples * Math.PI * 2;
          deposit(shock.x + Math.cos(angle) * shock.radius, shock.y + Math.sin(angle) * shock.radius, shock.strength * .28, 2);
        }
        if (shock.strength < .08 || shock.radius > Math.max(width, height)) shocks.splice(index, 1);
      }

      const decay = Math.pow(.892, delta / 16.67);
      const cursorRadius = brush * cell * 1.28;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
          const index = row * columns + col;
          const energy = heat[index];
          const foundation = base[index];
          heat[index] *= decay;
          if (energy < .025 && foundation < .04) continue;

          let x = col * cell;
          let y = row * cell;
          if (pointer.inside && foundation > .04 && !coarsePointer) {
            const dx = x - pointer.renderX;
            const dy = y - pointer.renderY;
            const distance = Math.hypot(dx, dy) || 1;
            if (distance < cursorRadius) {
              const force = Math.pow(1 - distance / cursorRadius, 2) * cell * brush * .55;
              x += dx / distance * force;
              y += dy / distance * force;
            }
          }

          if (energy >= .025) drawPixel(x, y, heatColor(energy), Math.min(1, .28 + energy * .78));
          else if (foundation > .04) drawPixel(x, y, palette[tone[index]], Math.min(.98, .2 + foundation * .9));
        }
      }
      ctx.globalAlpha = 1;
      drawCursor(now);
    }

    function localPoint(event: PointerEvent) {
      const rect = rootElement.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const point = localPoint(event);
      pointer.x = point.x;
      pointer.y = point.y;
      pointer.inside = true;
      pointer.lastMove = performance.now();
      if (!pointer.moved) {
        pointer.previousX = point.x;
        pointer.previousY = point.y;
        pointer.renderX = point.x;
        pointer.renderY = point.y;
        pointer.moved = true;
      }
      stroke(pointer.previousX, pointer.previousY, point.x, point.y);
      pointer.previousX = point.x;
      pointer.previousY = point.y;
    }

    function onPointerEnter(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const point = localPoint(event);
      pointer.inside = true;
      pointer.x = pointer.previousX = point.x;
      pointer.y = pointer.previousY = point.y;
      pointer.renderX = point.x;
      pointer.renderY = point.y;
      pointer.lastMove = performance.now();
    }

    function onPointerLeave() {
      pointer.inside = false;
      pointer.moved = false;
      pointer.pressedAt = 0;
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      pointer.pressedAt = performance.now();
      const point = localPoint(event);
      deposit(point.x, point.y, 1.25, Math.round(brush * 1.2));
    }

    function onPointerUp(event: PointerEvent) {
      if (!pointer.pressedAt || event.pointerType === "touch") return;
      const point = localPoint(event);
      const charge = Math.min(2.1, .85 + (performance.now() - pointer.pressedAt) / 700);
      triggerShock(point.x, point.y, charge);
      pointer.pressedAt = 0;
    }

    function onDoubleClick(event: MouseEvent) {
      const rect = rootElement.getBoundingClientRect();
      triggerShock(event.clientX - rect.left, event.clientY - rect.top, 2.6);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(rootElement);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibilityObserver.observe(rootElement);
    rootElement.addEventListener("pointermove", onPointerMove, { passive: true });
    rootElement.addEventListener("pointerenter", onPointerEnter, { passive: true });
    rootElement.addEventListener("pointerleave", onPointerLeave, { passive: true });
    rootElement.addEventListener("pointerdown", onPointerDown, { passive: true });
    rootElement.addEventListener("pointerup", onPointerUp, { passive: true });
    rootElement.addEventListener("dblclick", onDoubleClick, { passive: true });
    resize();
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      rootElement.removeEventListener("pointermove", onPointerMove);
      rootElement.removeEventListener("pointerenter", onPointerEnter);
      rootElement.removeEventListener("pointerleave", onPointerLeave);
      rootElement.removeEventListener("pointerdown", onPointerDown);
      rootElement.removeEventListener("pointerup", onPointerUp);
      rootElement.removeEventListener("dblclick", onDoubleClick);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <div ref={fieldRef} className="interactive-signal-field pixel-trail-field" aria-label="Interactive pixel automation canvas">
    <canvas ref={canvasRef} aria-hidden="true" />
    <div className="signal-field-status" aria-hidden="true"><i />FIELD / LIVE</div>
    <div className="signal-field-instruction">MOVE TO DISRUPT · HOLD TO DETONATE</div>
  </div>;
}
```

## Relevant Current CSS Excerpt (exact)
File: app/globals.css
```css
.interactive-signal-field.pixel-trail-field {
    position: relative;
    z-index: 1;
    inset: auto;
    width: 100%;
    height: 440px;
    overflow: hidden;
    border-block: 1px solid #1112;
    background-color: #fbfbf8;
    background-image: linear-gradient(#1010100c 1px, transparent 1px), linear-gradient(90deg, #1010100c 1px, transparent 1px);
    background-size: 9px 9px;
    cursor: none;
    touch-action: pan-y
}

.pixel-trail-field canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%
}

.pixel-trail-field .signal-field-instruction {
    right: 24px;
    bottom: 16px;
    color: #111;
    font-size: 8px;
    background: #f7f7f4d9;
    padding: 7px 9px
}

.signal-field-status {
    position: absolute;
    left: 24px;
    bottom: 17px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    color: #202020;
    background: #f7f7f4de;
    font-size: 7px;
    letter-spacing: .18em;
    pointer-events: none
}

.signal-field-status i {
    display: block;
    width: 6px;
    height: 6px;
    background: #d8ff00;
    box-shadow: 0 0 0 3px #d8ff0030, 0 0 12px #d8ff00
}
```

## Reference Hero Script To Recreate (verbatim from user)

Use this as the source behavior blueprint. Integrate this behavior into React/Next architecture, do not just paste as-is into the page:

```js
/* ===== hero keyvisual: clouds field + neon + decode-to-real-text + detonate; clips into rounded box on scroll ===== */
(function(){
  var cv=document.getElementById('hero-kv'), hero=document.getElementById('hero'), origin=document.querySelector('.intro')||document.getElementById('origin'); if(!cv) return; var ctx=cv.getContext('2d'); if(!ctx) return;
  var DPR=Math.min(devicePixelRatio||1,2), W=0,H=0, cell=9, BRUSH=10, cols=0, rows=0, heat=null, dis=null, t=0, SEED=Math.random()*1000;
  var waves=[], shake=0, mx=-1,my=-1,hov=false, typeT=0, introT=0, RSPREAD=1.15, RLEAD=0.16, TBLOCK=6, tcols=0, trows=0;
  var LINES=['CRAFT,','ENGINEERED.'];
  var BANDS=[[0.30,'#1c2541'],[0.46,'#3b5bd9'],[0.62,'#f5c518'],[0.78,'#e0492a']];
  var tmask=document.createElement('canvas'), tmc=tmask.getContext('2d'), tfx=document.createElement('canvas'), tfc=tfx.getContext('2d');
  var smask=document.createElement('canvas'), smc=smask.getContext('2d'), sData=null, TB=null;
  function size(){ W=innerWidth; H=innerHeight; cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR); ctx.setTransform(DPR,0,0,DPR,0,0);
    tmask.width=cv.width; tmask.height=cv.height; tmc.setTransform(DPR,0,0,DPR,0,0); tfx.width=cv.width; tfx.height=cv.height; tfc.setTransform(DPR,0,0,DPR,0,0);
    cols=Math.ceil(W/cell)+1; rows=Math.ceil(H/cell)+1; heat=new Float32Array(cols*rows); dis=new Float32Array(cols*rows); smask.width=cols; smask.height=rows; }
  var lastW=innerWidth; size(); addEventListener('resize',function(){ if(innerWidth!==lastW){ lastW=innerWidth; size(); } });
  var hrTop=0, hrH=0, fhb=-1;
  var pxsafeEls=[].slice.call(document.querySelectorAll('.masthead .mh-l, .masthead .mh-r, .masthead .mh-c'));
  function hsh(c,r){ var n=Math.sin(c*127.1+r*311.7+SEED*0.13)*43758.5453; return n-Math.floor(n); }
  function base(nx,ny,tt){ var s=SEED; nx+=Math.sin(ny*5+tt*0.5+s)*0.05; ny+=Math.cos(nx*5-tt*0.4)*0.05;
    var v=Math.sin(nx*5.6+s*1.3+tt*0.3)*Math.cos(ny*4.7-s*0.7+tt*0.22)+Math.sin((nx*1.4+ny*1.7)*4.1-s+tt*0.16)+Math.sin(ny*9+s*2.1+nx*3)*0.5+Math.sin(nx*13-s*1.7)*0.28;
    return 0.5+0.5*(v/2.55); }
  function region(nx,ny,tt){ return 0.5+0.5*Math.sin(nx*2.1+tt*0.12+SEED*0.7)*Math.cos(ny*1.8-tt*0.09+SEED*0.3); }
  function dep(x,y,amt,sig){ var cc=x/cell,cr=y/cell,rad=Math.ceil(sig*1.6),inv=1/(2*sig*sig*0.18);
    for(var dr=-rad;dr<=rad;dr++)for(var dc=-rad;dc<=rad;dc++){ var c=(cc+dc)|0,r=(cr+dr)|0; if(c<0||r<0||c>=cols||r>=rows)continue;
      var dx=c+.5-cc,dy=r+.5-cr,w=Math.exp(-(dx*dx+dy*dy)*inv); if(w<.02)continue; var id=r*cols+c,vv=heat[id]+amt*w; heat[id]=vv>1?1:vv; } }
  var pmx=-1, pmy=-1, lastMove=-9, vel=0, lastZone2='', hopT=-9;
  function follow(x,y,sig){ if(pmx<0){pmx=x;pmy=y;}
    var dx=x-pmx, dy=y-pmy, dl=Math.sqrt(dx*dx+dy*dy), steps=Math.max(1,Math.min(48,Math.round(dl/(cell*0.8))));
    for(var s=1;s<=steps;s++){ var f=s/steps; dep(pmx+dx*f, pmy+dy*f, 0.16, sig); }
    pmx=x; pmy=y; }
  var ZG=[[0,0],[1,0],[2,0],[1,0.55],[0,1.1],[1,1.1],[2,1.1]];
  function pacman(cx,cy,rad,ang,mouth,val){ var c0=Math.floor((cx-rad)/cell),c1=Math.ceil((cx+rad)/cell),r0=Math.floor((cy-rad)/cell),r1=Math.ceil((cy+rad)/cell),rr=rad*rad;
    for(var r=r0;r<=r1;r++)for(var c=c0;c<=c1;c++){ if(c<0||r<0||c>=cols||r>=rows)continue; var dx=(c+.5)*cell-cx, dy=(r+.5)*cell-cy; if(dx*dx+dy*dy>rr)continue;
      var da=Math.abs((((Math.atan2(dy,dx)-ang)%(2*Math.PI))+3*Math.PI)%(2*Math.PI)-Math.PI); if(da<mouth)continue;
      var id=r*cols+c, v=val+0.03*Math.sin((c*0.7+r*0.7)-t*0.01); if(v>heat[id])heat[id]=v; } }
  var pacOn=false, pacx=0, pacy=0, pacDir=1, pacStart=0, pacAge=0, PFOOD=34;
  function wander(restx,resty,tt){
    if(!pacOn){ pacOn=true; pacDir=(restx<W*0.5)?1:-1; pacx=restx; pacy=resty; pacStart=restx; pacAge=0; PFOOD=BRUSH*3.4; }
    var rad=BRUSH*3.4;
    pacAge++; pacx += pacDir*2.6;
    if(pacx > W+rad+12 || pacx < -rad-12){
      pacDir = Math.random()<0.5?1:-1; pacy = 70 + Math.random()*(H-140); pacx = pacDir>0 ? -rad : W+rad; pacStart=pacx; pacAge=0; }
    var ang=pacDir>0?0:Math.PI;
    var pr=Math.round(pacy/cell);
    for(var k=1;k<=80;k++){ var px=pacStart + pacDir*PFOOD*k; if(px<-20||px>W+20)continue;
      if(pacDir*(px-pacx) > rad*0.7){ var pc=Math.round(px/cell); if(pc>=0&&pr>=0&&pc<cols&&pr<rows){ var pid=pr*cols+pc; if(0.72>heat[pid])heat[pid]=0.72; } } }
    var mouth=0.05+0.6*Math.abs(Math.sin(pacAge*0.16));
    pacman(pacx, pacy, rad, ang, mouth, 0.72);
  }
  var hoverSlide=null;
  function setEdge(c,r){ if(c<0||r<0||c>=cols||r>=rows)return; var id=r*cols+c;
    var w=0.5+0.5*Math.sin((c*0.8+r*0.8) - t*0.006);
    heat[id]=0.34 + w*0.56 + (hsh(c,r)-0.5)*0.12; }
  function measureType(){ var fs=Math.min((W*0.6)/2.6, H*0.165), lh=fs*0.92, cy=hrTop + hrH*0.45;
    tmc.font='400 '+fs+'px Sneak,sans-serif'; var mw=1; for(var i=0;i<LINES.length;i++){ var ww=tmc.measureText(LINES[i]).width; if(ww>mw)mw=ww; }
    TB={cx:W/2, w:mw, fs:fs, lh:lh, y0:cy-lh/2};
    tmc.clearRect(0,0,W,H); tmc.textAlign='center'; tmc.textBaseline='middle'; tmc.fillStyle='#000'; for(i=0;i<LINES.length;i++) tmc.fillText(LINES[i], W/2, TB.y0+i*lh);
    smc.setTransform(1,0,0,1,0,0); smc.clearRect(0,0,cols,rows); smc.textAlign='center'; smc.textBaseline='middle'; smc.lineJoin='round'; smc.lineWidth=3.2; smc.strokeStyle='#000'; smc.fillStyle='#000';
    for(i=0;i<LINES.length;i++){ smc.font='400 '+(fs/cell)+'px Sneak,sans-serif'; smc.strokeText(LINES[i], (W/2)/cell, (TB.y0+i*lh)/cell); smc.fillText(LINES[i], (W/2)/cell, (TB.y0+i*lh)/cell); }
    sData=smc.getImageData(0,0,cols,rows).data; }
  function clamp01(x){ return x<0?0:(x>1?1:x); }
  function clearAt(c,r,x,y){
    if(sData && sData[(r*cols+c)*4+3]>40) return 1;
    var yr=y-hrTop;
    var tl=clamp01((400-x)/150)*clamp01((220-yr)/130);
    var tr=clamp01((x-(W-360))/150)*clamp01((220-yr)/130);
    var bl=clamp01((W*0.52-x)/170)*clamp01((yr-(hrH-210))/130);
    return Math.max(tl,tr,bl); }
  function drawTypeReveal(g2,color){ if(!TB)return; var n=Math.ceil(W/TBLOCK), span=Math.max(1,n), tick=Math.floor(typeT*16), nr=Math.ceil(H/TBLOCK);
    tfc.clearRect(0,0,W,H); tfc.fillStyle=color;
    for(var c=0;c<n;c++){ var key=c/span, ra=key*RSPREAD;
      if(typeT>=ra){ tfc.fillRect(c*TBLOCK,0,TBLOCK,H); }
      else if(typeT>ra-RLEAD){ var prob=0.25+0.75*(1-(ra-typeT)/RLEAD); for(var r=0;r<nr;r++){ if(hsh(c+tick*0.7,r)<prob) tfc.fillRect(c*TBLOCK,r*TBLOCK,TBLOCK,TBLOCK); } } }
    tfc.globalCompositeOperation='destination-in'; tfc.drawImage(tmask,0,0,W,H); tfc.globalCompositeOperation='source-over'; g2.drawImage(tfx,0,0,W,H); }
  var TOUCH = !(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);
  var secOrigin=document.getElementById('origin'), secAi=document.getElementById('ai'), secContact=document.getElementById('contact'), footEl=document.querySelector('footer');
  var secProcess=document.getElementById('process'), secProto=document.getElementById('protocol'), secProtoParts=document.getElementById('protocol-parts');
  function spans(el,y){ if(!el)return false; var r=el.getBoundingClientRect(); return r.top<y && r.bottom>y; }
  function zoneOf(el){ if(!el||!el.closest) return '';
    return el.closest('#contact, footer') ? 'text'
      : el.closest('#origin') ? 'heart' : ''; }
  var hoverEls=[], groups=[], smileyEls=[], ctaMeta=null, headEls=[], headElsM=[];
  function collectTargets(){
    hoverEls=[].slice.call(document.querySelectorAll(TOUCH ? '.btn' : '.slide:first-child .csm, .slide:first-child .pv, .btn'));
    headEls=[].slice.call(document.querySelectorAll('.hero h1, .ed h2, .proc h2, .ch h2'));
    headElsM=[].slice.call(document.querySelectorAll('[data-blobarrow]'));
    groups=[];
    ['#process .donuts','#protocol-parts .donuts'].forEach(function(sel){ var h=document.querySelector(sel); if(h){ var e=[].slice.call(h.querySelectorAll('.donut')); if(e.length) groups.push({host:h,els:e,frame:true}); } });
    var two=document.querySelector('#shift .two'); if(two){ var sm=[].slice.call(two.querySelectorAll('.smiley')); if(sm.length) groups.push({host:two,els:sm,frame:false}); }
    smileyEls=[].slice.call(document.querySelectorAll('#shift .smiley')).map(function(el){ return {el:el, val: el.getAttribute('data-base')==='#3b5bd9' ? 0.56 : 1.0}; });
    ctaMeta=document.querySelector('#contact .meta');
  }
  collectTargets(); addEventListener('load',collectTargets);
  function nearestTarget(vc){ var best=null,bd=H*0.42,i,r,d; for(i=0;i<hoverEls.length;i++){ r=hoverEls[i].getBoundingClientRect(); if(r.width<2||r.bottom<0||r.top>H)continue; d=Math.abs(r.top+r.height/2-vc); if(d<bd){bd=d;best=hoverEls[i];} } return best; }
  function nearHeadline(x,y,list){ var best=null,bd=1e9,i,r,M=150; for(i=0;i<list.length;i++){ r=list[i].getBoundingClientRect(); if(r.width<2||r.bottom<-40||r.top>H+40)continue;
      if(x<r.left-M||x>r.right+M||y<r.top-M||y>r.bottom+M)continue;
      var cx=r.left+r.width/2, cy=r.top+r.height/2, d=Math.hypot(x-cx,y-cy); if(d<bd){ bd=d; best={x:cx,y:cy,idx:i}; } } return best; }
  function ctr(el){ var r=el.getBoundingClientRect(); return [r.left+r.width/2, r.top+r.height/2]; }
  function activeGroup(vc){ var best=null,bd=H*0.55,i,h,d;
    for(i=0;i<groups.length;i++){ h=groups[i].host.getBoundingClientRect(); if(h.bottom<0||h.top>H||h.height<2)continue; d=Math.abs(h.top+h.height/2-vc); if(d<bd){bd=d;best=groups[i];} }
    if(!best) return null;
    var hb2=best.host.getBoundingClientRect(), n=best.els.length, p=(vc-hb2.top)/Math.max(1,hb2.height); p=Math.max(0,Math.min(0.9999,p));
    if(n<2){ var c=ctr(best.els[0]); return {x:c[0],y:c[1],el:best.els[0],frame:best.frame}; }
    var f=p*(n-1), i0=Math.floor(f), fr=f-i0, a=ctr(best.els[i0]), b=ctr(best.els[Math.min(n-1,i0+1)]);
    return {x:a[0]*(1-fr)+b[0]*fr, y:a[1]*(1-fr)+b[1]*fr, el:best.els[fr<0.5?i0:Math.min(n-1,i0+1)], frame:best.frame};
  }
  addEventListener('pointermove',function(e){ if(TOUCH) return; lastMove=performance.now()/1000; pacOn=false; mx=e.clientX; my=e.clientY; hov=true; cursorZone=zoneOf(e.target); });
  addEventListener('scroll',function(){ if(TOUCH||!hov||mx<0)return; lastMove=performance.now()/1000; pacOn=false; cursorZone=zoneOf(document.elementFromPoint(mx,my)); }, {passive:true});
  document.querySelectorAll('.slide .csm, .slide .pv, .ctabtn, .btn, .proc .donut').forEach(function(m){
    m.addEventListener('mouseenter',function(){ hoverSlide=m; });
    m.addEventListener('mouseleave',function(){ if(hoverSlide===m) hoverSlide=null; }); });
  var charging=false, chT0=0, chx=0, chy=0;
  addEventListener('pointerdown',function(e){ if(TOUCH) return; if(e.target.closest('a,button,input,.masthead,.pxctl')) return;
    charging=true; chT0=performance.now()/1000; chx=e.clientX; chy=e.clientY; });
  function release(){ if(!charging) return; charging=false; var ns=performance.now()/1000, ch=Math.min((ns-chT0)/2.2,1);
    waves.push({x:chx,y:chy,t0:ns,pow:0.35+ch*2.1}); dep(chx,chy,1,BRUSH*(2.5+ch*18)); shake=0.45+ch*1.9;
    var hb=hero.getBoundingClientRect(); if(hb.bottom>0 && hb.top<H) typeT=0; }
  addEventListener('pointerup',release); addEventListener('pointercancel',release);
  var cursorZone='';
  var HEART=[[2,1],[3,1],[5,1],[6,1],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[2,4],[3,4],[4,4],[5,4],[6,4],[3,5],[4,5],[5,5],[4,6]];
  function stampHeart(cx,cy){ var S=2, bc=Math.round(cx/cell), br=Math.round(cy/cell), o=4*S;
    for(var k=0;k<HEART.length;k++){ for(var yy=0;yy<S;yy++)for(var xx=0;xx<S;xx++){ var C=bc+HEART[k][0]*S+xx-o, R=br+HEART[k][1]*S+yy-o; if(C<0||R<0||C>=cols||R>=rows)continue; var id=R*cols+C, w=0.86+0.12*Math.sin((C*0.6+R*0.6)-t*0.006); if(w>heat[id])heat[id]=w; } } }
  var hsparks=[];
  function heartBoom(x,y){ for(var i=0;i<16;i++){ var a=i/16*6.2832, sp=BRUSH*(0.7+hsh(i,x)*0.7); hsparks.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1}); } }
  var wasHeart=false;
  var SAYS=['nice','wow','ooh','yes','neat','huh','oh!'];
  function pointArrow(x,y,ang,tt){ var L=BRUSH*8.5, ca=Math.cos(ang), sa=Math.sin(ang), tipx=x+ca*L, tipy=y+sa*L;
    var pulse=(tt*0.9)%1, steps=Math.max(16,Math.round(L/(cell*0.5)));
    for(var i=0;i<=steps;i++){ var f=i/steps, hi=Math.exp(-Math.pow((f-pulse)*3.0,2)); dep(x+ca*L*f, y+sa*L*f, 0.5+0.46*hi, 0.95); }
    var hl=BRUSH*3.4; for(var s=-1;s<=1;s+=2){ var ba=ang+Math.PI+s*0.62, bsteps=Math.max(8,Math.round(hl/(cell*0.5)));
      for(var j=0;j<=bsteps;j++){ var g=j/bsteps; dep(tipx+Math.cos(ba)*hl*g, tipy+Math.sin(ba)*hl*g, 0.72, 0.95); } } }
  function stampCells(cx,cy,cells,ox,oy){ var bc=Math.round(cx/cell), br=Math.round(cy/cell); for(var k=0;k<cells.length;k++){ var C=bc+cells[k][0]-ox, R=br+cells[k][1]-oy; if(C<0||R<0||C>=cols||R>=rows)continue; var id=R*cols+C, w=0.8+0.16*Math.sin((C*0.7+R*0.7)-t*0.005); if(w>heat[id])heat[id]=w; } }
  function stampDisk(cx,cy,rad,val){ if(rad<3)return; var c0=Math.floor((cx-rad)/cell),c1=Math.ceil((cx+rad)/cell),r0=Math.floor((cy-rad)/cell),r1=Math.ceil((cy+rad)/cell), rr=rad*rad, fk=Math.floor(t/140), ACCV=[0.96,0.72,0.82];
    for(var r=r0;r<=r1;r++)for(var c=c0;c<=c1;c++){ if(c<0||r<0||c>=cols||r>=rows)continue; var dx=(c+.5)*cell-cx, dy=(r+.5)*cell-cy; if(dx*dx+dy*dy>rr)continue;
      var v = hsh(c*1.7+0.3, r*1.1+fk*3.7) < 0.18 ? ACCV[(hsh(c+fk*2.1, r-fk*1.3)*3)|0] : val+0.03*Math.sin((c*0.7+r*0.7)-t*0.01);
      heat[r*cols+c]=v; } }
  var txtC=document.createElement('canvas'), txc=txtC.getContext('2d'), TXT='the answer is yes we do it     ', txtW=0, TXH=20, txtData=null, txtScroll=0;
  function buildTxt(){ txc.font='18px "Sneak",monospace'; txtW=Math.max(8,Math.ceil(txc.measureText(TXT).width)); txtC.width=txtW; txtC.height=TXH; txc.font='18px "Sneak",monospace'; txc.textBaseline='middle'; txc.fillStyle='#000'; txc.clearRect(0,0,txtW,TXH); txc.fillText(TXT,0,TXH/2); txtData=txc.getImageData(0,0,txtW,TXH).data; }
  function stampText(cx,cy){ if(!txtData) buildTxt(); var br=Math.round(cy/cell)-(TXH>>1), so=Math.floor(txtScroll), amp=TOUCH?0.05:0.14;
    for(var lc=0;lc<cols;lc++){ var mc=(((so+lc)%txtW)+txtW)%txtW; for(var lr=0;lr<TXH;lr++){ if(txtData[(lr*txtW+mc)*4+3]>80){ var R=br+lr; if(R<0||R>=rows)continue; var id=R*cols+lc, ww=0.84+amp*Math.sin((lc*0.6+lr*0.6)-t*0.006); if(ww>heat[id])heat[id]=ww; } } } }
  var sayC=document.createElement('canvas'), sayx=sayC.getContext('2d'), sayMasks={};
  function saymask(txt){ if(sayMasks[txt])return sayMasks[txt]; sayx.font='bold 12px "Sneak",monospace'; var w=Math.max(8,Math.ceil(sayx.measureText(txt).width)),h=12; sayC.width=w; sayC.height=h;
    sayx.font='bold 12px "Sneak",monospace'; sayx.textBaseline='middle'; sayx.fillStyle='#000'; sayx.clearRect(0,0,w,h); sayx.fillText(txt,0,h/2); var o={d:sayx.getImageData(0,0,w,h).data,w:w,h:h}; sayMasks[txt]=o; return o; }
  function sayWord(txt,x,y,pop){ var o=saymask(txt), th=38, sc=th/o.h, tw=o.w*sc, ox=x-tw/2, oy=y-28-th;
    for(var mr=0;mr<o.h;mr++)for(var mc=0;mc<o.w;mc++){ if(o.d[(mr*o.w+mc)*4+3]<80)continue;
      var c0=((ox+mc*sc)/cell)|0,c1=((ox+(mc+1)*sc)/cell)|0,r0=((oy+mr*sc)/cell)|0,r1=((oy+(mr+1)*sc)/cell)|0;
      for(var R=r0;R<=r1;R++)for(var C=c0;C<=c1;C++){ if(C<0||R<0||C>=cols||R>=rows)continue; var id=R*cols+C, ww=0.55+0.38*pop; if(ww>heat[id])heat[id]=ww; } } }
  var wMask=document.createElement('canvas'), wmx=wMask.getContext('2d'), wData=null, wW=0, wH=14, eggUntil=0, heartUntil=0;
  function buildWord(txt){ wmx.font='bold 12px "Sneak",monospace'; wW=Math.max(8,Math.ceil(wmx.measureText(txt).width)); wMask.width=wW; wMask.height=wH; wmx.font='bold 12px "Sneak",monospace'; wmx.textBaseline='middle'; wmx.fillStyle='#000'; wmx.clearRect(0,0,wW,wH); wmx.fillText(txt,0,wH/2); wData=wmx.getImageData(0,0,wW,wH).data; }
  function stampWord(){ if(!wData)return; var tw=Math.min(W*0.7,(H*0.45)*(wW/wH)), sc=tw/wW, ox=(W-tw)/2, oy=(H-sc*wH)/2;
    for(var mr=0;mr<wH;mr++)for(var mc=0;mc<wW;mc++){ if(wData[(mr*wW+mc)*4+3]<80)continue; var c0=((ox+mc*sc)/cell)|0,c1=((ox+(mc+1)*sc)/cell)|0,r0=((oy+mr*sc)/cell)|0,r1=((oy+(mr+1)*sc)/cell)|0;
      for(var R=r0;R<=r1;R++)for(var C=c0;C<=c1;C++){ if(C<0||R<0||C>=cols||R>=rows)continue; var id=R*cols+C, ww=0.8+0.18*Math.sin((C*0.5+R*0.5)-t*0.012); if(ww>heat[id])heat[id]=ww; } } }
  function stampBigHeart(){ var gw=9,gh=8, tw=Math.min(W*0.42,H*0.55*(gw/gh)), sc=tw/gw, ox=(W-gw*sc)/2, oy=(H-gh*sc)/2;
    for(var k=0;k<HEART.length;k++){ var c0=((ox+HEART[k][0]*sc)/cell)|0,c1=((ox+(HEART[k][0]+1)*sc)/cell)|0,r0=((oy+HEART[k][1]*sc)/cell)|0,r1=((oy+(HEART[k][1]+1)*sc)/cell)|0;
      for(var R=r0;R<=r1;R++)for(var C=c0;C<=c1;C++){ if(C<0||R<0||C>=cols||R>=rows)continue; var id=R*cols+C, ww=0.82+0.12*Math.sin((C*0.5+R*0.5)-t*0.01); if(ww>heat[id])heat[id]=ww; } } }
  function burst(n,pow){ var b=performance.now()/1000; for(var i=0;i<n;i++) waves.push({x:Math.random()*W, y:Math.random()*H, t0:b, pow:pow*(0.6+Math.random())}); shake=Math.max(shake,1.6); }
  function fireWild(){ buildWord('WILD'); eggUntil=performance.now()/1000+3.4; burst(12,1.1); }
  function fireHeart(){ heartUntil=performance.now()/1000+3.4; burst(8,0.9); }
  var KON=[38,38,40,40,37,39,37,39,66,65], ki=0, typed='';
  addEventListener('keydown',function(e){ var k=e.keyCode;
    if(k===KON[ki]){ ki++; if(ki===KON.length){ ki=0; fireWild(); } } else { ki=(k===KON[0])?1:0; }
    if(e.key&&e.key.length===1){ typed=(typed+e.key.toLowerCase()).slice(-6); if(typed.slice(-4)==='wild') fireWild(); else if(typed==='vienna') fireHeart(); } });
  addEventListener('dblclick',function(e){ if(TOUCH) return; if(e.target.closest&&e.target.closest('a,button,input,.pxctl'))return; waves.push({x:e.clientX,y:e.clientY,t0:performance.now()/1000,pow:2.8}); dep(e.clientX,e.clientY,1,BRUSH*22); shake=2.4; });
  function render(){ var tt=t*0.001, ns=performance.now()/1000;
    var hb=hero.getBoundingClientRect(); hrTop=hb.top; hrH=hb.height;
    var heroVis = hb.bottom>0 && hb.top<H;
    var intro=introT/1.6;
    var safes=[], i, b;
    for(i=0;i<pxsafeEls.length;i++){ b=pxsafeEls[i].getBoundingClientRect(); if(b.width>0 && b.bottom>0 && b.top<H){
      var ep=10 + (i*53 % 5)*8;
      safes.push([b.left-ep, b.top-ep*0.7, b.right+ep, b.bottom+ep*0.7, cell*2.4]); } }
    for(i=0;i<heat.length;i++){
      if(dis[i]>0 && ((i/cols)|0)*cell>hb.bottom){ dis[i]-=0.007;
        if(dis[i]<=0){ dis[i]=0; heat[i]=0; }
        else if(dis[i]<0.3){ heat[i]*=0.88; }
        else { heat[i]=Math.max(heat[i]*0.95, 0.9); } }
      else { if(dis[i]>0)dis[i]=0; heat[i]*=(TOUCH?0.85:0.878); if(heat[i]<.003)heat[i]=0; } }
    if(TOUCH){ var sp=scrollY, vc=H*0.5, bx, by, mhd=null;
      for(var mi=0;mi<headElsM.length;mi++){ var mr=headElsM[mi].getBoundingClientRect(); if(mr.width<2)continue; var mcy=mr.top+mr.height/2; if(mcy>H*0.30 && mcy<H*0.64){ mhd={x:mr.left+mr.width/2, y:mcy}; break; } }
      if(mhd){ cursorZone=''; var tprog=(H*0.64-mhd.y)/(H*0.34); tprog=tprog<0?0:tprog>1?1:tprog;
        bx=mhd.x+(tprog-0.5)*W*0.5; by=mhd.y-104; hoverSlide=null; }
      else {
        cursorZone = spans(secOrigin,vc)?'heart' : ((spans(secContact,vc)||spans(footEl,vc))?'text':'');
        if(cursorZone){ bx=W*0.5+Math.sin(sp*0.0026+0.6)*W*0.33; by=H*0.5+Math.sin(sp*0.0052)*H*0.20; hoverSlide=null; }
        else { var g=activeGroup(vc);
          if(g){ bx=g.x; by=g.y; hoverSlide=g.frame?g.el:null; }
          else { var tg=nearestTarget(vc);
            if(tg){ var tr=tg.getBoundingClientRect(); bx=tr.left+tr.width/2; by=tr.top+tr.height/2; hoverSlide=tg; }
            else { bx=W*0.5+Math.sin(sp*0.0026+0.6)*W*0.33; by=H*0.5+Math.sin(sp*0.0052)*H*0.20; hoverSlide=null; } } }
      }
      if(mx<0)mx=bx; if(my<0)my=by;
      mx += (bx-mx)*0.11; my += (by-my)*0.11;
      mx=Math.max(8,Math.min(W-8,mx)); my=Math.max(8,Math.min(H-8,my)); hov=true; lastMove=ns; }
    if(hov&&mx>0){
      var hd = TOUCH ? mhd : nearHeadline(mx,my,headEls), idle = ns-lastMove;
      if(hd){
        if(idle<2.4){ pointArrow(mx,my, Math.atan2(hd.y-my, hd.x-mx), ns); pmx=mx;pmy=my; }
        else { wander(mx,my,ns); pmx=mx;pmy=my; }
      }
      else if(cursorZone==='heart'){ if(!wasHeart) heartBoom(mx,my); stampHeart(mx,my); pmx=mx;pmy=my; }
      else if(cursorZone==='text'){ follow(mx,my, my>hb.bottom?BRUSH*0.5:BRUSH); }
      else {
        var sg=null, sp=0;
        for(var qi=0;qi<smileyEls.length;qi++){ var qr=smileyEls[qi].el.getBoundingClientRect(); if(qr.width<2||qr.bottom<-40||qr.top>H+40)continue;
          var qcx=qr.left+qr.width/2, qcy=qr.top+qr.height/2, GR=qr.width*1.9, qp=1-Math.hypot(mx-qcx,my-qcy)/GR;
          if(qp>sp){ sp=qp; sg={cx:qcx,cy:qcy,rad:qr.width*0.46,val:smileyEls[qi].val}; } }
        if(sg && sp>0){ var e=sp*sp*(3-2*sp), bx=mx+(sg.cx-mx)*e, by=my+(sg.cy-my)*e;
          if(e<0.82) dep(bx,by,0.13, BRUSH*(1-0.5*e));
          if(sp>0.16) stampDisk(sg.cx, sg.cy, sg.rad*e, sg.val); pmx=mx;pmy=my; }
        else if(idle>1.5){ wander(mx,my,ns); pmx=mx;pmy=my; }
        else follow(mx,my, (my>hb.bottom?BRUSH*0.5:BRUSH));
      }
      wasHeart=(cursorZone==='heart');
    }
    for(var hi=hsparks.length-1;hi>=0;hi--){ var hsp=hsparks[hi]; hsp.x+=hsp.vx; hsp.y+=hsp.vy; hsp.vx*=0.88; hsp.vy*=0.88; hsp.life-=0.06;
      if(hsp.life<=0){ hsparks.splice(hi,1); continue; } dep(hsp.x, hsp.y, 0.45+0.45*hsp.life, 1.6); }
    if(ctaMeta){ var _mr=ctaMeta.getBoundingClientRect();
      if(_mr.bottom>0 && _mr.top<H+260){ txtScroll+=0.14; stampText(0, _mr.top-(TOUCH?195:235)); } }
    if(ns<eggUntil) stampWord(); if(ns<heartUntil) stampBigHeart();
    if(charging){ var chg=Math.min((ns-chT0)/2.2,1); dep(chx,chy, 0.45+chg*0.5, BRUSH*(2+chg*8)); if(shake<0.12+chg*0.35) shake=0.12+chg*0.35; }
    for(var wi=waves.length-1;wi>=0;wi--){ var wv=waves[wi], age=ns-wv.t0; if(age>1.5){waves.splice(wi,1);continue;}
      var pw=wv.pow||1, R=age*Math.hypot(W,H)*1.7, sig=cell*5.5*pw, amp=Math.max(0,1-age/1.5)*1.2*pw, inv=1/(2*sig*sig);
      for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){ var dx=(c+.5)*cell-wv.x, dy=(r+.5)*cell-wv.y, dd=Math.sqrt(dx*dx+dy*dy), g=amp*Math.exp(-((dd-R)*(dd-R))*inv); if(g>0.02){ var id=r*cols+c; if(g>heat[id])heat[id]=g;
        if((r+0.5)*cell>hb.bottom && g>0.25 && dis[id]===0) dis[id]=0.45+hsh(c,r)*0.7; } } }
    sData=null;
    ctx.save(); if(shake>0.01){ shake*=0.9; ctx.translate((Math.random()-0.5)*shake*20,(Math.random()-0.5)*shake*20); } else shake=0;
    ctx.clearRect(-40,-40,W+80,H+80); ctx.fillStyle='#fff'; ctx.fillRect(-40,-40,W+80,H+80);
    var sy=TOUCH?0:scrollY, off=sy-Math.floor(sy/cell)*cell, s=cell-1;
    ctx.strokeStyle='#fafafa'; ctx.lineWidth=1; ctx.beginPath();
    for(var gx=0;gx<=W;gx+=cell){ctx.moveTo(gx+.5,0);ctx.lineTo(gx+.5,H);}
    for(var gy=-off;gy<=H;gy+=cell){ctx.moveTo(0,gy+.5);ctx.lineTo(W,gy+.5);}
    ctx.stroke();
    var drStart=Math.floor(sy/cell)-1, drEnd=Math.floor((sy+H)/cell)+1;
    if(fhb<0) fhb=hb.bottom; else fhb += (hb.bottom-fhb)*(TOUCH?0.2:1);
    var hAmp=H*0.14, heroBottom=fhb+sy, heroEnd=heroBottom*0.55, fadeSpan=Math.max(1, heroBottom*0.18);
    for(var dr=drStart; dr<=drEnd; dr++){
      var vy=dr*cell-sy, ccyView=vy+cell*0.5, vr=Math.floor(ccyView/cell), inRow=(vr>=0&&vr<rows);
      var dd=dr*cell, ny=(dr*cell)/H;
      for(var c2=0;c2<cols;c2++){ var ccx=(c2+.5)*cell, nx=(c2*cell)/innerWidth;
        var co=Math.max(0,(Math.sin(c2*0.5+SEED)+Math.sin(c2*0.21-SEED*1.3))*0.16 + hsh(Math.floor(c2/2)+3.3,Math.floor(dr/4))*0.6 + 0.15), depthN=dd+co*hAmp;
        var regThr=depthN<=heroEnd?0:Math.min(1,(depthN-heroEnd)/fadeSpan);
        var safe=false; for(var si=0;si<safes.length;si++){ var sf=safes[si];
          if(ccx>=sf[0]&&ccx<=sf[2]&&ccyView>=sf[1]&&ccyView<=sf[3]){ safe=true; break; }
          var fz=sf[4]; if(ccx>=sf[0]-fz&&ccx<=sf[2]+fz&&ccyView>=sf[1]-fz&&ccyView<=sf[3]+fz && hsh(c2+9.1,dr+4.7)<0.55){ safe=true; break; } }
        if(safe) continue;
        var v=inRow?heat[vr*cols+c2]*0.9:0;
        if(region(nx,ny,tt) > regThr && hsh(c2*1.7+11.3, dr*1.3+5.1) < intro){
          v += base(nx,ny,tt)+(hsh(c2,dr)-0.5)*0.12+Math.sin((c2*0.6+dr*0.8)+tt*1.7)*0.045; }
        if(v<0.30 && !(v>=0.86&&v<1.02))continue; var col=BANDS[0][1]; if(v>=BANDS[1][0])col=BANDS[1][1]; if(v>=BANDS[2][0])col=BANDS[2][1]; if(v>=BANDS[3][0])col=BANDS[3][1]; if(v>=0.86&&v<1.02)col='#d8ff00';
        ctx.fillStyle=col; ctx.fillRect(c2*cell, vy, s, s); } }
    ctx.restore();
  }
  function loop(ts){ if(!loop.l)loop.l=ts; var d=ts-loop.l; loop.l=ts; t+=d; typeT+=d/1000; introT+=d/1000;
    render(); requestAnimationFrame(loop); }
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){ size(); });
  requestAnimationFrame(loop);

  var pxctl=document.getElementById('pxctl');
  if(pxctl){ pxctl.addEventListener('click', function(e){ var btn=e.target.closest('button'); if(!btn) return;
    function pick(attr){ pxctl.querySelectorAll('button[data-'+attr+']').forEach(function(x){ x.classList.remove('on'); }); btn.classList.add('on'); }
    if(btn.dataset.cell!=null){ cell=+btn.dataset.cell; size(); pick('cell'); }
    else if(btn.dataset.brush!=null){ BRUSH=+btn.dataset.brush; pick('brush'); }
  }); }
})();
```

## Implementation Checklist For Another Agent
1. Reintroduce hero keyvisual mount in app/page.tsx.
2. Create a dedicated React component, for example components/HeroKeyvisual.tsx, that ports the script behavior to React hooks.
3. Avoid direct global querySelector dependencies where possible. Use refs and controlled IDs for hero, canvas, and safe-zone elements.
4. Keep pointer + touch behaviors and reduced-motion handling.
5. Keep detonate/charge and idle Pac-Man behavior.
6. Keep decode reveal text behavior and bands (#1c2541, #3b5bd9, #f5c518, #e0492a, neon #d8ff00).
7. Recreate required CSS hooks in app/globals.css.
8. Ensure no memory leaks (remove all listeners/raf/observers on cleanup).
9. Run npm run build and confirm success.

## Acceptance Criteria
- Hero shows animated pixel cloud field immediately on load.
- Interaction works on mouse and touch fallbacks.
- Hold-to-charge + release detonate works.
- Idle mode transitions to Pac-Man behavior.
- Visual style matches provided reference behavior.
- Build passes with no TypeScript or Next.js errors.

## Notes
- Current homepage no longer mounts InteractiveSignalField in the hero.
- Existing InteractiveSignalField component still exists and can be used as a base for parts of the logic.
