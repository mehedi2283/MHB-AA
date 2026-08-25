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
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="relative overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/[0.12] hover:border-[#c8ff3d] transition-colors duration-200 bg-[#0d120d]/95 backdrop-blur-md">
        <button
          onClick={scrollToTop}
          className="back-to-top-btn group relative select-none flex items-center justify-between w-[154px] h-[38px] px-3.5 bg-transparent border-0 cursor-pointer"
          aria-label="Back to top"
        >
          {/* Button Text and Arrow */}
          <div className="flex items-center justify-between w-full pointer-events-none">
            <span className="text-[11px] font-bold text-white tracking-wider">
              BACK TO TOP
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] font-bold text-[#c8ff3d] tabular-nums tracking-tighter">
                {scrollProgress}%
              </span>
              <ArrowUp size={13} strokeWidth={2.5} className="back-to-top-arrow-icon text-[#c8ff3d]" />
            </div>
          </div>

          {/* Sleek Bottom Linear Progress Bar */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1a2619] overflow-hidden rounded-b">
            <div
              className="h-full bg-[#c8ff3d] shadow-[0_0_8px_#c8ff3d]"
              style={{
                width: `${scrollProgress}%`,
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
