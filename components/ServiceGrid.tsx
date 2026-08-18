"use client";

import { ArrowUpRight, Bot, Braces, ChartNoAxesCombined, DatabaseZap, GitBranch, LayoutDashboard, MessagesSquare, PhoneCall } from "lucide-react";
import type { ServiceItem } from "@/lib/site-content";
import { PixelCard } from "./PixelCard";

const icons = [PhoneCall, MessagesSquare, Bot, GitBranch, ChartNoAxesCombined, LayoutDashboard, Braces, DatabaseZap];
const serviceVariants: Array<"acid" | "amber" | "mixed"> = ["acid", "mixed", "amber", "acid"];

export function ServiceGrid({ services }: { services: ServiceItem[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
      {services.map(({ title, description, tools }, i) => {
        const Icon = icons[i % icons.length];
        return (
          <PixelCard
            key={title}
            as="article"
            variant="glass"
            gridSize={8}
            className="glass card group transition duration-300 min-h-[285px] flex flex-col"
          >
            <div className="size-11 rounded-[4px] border border-blue-400/20 bg-blue-400/10 grid place-items-center text-blue-300">
              <Icon size={20} />
            </div>
            <h3 className="text-lg mt-6 font-semibold">{title}</h3>
            <p className="muted text-sm mt-3 flex-1">{description}</p>
            <div className="flex flex-wrap gap-1.5 mt-5">
              {tools.map((t) => (
                <span className="text-[10px] text-slate-400 border border-white/10 rounded-full px-2 py-1" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <a href="#contact" className="flex items-center justify-between text-xs text-blue-300 mt-5 pt-4 border-t border-white/10">
              Ask me about this <ArrowUpRight size={14} />
            </a>
          </PixelCard>
        );
      })}
    </div>
  );
}

