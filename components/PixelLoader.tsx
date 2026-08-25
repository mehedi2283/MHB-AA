"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { SkeletonCard, SkeletonTable } from "./SkeletonLoader";

interface PixelLoaderProps {
  label?: string;
  className?: string;
  variant?: "skeleton-cards" | "skeleton-table" | "pill" | "default";
}

export function PixelLoader({
  label = "SYNCHRONIZING RECORDS FROM SUPABASE...",
  className = "",
  variant = "default",
}: PixelLoaderProps) {
  if (variant === "skeleton-cards") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <Loader2 size={15} className="text-[#c8ff3d] animate-spin" />
          <span className="font-mono text-xs text-[#a4ada0]">{label}</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (variant === "skeleton-table") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <Loader2 size={15} className="text-[#c8ff3d] animate-spin" />
          <span className="font-mono text-xs text-[#a4ada0]">{label}</span>
        </div>
        <SkeletonTable rows={5} />
      </div>
    );
  }

  return (
    <div
      className={`py-12 px-6 flex flex-col items-center justify-center gap-5 text-center select-none ${className}`}
    >
      {/* Modern Shimmering Skeleton Container */}
      <div className="skeleton-glass-card p-6 max-w-sm w-full space-y-4 border border-[#c8ff3d]/20 shadow-[0_0_30px_rgba(200,255,61,0.06)]">
        <div className="flex items-center justify-center gap-3">
          <div className="size-9 rounded-lg bg-[#c8ff3d]/10 border border-[#c8ff3d]/30 grid place-items-center text-[#c8ff3d]">
            <Loader2 size={18} className="animate-spin" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#c8ff3d] block">
              SYSTEM ONLINE
            </span>
            <span className="text-xs font-bold text-white tracking-wide block">
              FETCHING DATA
            </span>
          </div>
        </div>

        {/* Status Label */}
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <span className="text-[10.5px] font-mono font-semibold text-[#a4ada0] block">
            {label}
          </span>
          <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-[#c8ff3d] rounded-full animate-[pixelProgress_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
