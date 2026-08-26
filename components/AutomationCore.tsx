"use client";

import { Globe } from "@/components/magicui/globe";
import type { GlobeMarker, GlobeArc } from "@/lib/site-content";

export function AutomationCore({
  markers,
  arcs,
}: {
  markers?: GlobeMarker[];
  arcs?: GlobeArc[];
}) {
  return (
    <div className="automation-core-stage flex items-center justify-center relative min-h-[440px] lg:min-h-[500px]">
      <div className="relative w-full max-w-[460px] lg:max-w-[500px] aspect-square flex items-center justify-center transform-gpu will-change-transform">
        <Globe markers={markers} arcs={arcs} />
      </div>
    </div>
  );
}
