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

    function render(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let animating = false;

      if (mode === "enter") {
        for (const p of grid) {
          if (elapsed < p.delay) {
            ctx.fillStyle = "rgba(13, 17, 13, 0.98)";
            ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
            animating = true;
          } else if (elapsed < p.delay + p.duration) {
            const progress = (elapsed - p.delay) / p.duration;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 1 - progress;
            ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
            if (progress < 0.35) {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(p.x + 2, p.y + 2, pixelSize - 4, pixelSize - 4);
            }
            ctx.globalAlpha = 1;
            animating = true;
          }
        }
      } else {
        // Exit: pixels cascade from top-left to bottom-right
        for (const p of grid) {
          if (elapsed >= p.delay + p.duration) {
            ctx.fillStyle = "rgba(13, 17, 13, 0.98)";
            ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
          } else if (elapsed >= p.delay) {
            const progress = (elapsed - p.delay) / p.duration;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = progress;
            ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
            if (progress > 0.6) {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(p.x + 2, p.y + 2, pixelSize - 4, pixelSize - 4);
            }
            ctx.globalAlpha = 1;
            animating = true;
          } else {
            animating = true;
          }
        }
      }

      if (animating && elapsed < 290) {
        animationId = requestAnimationFrame(render);
      } else {
        if (mode === "enter") {
          ctx.clearRect(0, 0, width, height);
        }
        onComplete?.();
      }
    }

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [mode, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-40 h-full w-full rounded"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export function BackToTop() {
  const [mounted, setMounted] = useState(false);
  const [transitionMode, setTransitionMode] = useState<"enter" | "exit" | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100))) : 0;
      setScrollProgress(p);

      if (scrollY > 280) {
        if (!mounted && transitionMode !== "enter") {
          setMounted(true);
          setTransitionMode("enter");
        }
      } else {
        if (mounted && transitionMode !== "exit") {
          setTransitionMode("exit");
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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
          {/* 8-Bit Pixel Perimeter Progress Ring */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full back-to-top-progress-ring"
            style={{ shapeRendering: "crispEdges", transform: "none" }}
          >
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              fill="none"
              stroke="rgba(200, 255, 61, 0.15)"
              strokeWidth="2"
              strokeDasharray="4 2"
              rx="4"
            />
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              fill="none"
              stroke="#c8ff3d"
              strokeWidth="2"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - scrollProgress}
              rx="4"
              style={{
                transition: "stroke-dashoffset 0.15s ease-out",
                filter: "drop-shadow(0 0 4px rgba(200, 255, 61, 0.6))",
              }}
            />
          </svg>

          <span className="flex-shrink-0">BACK TO TOP</span>
          <span className="w-[30px] text-right font-mono text-[9px] font-bold text-[#c8ff3d] tabular-nums tracking-tighter inline-block flex-shrink-0">
            {scrollProgress}%
          </span>
          <PixelArrowUp size={13} className="back-to-top-arrow-icon flex-shrink-0 text-[#c8ff3d]" />
        </PixelCard>
      </div>
    </div>
  );
}
