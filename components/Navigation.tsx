"use client";

import { useState } from "react";
import { PixelArrowUpRight, PixelClose } from "./PixelIcons";
import { Menu, ArrowDownToLine } from "lucide-react";
import { PixelCard } from "./PixelCard";

const links = [
  ["About", "#about"],
  ["Work", "#projects"],
  ["Playground", "#playground"],
  ["Stack", "#technology"],
  ["Process", "#process"],
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="os-nav" style={{ backdropFilter: "none", WebkitBackdropFilter: "none" }}>
      <div className="os-nav-texture" aria-hidden="true" />
      <div className="shell os-nav-inner">
        <a href="#home" className="os-wordmark" aria-label="Mehedi portfolio home">
          mehedi<span>.</span>
        </a>
        <nav className="os-nav-links desktop-only" aria-label="Portfolio sections">
          {links.map(([label, href]) => (
            <a href={href} key={label}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 desktop-only">
          <PixelCard
            as="a"
            href="/api/resume/download"
            download="Mehedi_Hasan_Resume.pdf"
            variant="glass"
            gridSize={5}
            className="os-nav-resume px-3 py-1.5 text-[11px] font-mono font-bold tracking-wider text-[#a4ada0] hover:text-white border border-white/[0.12] hover:border-[#c8ff3d] rounded inline-flex items-center gap-1.5 transition"
            aria-label="Download Resume"
          >
            <span>CV</span>
            <ArrowDownToLine size={12} className="text-[#c8ff3d]" />
          </PixelCard>
          <PixelCard as="a" href="#contact" variant="primaryButton" gridSize={5} className="os-nav-connect">
            Connect <PixelArrowUpRight size={13} />
          </PixelCard>
        </div>
        <button
          className="os-menu-button md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <PixelClose size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <nav className="os-mobile-menu md:hidden">
          {[
            ...links,
            ["Download Resume (PDF)", "/api/resume/download"],
            ["Connect", "#contact"],
          ].map(([label, href]) => (
            <a
              onClick={() => setOpen(false)}
              href={href}
              key={label}
              download={href.includes("resume") ? "Mehedi_Hasan_Resume.pdf" : undefined}
            >
              {label}
              <PixelArrowUpRight size={14} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
