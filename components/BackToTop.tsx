"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PixelArrowUp } from "./PixelIcons";
import { PixelCard } from "./PixelCard";

function BackToTopPixelOverlay({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 140);
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
      "rgba(200, 255, 61, 0.60)",
      "rgba(255, 255, 255, 0.40)",
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const diagNorm = (c + (rows - 1 - r)) / (cols + rows);
        const baseDelay = diagNorm * 120;
        grid.push({
          x: c * pixelSize,
          y: r * pixelSize,
          delay: baseDelay + Math.random() * 30,
          duration: 90 + Math.random() * 50,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    const startTime = performance.now();
    let animationId: number;

    function render(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let animating = false;

      for (const p of grid) {
        if (elapsed < p.delay) {
          ctx.fillStyle = "rgba(13, 17, 13, 0.95)";
          ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
          animating = true;
        } else if (elapsed < p.delay + p.duration) {
          const progress = (elapsed - p.delay) / p.duration;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 1 - progress;
          ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
          if (progress < 0.4) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(p.x + 2, p.y + 2, pixelSize - 4, pixelSize - 4);
          }
          ctx.globalAlpha = 1;
          animating = true;
        }
      }

      if (animating && elapsed < 260) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        onComplete?.();
      }
    }

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30 h-full w-full rounded"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [isPixelating, setIsPixelating] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 300) {
        setVisible((prev) => {
          if (!prev) setIsPixelating(true);
          return true;
        });
      } else {
        setVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10, transition: { duration: 0.18 } }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed bottom-[86px] right-6 z-50 pointer-events-auto"
        >
          {isPixelating && <BackToTopPixelOverlay onComplete={() => setIsPixelating(false)} />}
          <PixelCard
            as="button"
            variant="glass"
            gridSize={6}
            onClick={scrollToTop}
            className="back-to-top-btn"
            aria-label="Back to top"
          >
            <span>BACK TO TOP</span>
            <PixelArrowUp size={13} />
          </PixelCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
