"use client";

import React from "react";

const CAPABILITIES = [
  "AI AGENTS",
  "N8N WORKFLOWS",
  "VOICE PIPELINES",
  "API INTEGRATIONS",
  "FULL-STACK SAAS",
  "CRM AUTOMATION",
  "AUTONOMOUS BOTS",
  "DATABASE ARCHITECTURE",
  "WEBHOOK ENGINES",
  "ENTERPRISE AI OPS",
];

export function MarqueeStrip() {
  return (
    <section className="os-marquee-container" aria-label="Core capabilities">
      <div className="os-marquee-track">
        {/* Track 1 */}
        <div className="os-marquee-group" aria-hidden="false">
          {CAPABILITIES.map((item, index) => (
            <span key={`a-${index}`} className="os-marquee-item">
              <span className="os-marquee-dot">✦</span>
              <span className="os-marquee-text">{item}</span>
            </span>
          ))}
        </div>

        {/* Track 2 (Duplicate for seamless infinite loop) */}
        <div className="os-marquee-group" aria-hidden="true">
          {CAPABILITIES.map((item, index) => (
            <span key={`b-${index}`} className="os-marquee-item">
              <span className="os-marquee-dot">✦</span>
              <span className="os-marquee-text">{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
