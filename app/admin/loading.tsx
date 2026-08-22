import React from "react";

export default function AdminLoading() {
  return (
    <div className="admin-page animate-pulse space-y-8 p-8">
      {/* Header skeleton */}
      <header className="flex justify-between items-center pb-6 border-b border-[#ffffff10]">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[#c8ff3d33] rounded" />
          <div className="h-8 w-64 bg-[#ffffff20] rounded" />
          <div className="h-4 w-96 bg-[#ffffff10] rounded" />
        </div>
        <div className="h-9 w-36 bg-[#ffffff18] rounded" />
      </header>

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 border border-[#ffffff12] bg-[#0d110d] rounded-lg space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-6 bg-[#ffffff15] rounded" />
              <div className="h-4 w-4 bg-[#c8ff3d33] rounded" />
            </div>
            <div className="h-7 w-12 bg-[#ffffff25] rounded" />
            <div className="h-3 w-20 bg-[#ffffff10] rounded" />
          </div>
        ))}
      </div>

      {/* Table & Overview skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 border border-[#ffffff12] bg-[#0d110d] rounded-lg space-y-4">
          <div className="h-6 w-40 bg-[#ffffff20] rounded" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-full bg-[#141a14] rounded border border-[#ffffff0a]" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 p-6 border border-[#ffffff12] bg-[#0d110d] rounded-lg space-y-4">
          <div className="h-6 w-32 bg-[#c8ff3d33] rounded" />
          <div className="h-32 bg-[#141a14] rounded border border-[#ffffff0a]" />
        </div>
      </div>
    </div>
  );
}
