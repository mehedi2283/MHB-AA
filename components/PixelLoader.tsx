"use client";

import React from "react";
import { SkeletonCard, SkeletonTable, SkeletonForm } from "./SkeletonLoader";

interface PixelLoaderProps {
  label?: string;
  className?: string;
  variant?: "skeleton-cards" | "skeleton-table" | "skeleton-form" | "pill" | "default";
}

export function PixelLoader({
  className = "",
  variant = "default",
}: PixelLoaderProps) {
  if (variant === "skeleton-cards") {
    return (
      <div className={`space-y-4 ${className}`}>
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
        <SkeletonTable rows={5} />
      </div>
    );
  }

  // Default clean full-form skeleton shimmer
  return (
    <div className={`space-y-6 ${className}`}>
      <SkeletonForm fields={4} />
    </div>
  );
}
