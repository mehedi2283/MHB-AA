"use client";

import React, { useEffect, useRef, useState } from "react";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "primaryButton" | "acid" | "amber" | "mixed";
  gridSize?: number;
  interactive?: boolean;
  borderOnly?: boolean;
  as?: "div" | "article" | "a" | "button" | "section";
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const GLASS_PALETTES = {
  glass: [
    "rgba(255, 255, 255, 0.92)",
    "rgba(200, 255, 61, 0.95)",
    "rgba(255, 255, 255, 0.70)",
    "rgba(200, 255, 61, 0.60)",
    "rgba(235, 255, 160, 0.85)",
    "rgba(255, 255, 255, 0.40)",
    "rgba(160, 200, 90, 0.75)",
  ],
  primaryButton: [
    "rgba(0, 0, 0, 0.75)",
    "rgba(15, 25, 10, 0.85)",
    "rgba(255, 255, 255, 0.95)",
    "rgba(200, 255, 61, 0.98)",
    "rgba(235, 255, 160, 0.90)",
    "rgba(0, 0, 0, 0.50)",
  ],
  acid: [
    "rgba(200, 255, 61, 0.95)",
    "rgba(255, 255, 255, 0.90)",
    "rgba(217, 255, 116, 0.80)",
    "rgba(200, 255, 61, 0.60)",
    "rgba(255, 255, 255, 0.40)",
  ],
  amber: [
    "rgba(245, 158, 11, 0.90)",
    "rgba(251, 191, 36, 0.80)",
    "rgba(255, 255, 255, 0.90)",
    "rgba(234, 88, 12, 0.70)",
    "rgba(255, 255, 255, 0.40)",
  ],
  mixed: [
    "rgba(255, 255, 255, 0.92)",
    "rgba(200, 255, 61, 0.95)",
    "rgba(245, 158, 11, 0.75)",
    "rgba(255, 255, 255, 0.50)",
    "rgba(143, 108, 255, 0.65)",
    "rgba(255, 255, 255, 0.35)",
  ],
};

const OVERFLOW_PAD = 20; // 20px spillover margin outside the container

export function PixelCard({
  children,
  className = "",
  variant = "glass",
  gridSize = 9,
  interactive = true,
  borderOnly = false,
  as = "div",
  href,
  disabled,
  type,
  target,
  rel,
  onClick,
  style,
}: PixelCardProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !interactive) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const palette = GLASS_PALETTES[variant] || GLASS_PALETTES.glass;

    let animationFrameId: number;
    let cardWidth = 0;
    let cardHeight = 0;
    let totalWidth = 0;
    let totalHeight = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;

    // Per-pixel individual lifetime countdown (1-by-1 spawn in and despawn out)
    let pixelLife: Int16Array = new Int16Array(0);
    let pixelMaxLife: Int16Array = new Int16Array(0);
    let pixelColorIdx: Uint8Array = new Uint8Array(0);
    let pixelOpacity: Float32Array = new Float32Array(0);

    const mouse = {
      x: -100,
      y: -100,
      prevX: -100,
      prevY: -100,
      isInside: false,
    };

    function initGrid() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const measuredW = Math.max(container.clientWidth || 0, Math.floor(rect.width));
      const measuredH = Math.max(container.clientHeight || 0, Math.floor(rect.height));

      if (measuredW <= 0 || measuredH <= 0) return;

      cardWidth = measuredW;
      cardHeight = measuredH;
      totalWidth = cardWidth + OVERFLOW_PAD * 2;
      totalHeight = cardHeight + OVERFLOW_PAD * 2;

      cols = Math.ceil(totalWidth / gridSize);
      rows = Math.ceil(totalHeight / gridSize);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(totalWidth * dpr);
      canvas.height = Math.round(totalHeight * dpr);
      canvas.style.width = `${totalWidth}px`;
      canvas.style.height = `${totalHeight}px`;
      canvas.style.left = `-${OVERFLOW_PAD}px`;
      canvas.style.top = `-${OVERFLOW_PAD}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const totalCells = cols * rows;
      if (pixelLife.length !== totalCells) {
        pixelLife = new Int16Array(totalCells);
        pixelMaxLife = new Int16Array(totalCells);
        pixelColorIdx = new Uint8Array(totalCells);
        pixelOpacity = new Float32Array(totalCells);
      }
    }

    // Spawn an individual pixel with random lifetime
    function spawnPixel(c: number, r: number, minLife = 18, maxLife = 40, opacity = 0.65) {
      if (c < 0 || c >= cols || r < 0 || r >= rows) return;
      const idx = r * cols + c;

      // Only re-spawn if unlit or near expiration to keep steady 1-by-1 turnover
      if (pixelLife[idx] <= 5) {
        const life = Math.floor(minLife + Math.random() * (maxLife - minLife));
        pixelLife[idx] = life;
        pixelMaxLife[idx] = life;
        pixelColorIdx[idx] = Math.floor(Math.random() * palette.length);
        pixelOpacity[idx] = opacity * (0.75 + Math.random() * 0.4);
      }
    }

    // Progressive ambient dissolution stream (spawns a few tiles per frame so it trails in organically)
    function spawnAmbientBorderStream() {
      if (cols <= 0 || rows <= 0) return;
      const minCol = Math.floor(OVERFLOW_PAD / gridSize);
      const maxCol = Math.floor((OVERFLOW_PAD + cardWidth) / gridSize);
      const minRow = Math.floor(OVERFLOW_PAD / gridSize);
      const maxRow = Math.floor((OVERFLOW_PAD + cardHeight) / gridSize);

      // Bottom dissolution band: spawn 3-6 random tiles per frame
      for (let i = 0; i < 4; i++) {
        const c = minCol - 2 + Math.floor(Math.random() * (maxCol - minCol + 5));
        const r = maxRow - 3 + Math.floor(Math.random() * 7);
        const distFromBorder = Math.abs(r - maxRow);
        const opacity = Math.max(0.25, 0.75 - distFromBorder * 0.1);
        spawnPixel(c, r, 20, 48, opacity);
      }

      // Vertical side borders: spawn 1-2 random tiles per frame
      if (Math.random() < 0.65) {
        const isLeft = Math.random() < 0.5;
        const baseC = isLeft ? minCol : maxCol;
        const c = baseC + Math.floor(Math.random() * 5) - 2;
        const r = minRow + Math.floor(Math.random() * (maxRow - minRow + 1));
        spawnPixel(c, r, 16, 38, 0.6);
      }

      // Top edge & corners: spawn occasionally
      if (Math.random() < 0.4) {
        const c = Math.random() < 0.5 ? minCol + Math.floor(Math.random() * 4) - 2 : maxCol + Math.floor(Math.random() * 4) - 2;
        const r = minRow + Math.floor(Math.random() * 3) - 1;
        spawnPixel(c, r, 15, 35, 0.55);
      }
    }

    // Pointer trail stepping
    function depositPointerTrail(x: number, y: number) {
      const centerC = Math.floor(x / gridSize);
      const centerR = Math.floor(y / gridSize);

      spawnPixel(centerC, centerR, 20, 45, 0.85);
      if (Math.random() < 0.75) spawnPixel(centerC + 1, centerR, 16, 38, 0.7);
      if (Math.random() < 0.75) spawnPixel(centerC - 1, centerR, 16, 38, 0.7);
      if (Math.random() < 0.75) spawnPixel(centerC, centerR + 1, 16, 38, 0.7);
      if (Math.random() < 0.75) spawnPixel(centerC, centerR - 1, 16, 38, 0.7);

      if (Math.random() < 0.45) spawnPixel(centerC + 1, centerR + 1, 14, 32, 0.55);
      if (Math.random() < 0.45) spawnPixel(centerC - 1, centerR + 1, 14, 32, 0.55);
      if (Math.random() < 0.45) spawnPixel(centerC + 1, centerR - 1, 14, 32, 0.55);
      if (Math.random() < 0.45) spawnPixel(centerC - 1, centerR - 1, 14, 32, 0.55);
    }

    function render() {
      animationFrameId = requestAnimationFrame(render);
      if (!ctx || totalWidth <= 0 || totalHeight <= 0) return;

      // While hovered: continuously stream new ambient and trail pixels
      if (mouse.isInside) {
        spawnAmbientBorderStream();

        if (mouse.prevX >= 0) {
          const canvasX = mouse.x + OVERFLOW_PAD;
          const canvasY = mouse.y + OVERFLOW_PAD;
          const prevCanvasX = mouse.prevX + OVERFLOW_PAD;
          const prevCanvasY = mouse.prevY + OVERFLOW_PAD;

          const dx = canvasX - prevCanvasX;
          const dy = canvasY - prevCanvasY;
          const dist = Math.hypot(dx, dy);
          const steps = Math.max(1, Math.min(8, Math.ceil(dist / (gridSize * 0.7))));

          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const px = prevCanvasX + dx * t;
            const py = prevCanvasY + dy * t;
            depositPointerTrail(px, py);
          }
          mouse.prevX = mouse.x;
          mouse.prevY = mouse.y;
        }
      }

      ctx.clearRect(0, 0, totalWidth, totalHeight);

      let activeCount = 0;

      // Update and draw all active pixels (each counts down independently and pops off 1 by 1)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          let life = pixelLife[idx];

          if (life > 0) {
            // Decrement remaining frame tick
            pixelLife[idx] = life - 1;

            // When life reaches 0, pixel instantly turns OFF (1 by 1 pop-off)
            if (life - 1 > 0) {
              activeCount++;
              const maxL = pixelMaxLife[idx];
              const ratio = (life - 1) / maxL;
              
              // 2-step digital alpha threshold (chunky pixel look with subtle fade step before turning off)
              const stepMultiplier = ratio > 0.25 ? 1.0 : 0.6;
              const alpha = pixelOpacity[idx] * stepMultiplier;

              const px = c * gridSize;
              const py = r * gridSize;
              const size = gridSize - 1;
              const color = palette[pixelColorIdx[idx] % palette.length];

              ctx.fillStyle = color;
              ctx.globalAlpha = Math.min(0.85, alpha);
              ctx.fillRect(px, py, size, size);
            }
          }
        }
      }

      if (activeCount === 0 && !mouse.isInside) {
        ctx.clearRect(0, 0, totalWidth, totalHeight);
      }

      ctx.globalAlpha = 1;
    }

    function handlePointerMove(e: PointerEvent) {
      if (!container) return;
      if (cols <= 0 || rows <= 0) initGrid();
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!mouse.isInside) {
        mouse.prevX = x;
        mouse.prevY = y;
        mouse.isInside = true;
        setIsHovered(true);
      }
      mouse.x = x;
      mouse.y = y;
    }

    function handlePointerEnter(e: PointerEvent) {
      if (!container) return;
      initGrid();
      const rect = container.getBoundingClientRect();
      mouse.x = mouse.prevX = e.clientX - rect.left;
      mouse.y = mouse.prevY = e.clientY - rect.top;
      mouse.isInside = true;
      setIsHovered(true);

      // Start streaming ambient pixels on enter
      depositPointerTrail(mouse.x + OVERFLOW_PAD, mouse.y + OVERFLOW_PAD);
    }

    function handlePointerLeave() {
      mouse.isInside = false;
      mouse.prevX = -100;
      mouse.prevY = -100;
      setIsHovered(false);
      // NOTE: We do NOT clear canvas on leave! Pixels continue counting down and naturally pop off 1 by 1!
    }

    const resizeObserver = new ResizeObserver(() => {
      initGrid();
    });

    resizeObserver.observe(container);
    initGrid();

    container.addEventListener("pointermove", handlePointerMove as EventListener, { passive: true });
    container.addEventListener("pointerenter", handlePointerEnter as EventListener, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave as EventListener, { passive: true });

    animationFrameId = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove as EventListener);
      container.removeEventListener("pointerenter", handlePointerEnter as EventListener);
      container.removeEventListener("pointerleave", handlePointerLeave as EventListener);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, gridSize, interactive, borderOnly]);

  const isFixed = className.includes("fixed") || className.includes("ai-launcher") || className.includes("back-to-top-btn");

  const commonProps = {
    ref: containerRef as React.Ref<any>,
    className: `pixel-card-container ${isFixed ? "" : "relative"} overflow-visible ${className} ${isHovered ? "is-pixel-active" : ""}`,
    style,
    onClick,
  };

  const canvasOverlay = interactive ? (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pixel-card-canvas pointer-events-none absolute z-30"
    />
  ) : null;

  if (as === "a") {
    return (
      <a {...commonProps} href={href} target={target} rel={rel}>
        {children}
        {canvasOverlay}
      </a>
    );
  }

  if (as === "article") {
    return (
      <article {...commonProps}>
        {children}
        {canvasOverlay}
      </article>
    );
  }

  if (as === "button") {
    return (
      <button {...commonProps} disabled={disabled} type={type}>
        {children}
        {canvasOverlay}
      </button>
    );
  }

  if (as === "section") {
    return (
      <section {...commonProps}>
        {children}
        {canvasOverlay}
      </section>
    );
  }

  return (
    <div {...commonProps}>
      {children}
      {canvasOverlay}
    </div>
  );
}
