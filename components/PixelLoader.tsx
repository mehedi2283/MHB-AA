"use client";

import React from "react";
import { PixelPacman } from "./PixelIcons";

interface PixelLoaderProps {
  label?: string;
  className?: string;
}

export function PixelLoader({
  label = "SYNCHRONIZING RECORDS FROM SUPABASE...",
  className = "",
}: PixelLoaderProps) {
  return (
    <div
      className={`py-16 px-6 flex flex-col items-center justify-center gap-4 text-center select-none ${className}`}
    >
      {/* 8-bit Pac-Man Chomping Energy Dots Animation */}
      <div className="flex items-center gap-3 bg-[#090d09] border border-[#c8ff3d33] px-5 py-3 rounded-lg shadow-[0_0_20px_rgba(200,255,61,0.1)]">
        <div className="text-[#c8ff3d] animate-[pacmanChomp_0.4s_infinite_steps(2)]">
          <PixelPacman size={22} />
        </div>
        <div className="flex items-center gap-1.5 text-[#c8ff3d] text-xs font-mono">
          <span className="animate-[dotBlink_0.8s_infinite_0ms]">▪</span>
          <span className="animate-[dotBlink_0.8s_infinite_200ms]">▪</span>
          <span className="animate-[dotBlink_0.8s_infinite_400ms]">▪</span>
        </div>
      </div>

      {/* Status Label */}
      <div className="space-y-1.5 max-w-sm">
        <span className="font-mono text-[11px] font-bold text-white uppercase tracking-widest block">
          {label}
        </span>
        <div className="w-48 h-1 bg-[#162016] rounded-full overflow-hidden mx-auto border border-[#ffffff10]">
          <div className="h-full bg-[#c8ff3d] animate-[pixelProgress_0.8s_ease-in-out_infinite_alternate]" />
        </div>
      </div>
    </div>
  );
}
