"use client";

import { Globe } from "@/components/magicui/globe";

export function AutomationCore() {
  return (
    <div className="automation-core-stage flex items-center justify-center relative min-h-[460px] lg:min-h-[540px]">
      <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center">
        <Globe className="scale-110" />
      </div>
    </div>
  );
}
