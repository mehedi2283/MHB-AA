"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-md">
        <PixelCard
          as="button"
          variant="glass"
          gridSize={6}
          onClick={scrollToTop}
          className="back-to-top-btn group relative select-none"
          aria-label="Back to top"
        >
          {/* Razor-Sharp Clean Vector Perimeter Progress Ring */}
          <svg
            viewBox="0 0 154 38"
            className="pointer-events-none absolute inset-0 h-full w-full z-40 back-to-top-progress-ring"
          >
            {/* Background subtle border track */}
            <rect
              x="1"
              y="1"
              width="152"
              height="36"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.5"
              rx="4"
            />
            {/* Glowing active progress stroke */}
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
              rx="4"
              style={{
                transition: "stroke-dashoffset 0.12s linear",
                filter: "drop-shadow(0 0 5px rgba(200, 255, 61, 0.7))",
              }}
            />
          </svg>

          {/* Button Text and Arrow (Layered at z-40 for crisp clarity) */}
          <div className="relative z-40 flex items-center justify-between w-full pointer-events-none px-0.5">
            <span className="flex-shrink-0 text-[10.5px] font-bold text-white tracking-wider">
              BACK TO TOP
            </span>
            <span className="w-[32px] text-right font-mono text-[10px] font-bold text-[#c8ff3d] tabular-nums tracking-tighter inline-block flex-shrink-0">
              {scrollProgress}%
            </span>
            <ArrowUp size={13} strokeWidth={2.5} className="back-to-top-arrow-icon flex-shrink-0 text-[#c8ff3d]" />
          </div>
        </PixelCard>
      </div>
    </div>
  );
}
