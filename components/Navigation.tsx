"use client";

import { useState } from "react";
import { PixelArrowUpRight, PixelClose } from "./PixelIcons";
import { Menu } from "lucide-react";
import { PixelCard } from "./PixelCard";

const links = [["About", "#about"], ["Work", "#projects"], ["Playground", "#playground"], ["Stack", "#technology"], ["Process", "#process"]];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return <header className="os-nav" style={{ backdropFilter: "none", WebkitBackdropFilter: "none" }}>
    <div className="os-nav-texture" aria-hidden="true" />
    <div className="shell os-nav-inner">
      <a href="#home" className="os-wordmark" aria-label="Mehedi portfolio home">mehedi<span>.</span></a>
      <nav className="os-nav-links desktop-only" aria-label="Portfolio sections">{links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</nav>
      <PixelCard as="a" href="#contact" variant="primaryButton" gridSize={5} className="os-nav-connect desktop-only">Connect <PixelArrowUpRight size={13} /></PixelCard>
      <button className="os-menu-button md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <PixelClose size={18} /> : <Menu size={18} />}</button>
    </div>
    {open && <nav className="os-mobile-menu md:hidden">{[...links, ["Connect", "#contact"]].map(([label, href]) => <a onClick={() => setOpen(false)} href={href} key={label}>{label}<PixelArrowUpRight size={14} /></a>)}</nav>}
  </header>;
}
