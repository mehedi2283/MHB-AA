"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((currentY / docHeight) * 100))) : 0;
      setScrollProgress(progress);

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
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="back-to-top-btn group relative select-none flex items-center gap-1.5 h-[28px] px-2.5 bg-[#090e09]/95 hover:bg-[#0f160f] border border-white/[0.14] hover:border-[#c8ff3d]/60 rounded shadow-[0_8px_24px_rgba(0,0,0,0.8),0_0_12px_rgba(200,255,61,0.08)] backdrop-blur-md transition-all duration-200 cursor-pointer overflow-hidden"
        aria-label="Back to top"
      >
        {/* Compact Label & Progress */}
        <div className="flex items-center gap-1.5 pointer-events-none">
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#838e7f] group-hover:text-white transition-colors">
            TOP
          </span>
          <span className="text-[8px] text-white/25">/</span>
          <span className="font-mono text-[10px] font-bold text-[#c8ff3d] tabular-nums">
            {scrollProgress}%
          </span>
          <ArrowUp
            size={11}
            strokeWidth={2.5}
            className="text-[#c8ff3d] group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </div>

        {/* Micro Neon Linear Progress Bar */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#141e14] overflow-hidden">
          <div
            className="h-full bg-[#c8ff3d] shadow-[0_0_6px_#c8ff3d]"
            style={{
              width: `${scrollProgress}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </button>
    </div>
  );
}
