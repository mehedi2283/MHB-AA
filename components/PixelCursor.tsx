"use client";

import React, { useEffect, useRef, useState } from "react";

export function PixelCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position state
  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    setMounted(true);

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mousePos.current = { x, y };

      if (!isVisible) setIsVisible(true);

      // INSTANT 0ms Update: Directly update main pointer on mousemove event
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      // Check if target is interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.closest(
            "a, button, input[type='submit'], [role='button'], .btn, select, .portfolio-select, .interactive, .cursor-pointer"
          ) !== null;
        const isInputField =
          target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

        setIsHovered(isInteractive && !isInputField);
        setIsText(isInputField);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Fast, responsive Lerp loop for the trailing reticle (factor 0.38 for snappy follow)
    const render = () => {
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.38;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.38;

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <div
      className={`pixel-cursor-container fixed inset-0 pointer-events-none z-[99999999] transition-opacity duration-150 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* 1. Main Instant 8-Bit Pixel Pointer */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 will-change-transform pointer-events-none"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        {isText ? (
          /* Text Beam Cursor */
          <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-2 h-0.5 bg-[#c8ff3d]" />
            <div className="w-0.5 h-4 bg-[#c8ff3d] shadow-[0_0_8px_#c8ff3d]" />
            <div className="w-2 h-0.5 bg-[#c8ff3d]" />
          </div>
        ) : isHovered ? (
          /* Target Crosshair */
          <div
            className={`-translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${
              isClicking ? "scale-75" : "scale-100"
            }`}
          >
            <div className="size-2.5 bg-[#c8ff3d] border border-black shadow-[0_0_10px_#c8ff3d]" />
          </div>
        ) : (
          /* Clean, Continuous 8-Bit Retro Arrow (Zero Broken Pixels) */
          <div
            className={`transition-transform duration-75 origin-top-left ${
              isClicking ? "scale-90" : "scale-100"
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
            >
              {/* Outer Black Border */}
              <path
                d="M0 0V15H3V12H5V14H7V17H9V14H7V11H12V9H9V7H7V5H5V3H3V0H0Z"
                fill="#000000"
              />
              {/* Inner Acid Green Fill */}
              <path
                d="M1 1V13H3V10H5V12H7V14H8V13H6V9H10V8H8V6H6V4H4V2H2V1H1Z"
                fill="#c8ff3d"
              />
              {/* White Pixel Highlight */}
              <rect x="2" y="2" width="1.5" height="1.5" fill="#ffffff" />
            </svg>
          </div>
        )}
      </div>

      {/* 2. Trailing Snappy 8-Bit Reticle / Aura */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 will-change-transform pointer-events-none"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
            isHovered
              ? "size-8 border border-[#c8ff3d] bg-[#c8ff3d15] shadow-[0_0_15px_rgba(200,255,61,0.4)] rotate-45 scale-110"
              : isClicking
              ? "size-3.5 border border-[#c8ff3d] bg-[#c8ff3d44] scale-75"
              : isText
              ? "size-0 opacity-0"
              : "size-5 border border-[#c8ff3d55] bg-[#c8ff3d08] rounded-full scale-100 shadow-[0_0_8px_rgba(200,255,61,0.2)]"
          }`}
        >
          {/* Corner Pixel Brackets on Hover */}
          {isHovered && (
            <>
              <div className="absolute top-0 left-0 size-1 bg-[#c8ff3d]" />
              <div className="absolute top-0 right-0 size-1 bg-[#c8ff3d]" />
              <div className="absolute bottom-0 left-0 size-1 bg-[#c8ff3d]" />
              <div className="absolute bottom-0 right-0 size-1 bg-[#c8ff3d]" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
