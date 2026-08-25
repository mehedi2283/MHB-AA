"use client";

import React, { useEffect, useRef, useState } from "react";
import { PixelArrowUp } from "./PixelIcons";
import { PixelCard } from "./PixelCard";

function BackToTopPixelTransition({
  mode,
  onComplete,
}: {
  mode: "enter" | "exit";
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 150);
    const height = (canvas.height = canvas.offsetHeight || 38);
    const pixelSize = 8;
    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);

    const grid: {
      x: number;
      y: number;
      delay: number;
      duration: number;
      color: string;
    }[] = [];

    const colors = [
      "rgba(200, 255, 61, 0.95)", // Acid Neon
      "rgba(255, 255, 255, 0.95)", // Cyber White
      "rgba(200, 255, 61, 0.65)",
      "rgba(255, 255, 255, 0.45)",
    ];

    if (mode === "enter") {
      // Come from BOTTOM-RIGHT to TOP-LEFT
      const maxDist = (cols - 1) + (rows - 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const distFromBottomRight = (cols - 1 - c) + (rows - 1 - r);
          const norm = distFromBottomRight / (maxDist || 1);
          const baseDelay = norm * 160;
          grid.push({
            x: c * pixelSize,
            y: r * pixelSize,
            delay: baseDelay + Math.random() * 25,
            duration: 90 + Math.random() * 40,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    } else {
      // Go from TOP-LEFT to BOTTOM-RIGHT
      const maxDist = (cols - 1) + (rows - 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const distFromTopLeft = c + r;
          const norm = distFromTopLeft / (maxDist || 1);
          const baseDelay = norm * 150;
          grid.push({
            x: c * pixelSize,
            y: r * pixelSize,
            delay: baseDelay + Math.random() * 25,
            duration: 80 + Math.random() * 40,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    }

    const startTime = performance.now();
    let animationId: number;

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, width, height);

      let allDone = true;

      for (let i = 0; i < grid.length; i++) {
        const p = grid[i];
        if (elapsed < p.delay) {
          allDone = false;
          if (mode === "exit") {
            // Still visible before exit
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
          }
          continue;
        }

        const progress = Math.min(1, (elapsed - p.delay) / p.duration);
        if (progress < 1) allDone = false;

        if (mode === "enter") {
          // Pixel scales up into place
          if (progress > 0) {
            const size = (pixelSize - 1) * progress;
            const offset = (pixelSize - 1 - size) / 2;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x + offset, p.y + offset, size, size);
          }
        } else {
          // Pixel scales down and disappears
          if (progress < 1) {
            const size = (pixelSize - 1) * (1 - progress);
            const offset = (pixelSize - 1 - size) / 2;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x + offset, p.y + offset, size, size);
          }
        }
      }

      if (allDone) {
        onComplete?.();
      } else {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationId);
  }, [mode, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export function BackToTop() {
  const [mounted, setMounted] = useState(false);
  const [transitionMode, setTransitionMode] = useState<"enter" | "exit" | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((currentY / docHeight) * 100))) : 0;
      setScrollProgress(progress);

      const isScrollingUp = currentY < lastScrollY.current;
      const isPastThreshold = currentY > 300;
      lastScrollY.current = currentY;

      // Show condition: Scrolled down past 300px AND actively scrolling UP
      const shouldShow = isPastThreshold && isScrollingUp;

      if (shouldShow && !isVisibleRef.current) {
        isVisibleRef.current = true;
        setMounted(true);
        setTransitionMode("enter");
      } else if (!shouldShow && isVisibleRef.current) {
        isVisibleRef.current = false;
        setTransitionMode("exit");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, transitionMode]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleTransitionComplete() {
    if (transitionMode === "exit") {
      setMounted(false);
      setTransitionMode(null);
    } else {
      setTransitionMode(null);
    }
  }

  if (!mounted) return null;

  return (
    <div className="fixed bottom-[86px] right-6 z-50 pointer-events-auto">
      <div className="relative overflow-hidden rounded">
        {transitionMode && (
          <BackToTopPixelTransition
            mode={transitionMode}
            onComplete={handleTransitionComplete}
          />
        )}
        <PixelCard
          as="button"
          variant="glass"
          gridSize={6}
          onClick={scrollToTop}
          className="back-to-top-btn group relative"
          aria-label="Back to top"
        >
          {/* Razor-Sharp 8-Bit Pixel Perimeter Progress Ring (Locked at z-40) */}
          <svg
            viewBox="0 0 154 38"
            className="pointer-events-none absolute inset-0 h-full w-full z-40 back-to-top-progress-ring"
            style={{ shapeRendering: "crispEdges" }}
          >
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
                transition: "stroke-dashoffset 0.15s ease-out",
                filter: "drop-shadow(0 0 4px rgba(200, 255, 61, 0.6))",
              }}
            />
          </svg>

          {/* Button Text and Arrow (Relative z-40 so it stays above sparkles) */}
          <div className="relative z-40 flex items-center justify-between w-full pointer-events-none">
            <span className="flex-shrink-0">BACK TO TOP</span>
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
