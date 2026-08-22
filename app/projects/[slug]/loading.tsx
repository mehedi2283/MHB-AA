import React from "react";

export default function ProjectDetailLoading() {
  return (
    <main className="case-page min-h-screen bg-[#090c09] text-[#e8eee2] animate-pulse">
      {/* Navigation Header Skeleton */}
      <header className="case-nav">
        <div className="shell case-nav-inner flex items-center justify-between py-4">
          <div className="h-4 w-28 bg-[#ffffff15] rounded" />
          <div className="h-5 w-20 bg-[#c8ff3d33] rounded" />
          <div className="h-4 w-32 bg-[#ffffff15] rounded" />
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="case-hero pt-12 pb-16">
        <div className="shell case-hero-layout grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Copy Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-32 bg-[#c8ff3d22] border border-[#c8ff3d44] rounded" />
              <div className="h-4 w-24 bg-[#ffffff15] rounded" />
            </div>
            <div className="h-12 w-4/5 bg-[#ffffff1f] rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-[#ffffff10] rounded" />
              <div className="h-4 w-5/6 bg-[#ffffff10] rounded" />
              <div className="h-4 w-2/3 bg-[#ffffff10] rounded" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-20 bg-[#ffffff15] rounded" />
              <div className="h-6 w-24 bg-[#ffffff15] rounded" />
              <div className="h-6 w-16 bg-[#ffffff15] rounded" />
            </div>
          </div>

          {/* System Map Skeleton */}
          <aside className="lg:col-span-5 p-6 border border-[#ffffff18] bg-[#0d110d] rounded-lg space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#ffffff10]">
              <div className="h-4 w-24 bg-[#c8ff3d33] rounded" />
              <div className="h-3 w-16 bg-[#ffffff15] rounded" />
            </div>
            <div className="h-32 w-full bg-[#141a14] border border-[#ffffff0f] rounded" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-14 bg-[#141a14] rounded border border-[#ffffff0a]" />
              <div className="h-14 bg-[#141a14] rounded border border-[#ffffff0a]" />
            </div>
          </aside>
        </div>
      </section>

      {/* Architecture & Capabilities Skeleton */}
      <section className="shell py-12 border-t border-[#ffffff10]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-[#0d110d] border border-[#ffffff12] rounded-lg p-5 space-y-3">
            <div className="h-4 w-1/2 bg-[#ffffff20] rounded" />
            <div className="h-3 w-full bg-[#ffffff0f] rounded" />
            <div className="h-3 w-4/5 bg-[#ffffff0f] rounded" />
          </div>
          <div className="h-40 bg-[#0d110d] border border-[#ffffff12] rounded-lg p-5 space-y-3">
            <div className="h-4 w-1/2 bg-[#ffffff20] rounded" />
            <div className="h-3 w-full bg-[#ffffff0f] rounded" />
            <div className="h-3 w-4/5 bg-[#ffffff0f] rounded" />
          </div>
          <div className="h-40 bg-[#0d110d] border border-[#ffffff12] rounded-lg p-5 space-y-3">
            <div className="h-4 w-1/2 bg-[#ffffff20] rounded" />
            <div className="h-3 w-full bg-[#ffffff0f] rounded" />
            <div className="h-3 w-4/5 bg-[#ffffff0f] rounded" />
          </div>
        </div>
      </section>
    </main>
  );
}
