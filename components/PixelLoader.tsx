"use client";

import React from "react";
import { Loader2 } from "lucide-react";

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
      {/* Modern Sleek Neon Vector Loader */}
      <div className="flex items-center gap-3 bg-[#090d09] border border-[#c8ff3d33] px-5 py-3 rounded-lg shadow-[0_0_20px_rgba(200,255,61,0.15)]">
        <Loader2 size={20} className="text-[#c8ff3d] animate-spin" />
        <span className="text-xs font-mono text-[#c8ff3d] tracking-wider font-bold">LOADING</span>
      </div>

      {/* Status Label */}
      <div className="space-y-2 max-w-sm">
        <span className="text-[11px] font-bold text-white uppercase tracking-widest block font-mono">
          {label}
        </span>
        <div className="w-48 h-1 bg-[#162016] rounded-full overflow-hidden mx-auto border border-[#ffffff10]">
          <div className="h-full bg-[#c8ff3d] animate-[pixelProgress_0.8s_ease-in-out_infinite_alternate]" />
        </div>
      </div>
    </div>
  );
}
