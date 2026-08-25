"use client";

import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      {...props}
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton-glass-card p-6 flex flex-col justify-between min-h-[260px] rounded ${className}`}>
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <Skeleton className="size-10 rounded bg-white/10" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-3 rounded" />
        <Skeleton className="h-4 w-full mb-2 rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
      </div>
      <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <Skeleton className="h-5 w-5 rounded" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="skeleton-glass-card overflow-hidden rounded">
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-40 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
        </div>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="size-9 rounded shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-sm">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded hidden sm:block" />
            <Skeleton className="h-6 w-20 rounded hidden md:block" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-16 rounded" />
              <Skeleton className="h-7 w-7 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#070907] text-[#f1f4e9] overflow-hidden">
      {/* Top Navbar Skeleton */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070907]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded bg-[#c8ff3d]/20 border border-[#c8ff3d]/30" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-8 w-28 rounded bg-[#c8ff3d]/20 border border-[#c8ff3d]/30" />
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-48 rounded bg-[#c8ff3d]/10 border border-[#c8ff3d]/20" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full max-w-lg rounded" />
            <Skeleton className="h-12 w-4/5 rounded bg-[#c8ff3d]/20" />
          </div>
          <div className="space-y-2 max-w-md">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <Skeleton className="h-11 w-36 rounded bg-[#c8ff3d]/30 border border-[#c8ff3d]" />
            <Skeleton className="h-11 w-36 rounded border border-white/20" />
          </div>
          <div className="pt-4">
            <Skeleton className="h-12 w-full max-w-md rounded" />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="skeleton-glass-card p-6 h-[380px] flex flex-col justify-between border border-[#c8ff3d]/20 shadow-[0_0_50px_rgba(200,255,61,0.05)] rounded">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <div className="flex-1 flex items-center justify-center my-6">
              <div className="relative size-44 rounded-full border border-[#c8ff3d]/20 flex items-center justify-center">
                <Skeleton className="size-24 rounded-full bg-[#c8ff3d]/10 border border-[#c8ff3d]/30" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar Skeleton */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-glass-card p-5 space-y-2 rounded">
              <Skeleton className="h-3 w-12 rounded" />
              <Skeleton className="h-8 w-24 rounded bg-[#c8ff3d]/20" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-8 w-56 rounded" />
          </div>
          <Skeleton className="h-4 w-32 rounded hidden sm:block" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#070907] text-[#f1f4e9] p-6 max-w-5xl mx-auto space-y-12">
      {/* Back Button & Nav */}
      <div className="flex items-center justify-between pt-4 pb-6 border-b border-white/[0.08]">
        <Skeleton className="h-8 w-28 rounded" />
        <Skeleton className="h-6 w-32 rounded" />
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36 rounded bg-[#c8ff3d]/10 border border-[#c8ff3d]/20" />
        <Skeleton className="h-10 w-3/4 rounded" />
        <Skeleton className="h-4 w-full max-w-2xl rounded" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </div>

      {/* Context Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonCard className="border-red-500/20" />
        <SkeletonCard className="border-[#c8ff3d]/20" />
      </div>

      {/* Architecture System Map */}
      <div className="skeleton-glass-card p-6 space-y-6 rounded">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 rounded bg-white/[0.03] border border-white/[0.06] space-y-2">
              <Skeleton className="size-6 rounded" />
              <Skeleton className="h-3 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-28 rounded" />
          <Skeleton className="h-9 w-32 rounded bg-[#c8ff3d]/20 border border-[#c8ff3d]/40" />
        </div>
      </div>

      {/* 4 Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-glass-card p-4 space-y-2 rounded">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-8 w-16 rounded bg-[#c8ff3d]/20" />
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-80 rounded flex-1" />
        <Skeleton className="h-10 w-28 rounded" />
      </div>

      {/* Table Skeleton */}
      <SkeletonTable rows={6} />
    </div>
  );
}
