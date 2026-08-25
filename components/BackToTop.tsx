"use client";

import React, { useEffect, useState } from "react";
import { PixelArrowUp } from "./PixelIcons";
import { PixelCard } from "./PixelCard";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((currentY / docHeight) * 100))) : 0;
      setScrollProgress(progress);

      // Show whenever scrolled down past 200px
      if (currentY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    // Check initial scroll on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className={`fixed bottom-[86px] right-6 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="relative overflow-hidden rounded">
        <PixelCard
          as="button"
          variant="glass"
          gridSize={6}
          onClick={scrollToTop}
          className="back-to-top-btn group relative select-none"
          aria-label="Back to top"
        >
          {/* Razor-Sharp 8-Bit Pixel Perimeter Progress Ring (Locked at z-40) */}
          <svg
            viewBox="0 0 154 38"
            className="pointer-events-none absolute inset-0 h-full w-full z-40 back-to-top-progress-ring"
            style={{ shapeRendering: "crispEdges" }}
          >
            {/* Background perimeter track */}
            <rect
              x="1"
              y="1"
              width="152"
              height="36"
              fill="none"
              stroke="rgba(200, 255, 61, 0.15)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              rx="3"
            />
            {/* Active glowing progress track */}
            <rect
              x="1"
              y="1"
              width="152"
              height="36"
              fill="none"
              stroke="#c8ff3d"
              strokeWidth="1.5"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - scrollProgress}
              rx="3"
              style={{
                transition: "stroke-dashoffset 0.12s linear",
                filter: "drop-shadow(0 0 4px rgba(200, 255, 61, 0.6))",
              }}
            />
          </svg>

          {/* Button Text and Arrow (Relative z-40 so it stays above sparkles) */}
          <div className="relative z-40 flex items-center justify-between w-full pointer-events-none">
            <span className="flex-shrink-0 font-mono tracking-wider">BACK TO TOP</span>
            <span className="w-[30px] text-right font-mono text-[9px] font-bold text-[#c8ff3d] tabular-nums tracking-tighter inline-block flex-shrink-0">
              {scrollProgress}%
            </span>
            <PixelArrowUp size={13} className="back-to-top-arrow-icon flex-shrink-0 text-[#c8ff3d]" />
          </div>
        </PixelCard>
      </div>
    </div>
  );
}
