"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useMotionValue, useSpring } from "framer-motion";

export interface MarkerData {
  id: string;
  name: string;
  sub?: string;
  location: [number, number];
  size: number;
}

export interface ArcData {
  id: string;
  label: string;
  from: [number, number];
  to: [number, number];
}

export const DEFAULT_GLOBE_MARKERS: MarkerData[] = [
  { id: "nyc", name: "NYC", sub: "Gazi AI Engine", location: [40.7128, -74.006], size: 0.038 },
  { id: "sf", name: "SF", sub: "Lead Pipeline", location: [37.7749, -122.4194], size: 0.038 },
  { id: "london", name: "LONDON", sub: "UK Brand Ops", location: [51.5074, -0.1278], size: 0.038 },
  { id: "paris", name: "PARIS", location: [48.8566, 2.3522], size: 0.035 },
  { id: "dubai", name: "DUBAI", sub: "Real Estate AI", location: [25.2048, 55.2708], size: 0.038 },
  { id: "tokyo", name: "TOKYO", sub: "Multi-Agent", location: [35.6762, 139.6503], size: 0.038 },
  { id: "sydney", name: "SYDNEY", sub: "Gaming Pub", location: [-33.8688, 151.2093], size: 0.038 },
];

export const DEFAULT_GLOBE_ARCS: ArcData[] = [
  {
    id: "nyc-london",
    label: "NYC → LONDON",
    from: [40.7128, -74.006],
    to: [51.5074, -0.1278],
  },
  {
    id: "sf-tokyo",
    label: "SF → TOKYO",
    from: [37.7749, -122.4194],
    to: [35.6762, 139.6503],
  },
];

function project3D(lat: number, lon: number, phi: number, theta: number, radius = 0.8) {
  const rad = Math.PI / 180;
  const phiLat = lat * rad;
  const lambdaLon = lon * rad - Math.PI;

  const cosLat = Math.cos(phiLat);
  const sinLat = Math.sin(phiLat);

  const x0 = -cosLat * Math.cos(lambdaLon);
  const y0 = sinLat;
  const z0 = cosLat * Math.sin(lambdaLon);

  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const x1 = cosP * x0 + sinP * z0;
  const y1 = sinP * sinT * x0 + cosT * y0 - cosP * sinT * z0;
  const z1 = -sinP * cosT * x0 + sinT * y0 + cosP * cosT * z0;

  const depthOpacity = Math.max(0, Math.min(1, (z1 + 0.1) / 0.7));
  const screenX = (x1 * radius + 1) / 2;
  const screenY = (-y1 * radius + 1) / 2;

  return {
    x: screenX,
    y: screenY,
    opacity: depthOpacity,
    scale: 0.75 + depthOpacity * 0.25,
  };
}

export function Globe({
  className = "",
  markers = DEFAULT_GLOBE_MARKERS,
  arcs = DEFAULT_GLOBE_ARCS,
}: {
  className?: string;
  markers?: MarkerData[];
  arcs?: ArcData[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const markerDomMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const arcDomMap = useRef<Map<string, HTMLDivElement>>(new Map());

  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const widthRef = useRef(0);

  const activeMarkers = markers && markers.length > 0 ? markers : DEFAULT_GLOBE_MARKERS;
  const activeArcs = arcs && arcs.length > 0 ? arcs : DEFAULT_GLOBE_ARCS;

  // Framer Motion Spring Physics Engine for buttery-smooth horizontal & vertical damping
  const phiTarget = useMotionValue(0);
  const springPhi = useSpring(phiTarget, {
    mass: 0.8,
    stiffness: 140,
    damping: 24,
    restDelta: 0.0001,
  });

  const thetaTarget = useMotionValue(0.24);
  const springTheta = useSpring(thetaTarget, {
    mass: 0.8,
    stiffness: 140,
    damping: 24,
    restDelta: 0.0001,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationFrameId: number;
    let isVisibleOnScreen = true;

    function handleResize() {
      if (!canvas) return;
      widthRef.current = canvas.offsetWidth;
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    const initialWidth = (widthRef.current || 460) * 2;

    // Single unified acid-green palette matching reference
    const ACID_COLOR: [number, number, number] = [0.78, 1.0, 0.24];

    globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 2, 2),
      width: initialWidth,
      height: initialWidth,
      phi: 0,
      theta: 0.24,
      dark: 1,
      diffuse: 1.3,
      mapSamples: 16000,
      mapBrightness: 6,
      // Unified sleek dark matrix
      baseColor: [0.15, 0.24, 0.13],
      markerColor: ACID_COLOR,
      glowColor: [0.18, 0.32, 0.1],
      arcColor: ACID_COLOR,
      arcWidth: 0.45,
      arcHeight: 0.3,
      markers: activeMarkers.map((m) => ({
        location: m.location,
        size: m.size || 0.038,
        id: m.id,
      })),
      arcs: activeArcs.map((a) => ({
        from: a.from,
        to: a.to,
        id: a.id,
      })),
    });

    // Pause rendering when scrolled offscreen for 100% GPU efficiency
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleOnScreen = entry.isIntersecting;
    });
    observer.observe(canvas);

    // High-performance 60 FPS animation loop driven by 2-axis Spring Physics
    function animate() {
      if (isVisibleOnScreen) {
        if (pointerInteracting.current === null) {
          // Continuous silky-smooth auto rotation
          phiTarget.set(phiTarget.get() + 0.0035);
        }

        const currentPhi = springPhi.get();
        const currentTheta = springTheta.get();
        const currentWidth = (widthRef.current || 460) * 2;

        globe?.update({
          phi: currentPhi,
          theta: currentTheta,
          width: currentWidth,
          height: currentWidth,
        });

        // 60 FPS Direct DOM transforms for Markers (tracking both phi and theta)
        for (const marker of activeMarkers) {
          const el = markerDomMap.current.get(marker.id);
          if (el) {
            const proj = project3D(marker.location[0], marker.location[1], currentPhi, currentTheta, 0.82);
            el.style.transform = `translate3d(-50%, -100%, 0) scale(${proj.scale})`;
            el.style.left = `${proj.x * 100}%`;
            el.style.top = `${proj.y * 100}%`;
            el.style.opacity = `${proj.opacity}`;
            el.style.pointerEvents = proj.opacity > 0.3 ? "auto" : "none";
          }
        }

        // 60 FPS Direct DOM transforms for Arcs (tracking both phi and theta)
        for (const arc of activeArcs) {
          const el = arcDomMap.current.get(arc.id);
          if (el) {
            const midLat = (arc.from[0] + arc.to[0]) / 2 + 18;
            const midLon = (arc.from[1] + arc.to[1]) / 2;
            const proj = project3D(midLat, midLon, currentPhi, currentTheta, 0.97);
            el.style.transform = `translate3d(-50%, -50%, 0) scale(${proj.scale})`;
            el.style.left = `${proj.x * 100}%`;
            el.style.top = `${proj.y * 100}%`;
            el.style.opacity = `${proj.opacity}`;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      try {
        globe?.destroy();
      } catch {}
    };
  }, [phiTarget, springPhi, thetaTarget, springTheta, JSON.stringify(activeMarkers), JSON.stringify(activeArcs)]);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square w-full max-w-[560px] mx-auto select-none flex items-center justify-center ${className}`}
    >
      {/* Precision ambient background glow */}
      <div
        className="absolute inset-2 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,255,61,0.06) 0%, rgba(200,255,61,0.01) 55%, transparent 72%)",
        }}
      />

      {/* Subtle outer orbital alignment ring */}
      <div className="absolute inset-0 rounded-full border border-white/[0.04] pointer-events-none" />
      <div className="absolute inset-8 rounded-full border border-[#c8ff3d]/[0.08] border-dashed pointer-events-none" />

      {/* WebGL Canvas with 2-axis (X and Y) spring drag controls */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing opacity-95 transition-opacity duration-300 z-10 touch-none"
        onPointerDown={(e) => {
          pointerInteracting.current = { x: e.clientX, y: e.clientY };
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          canvasRef.current?.classList.add("cursor-grabbing");
        }}
        onPointerUp={(e) => {
          pointerInteracting.current = null;
          (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
          canvasRef.current?.classList.remove("cursor-grabbing");
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current?.classList.remove("cursor-grabbing");
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const deltaX = e.clientX - pointerInteracting.current.x;
            const deltaY = e.clientY - pointerInteracting.current.y;
            pointerInteracting.current = { x: e.clientX, y: e.clientY };

            // Horizontal rotation (left / right)
            phiTarget.set(phiTarget.get() + deltaX * 0.005);

            // Vertical tilt (up / down) - naturally follows drag direction
            const nextTheta = Math.max(-0.65, Math.min(0.85, thetaTarget.get() + deltaY * 0.005));
            thetaTarget.set(nextTheta);
          }
        }}
      />

      {/* 3D Projected Connected Route Badges */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {activeArcs.map((route) => (
          <div
            key={route.id}
            ref={(el) => {
              if (el) arcDomMap.current.set(route.id, el);
              else arcDomMap.current.delete(route.id);
            }}
            className="absolute will-change-transform opacity-0 pointer-events-none"
            style={{ left: "50%", top: "50%" }}
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d120d]/90 border border-[#c8ff3d]/60 shadow-[0_0_15px_rgba(200,255,61,0.25)] text-[10px] font-mono font-bold text-[#c8ff3d] tracking-wider whitespace-nowrap backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-[#c8ff3d] animate-ping" />
              <span>{route.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Projected Interactive City Pins & Badges */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {activeMarkers.map((city) => (
          <div
            key={city.id}
            ref={(el) => {
              if (el) markerDomMap.current.set(city.id, el);
              else markerDomMap.current.delete(city.id);
            }}
            className="absolute will-change-transform opacity-0 pointer-events-auto group cursor-pointer"
            style={{ left: "50%", top: "50%" }}
          >
            {/* Badge container with pinpoint needle */}
            <div className="flex flex-col items-center">
              <div className="px-2 py-0.5 rounded border border-[#c8ff3d]/70 bg-[#0d120d]/95 font-mono text-[9px] font-bold text-[#c8ff3d] tracking-wider transition-all duration-150 shadow-[0_0_12px_rgba(200,255,61,0.25)] group-hover:shadow-[0_0_20px_rgba(200,255,61,0.6)] group-hover:scale-110 backdrop-blur-md whitespace-nowrap flex items-center gap-1.5">
                <span>{city.name}</span>
                {city.sub && (
                  <span className="text-[8px] font-normal text-white/80 bg-white/10 px-1 rounded">
                    {city.sub}
                  </span>
                )}
              </div>

              {/* Pinpoint needle pointing to WebGL surface dot */}
              <div className="w-[1px] h-2 bg-gradient-to-b from-[#c8ff3d] to-[#c8ff3d]/30 shadow-[0_0_4px_#c8ff3d]" />
              <div className="size-1 rounded-full bg-[#c8ff3d] shadow-[0_0_6px_#c8ff3d]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
