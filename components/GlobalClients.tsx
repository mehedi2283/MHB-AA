"use client";

import React, { useState } from "react";
import { Globe } from "@/components/magicui/globe";
import { PixelCard } from "@/components/PixelCard";
import { PixelGlobe, PixelRadio, PixelZap } from "./PixelIcons";

interface ClientHub {
  city: string;
  country: string;
  region: string;
  flag: string;
  deployments: string;
  system: string;
  tz: string;
  coords: [number, number];
}

const CLIENT_HUBS: ClientHub[] = [
  {
    city: "New York & SF",
    country: "United States",
    region: "North America",
    flag: "🇺🇸",
    deployments: "3 Live Engines",
    system: "Cold Outreach SaaS & Lead Automation",
    tz: "EST / PST (UTC-5 / -8)",
    coords: [40.7128, -74.006],
  },
  {
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    flag: "🇬🇧",
    deployments: "2 Live Engines",
    system: "E-Commerce Ops & CRM Voice Lifecycle",
    tz: "GMT / BST (UTC+0)",
    coords: [51.5074, -0.1278],
  },
  {
    city: "Sydney",
    country: "Australia",
    region: "Asia-Pacific",
    flag: "🇦🇺",
    deployments: "1 Live Engine",
    system: "Gaming Pub Automated Operations",
    tz: "AEST (UTC+10)",
    coords: [-33.8688, 151.2093],
  },
  {
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    flag: "🇩🇪",
    deployments: "1 Live Engine",
    system: "Multi-Agent Knowledge Base Router",
    tz: "CET (UTC+1)",
    coords: [52.52, 13.405],
  },
  {
    city: "Dubai",
    country: "UAE",
    region: "Middle East",
    flag: "🇦🇪",
    deployments: "1 Live Engine",
    system: "Real Estate WhatsApp & Voice Pipeline",
    tz: "GST (UTC+4)",
    coords: [25.2048, 55.2708],
  },
  {
    city: "Toronto",
    country: "Canada",
    region: "North America",
    flag: "🇨🇦",
    deployments: "1 Live Engine",
    system: "Omnichannel Support & Billing Sync",
    tz: "EST (UTC-5)",
    coords: [43.6532, -79.3832],
  },
];

export function GlobalClients() {
  const [activeHub, setActiveHub] = useState<ClientHub>(CLIENT_HUBS[0]);

  return (
    <section id="global-network" className="section os-global-clients">
      <div className="shell">
        <div className="os-section-head os-section-head-row">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase text-[#c8ff3d]">
              <PixelRadio size={13} className="animate-pulse" />
              GLOBAL CLIENT NETWORK
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 text-white">
              Where My Clients & Systems Run.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#9ba494] leading-relaxed">
            Architecting and maintaining production AI workflows, client portals, and voice agents across 6+ countries and 4 continents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-center">
          {/* Left Column: Interactive 3D WebGL Globe */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center p-4 min-h-[420px] rounded border border-white/10 bg-[#0a0d0a]/80 backdrop-blur-sm overflow-hidden">
            {/* Background grid matrix */}
            <div className="absolute inset-0 bg-[linear-gradient(#c8ff3d08_1px,transparent_1px),linear-gradient(90deg,#c8ff3d08_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />
            
            {/* Live radar badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-[#080b08]/90 text-[10px] text-[#c8ff3d] tracking-widest uppercase">
              <span className="size-2 rounded bg-[#c8ff3d] animate-ping" />
              <span>LIVE TELEMETRY · 9 GLOBAL HUBS</span>
            </div>

            {/* Interactive Magic UI Globe */}
            <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center z-10">
              <Globe className="scale-105" />
            </div>

            {/* Interactive guidance caption */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-[#697265] tracking-wider z-20 pointer-events-none">
              DRAG GLOBE TO ROTATE · ROTATING REAL-TIME CLIENT COORDINATES
            </div>
          </div>

          {/* Right Column: Client Hub Cards & Regional Telemetry */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CLIENT_HUBS.map((hub) => {
                const isSelected = activeHub.city === hub.city;
                return (
                  <PixelCard
                    as="button"
                    key={hub.city}
                    variant={isSelected ? "primaryButton" : "glass"}
                    gridSize={6}
                    onClick={() => setActiveHub(hub)}
                    className={`text-left p-4 rounded border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-[#c8ff3d] bg-[#121810]"
                        : "border-white/10 bg-[#0b0e0b] hover:border-[#c8ff3d55]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{hub.flag}</span>
                        <strong className="text-xs font-bold text-white tracking-wide">
                          {hub.city}
                        </strong>
                      </div>
                      <span className="text-[9px] text-[#c8ff3d] border border-[#c8ff3d33] px-2 py-0.5 rounded font-mono">
                        {hub.region}
                      </span>
                    </div>

                    <div className="mt-2.5 text-[11px] text-[#a4ada0] leading-snug">
                      {hub.system}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] text-[#697265] font-mono">
                      <span className="flex items-center gap-1">
                        <PixelZap size={10} className="text-[#c8ff3d]" />
                        {hub.deployments}
                      </span>
                      <span>{hub.tz}</span>
                    </div>
                  </PixelCard>
                );
              })}
            </div>

            {/* Global reliability & SLA telemetry box */}
            <PixelCard
              as="div"
              variant="glass"
              gridSize={8}
              className="mt-2 p-4 rounded border border-white/10 bg-gradient-to-r from-[#0c100c] to-[#080a08] flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded bg-[#c8ff3d]/10 border border-[#c8ff3d]/30 grid place-items-center text-[#c8ff3d]">
                  <PixelGlobe size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Cross-Border Availability</div>
                  <div className="text-[10px] text-[#8e9789]">Distributed VPS & Cloud Failovers in US-East, EU-Central & AP-East</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right font-mono">
                <div>
                  <div className="text-[9px] text-[#697265]">AVG SYSTEM UPTIME</div>
                  <div className="text-xs font-bold text-[#c8ff3d]">99.98%</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#697265]">TIMEZONE COVERAGE</div>
                  <div className="text-xs font-bold text-white">24/7 Monitored</div>
                </div>
              </div>
            </PixelCard>
          </div>
        </div>
      </div>
    </section>
  );
}
