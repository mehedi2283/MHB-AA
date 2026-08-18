"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import createGlobe, { COBEOptions } from "cobe";

export interface CityBadge {
  id: string;
  name: string;
  location: [number, number]; // [lat, lng]
  sub?: string;
  color?: string;
}

export interface ArcRoute {
  id: string;
  label: string;
  from: [number, number];
  to: [number, number];
  color: [number, number, number];
}

const CITY_BADGES: CityBadge[] = [
  { id: "nyc", name: "NYC", location: [40.7128, -74.006], sub: "Gazi AI Engine" },
  { id: "sf", name: "SF", location: [37.7749, -122.4194], sub: "Lead Pipeline" },
  { id: "london", name: "LONDON", location: [51.5074, -0.1278], sub: "UK Brand Ops" },
  { id: "paris", name: "PARIS", location: [48.8566, 2.3522] },
  { id: "dubai", name: "DUBAI", location: [25.2048, 55.2708], sub: "Real Estate AI" },
  { id: "tokyo", name: "TOKYO", location: [35.6762, 139.6503], sub: "Multi-Agent" },
  { id: "capetown", name: "CAPE TOWN", location: [-33.9249, 18.4241] },
  { id: "sydney", name: "SYDNEY", location: [-33.8688, 151.2093], sub: "Gaming Pub" },
];

const ARC_ROUTES: ArcRoute[] = [
  {
    id: "nyc-london",
    label: "NYC → LONDON",
    from: [40.7128, -74.006],
    to: [51.5074, -0.1278],
    color: [0.78, 1.0, 0.24],
  },
  {
    id: "sf-tokyo",
    label: "SF → TOKYO",
    from: [37.7749, -122.4194],
    to: [35.6762, 139.6503],
    color: [0.3, 0.65, 1.0],
  },
];

const COBE_MARKERS = [
  { location: [40.7128, -74.006] as [number, number], size: 0.045, id: "nyc" },
  { location: [37.7749, -122.4194] as [number, number], size: 0.045, id: "sf" },
  { location: [51.5074, -0.1278] as [number, number], size: 0.045, id: "london" },
  { location: [48.8566, 2.3522] as [number, number], size: 0.04, id: "paris" },
  { location: [25.2048, 55.2708] as [number, number], size: 0.045, id: "dubai" },
  { location: [35.6762, 139.6503] as [number, number], size: 0.045, id: "tokyo" },
  { location: [-33.9249, 18.4241] as [number, number], size: 0.04, id: "capetown" },
  { location: [-33.8688, 151.2093] as [number, number], size: 0.045, id: "sydney" },
];

const COBE_ARCS = ARC_ROUTES.map((r) => ({
  from: r.from,
  to: r.to,
  color: r.color,
}));

function project3D(
  lat: number,
  lon: number,
  phi: number,
  theta: number,
  radius = 0.8
) {
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

  const isFacing = z1 >= 0.05;
  const depthOpacity = Math.max(0, Math.min(1, (z1 + 0.1) / 0.7));

  const screenX = (x1 * radius + 1) / 2;
  const screenY = (-y1 * radius + 1) / 2;

  return {
    x: screenX,
    y: screenY,
    z: z1,
    isFacing,
    opacity: depthOpacity,
    scale: 0.75 + depthOpacity * 0.25,
  };
}

export function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const dragVelocity = useRef(0);

  const phiRef = useRef(0);
  const thetaRef = useRef(0.25);
  const widthRef = useRef(0);

  // Reactive state for 3D projected HTML badges
  const [projectedCities, setProjectedCities] = useState<
    Array<{ city: CityBadge; x: number; y: number; opacity: number; scale: number; visible: boolean }>
  >([]);

  const [projectedArcs, setProjectedArcs] = useState<
    Array<{ route: ArcRoute; x: number; y: number; opacity: number; scale: number; visible: boolean }>
  >([]);

  const [activeBadge, setActiveBadge] = useState<string | null>(null);

  const updateBadgeProjections = useCallback((phi: number, theta: number) => {
    const cities = CITY_BADGES.map((city) => {
      const proj = project3D(city.location[0], city.location[1], phi, theta, 0.82);
      return {
        city,
        x: proj.x,
        y: proj.y,
        opacity: proj.opacity,
        scale: proj.scale,
        visible: proj.opacity > 0.08,
      };
    });

    const arcs = ARC_ROUTES.map((route) => {
      // Projected midpoint of the arc in higher orbit
      const midLat = (route.from[0] + route.to[0]) / 2 + 18;
      const midLon = (route.from[1] + route.to[1]) / 2;
      const proj = project3D(midLat, midLon, phi, theta, 0.98);
      return {
        route,
        x: proj.x,
        y: proj.y,
        opacity: proj.opacity,
        scale: proj.scale,
        visible: proj.opacity > 0.15,
      };
    });

    setProjectedCities(cities);
    setProjectedArcs(arcs);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationFrameId: number;

    function handleResize() {
      if (!canvas) return;
      widthRef.current = canvas.offsetWidth;
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    const initialWidth = (widthRef.current || 460) * 2;

    globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: initialWidth,
      height: initialWidth,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 20000,
      mapBrightness: 5.8,
      // High-contrast matrix matching COBE V2 demo
      baseColor: [0.18, 0.28, 0.16],
      markerColor: [0.85, 1.0, 0.25],
      glowColor: [0.15, 0.28, 0.1],
      markers: COBE_MARKERS,
      arcs: COBE_ARCS,
      arcWidth: 0.35,
      arcHeight: 0.32,
    });

    let frameCount = 0;

    function animate() {
      if (pointerInteracting.current === null) {
        // Inertia damping & auto spin
        dragVelocity.current *= 0.92;
        phiRef.current += 0.003 + dragVelocity.current;
      } else {
        phiRef.current += pointerInteractionMovement.current;
        dragVelocity.current = pointerInteractionMovement.current;
        pointerInteractionMovement.current = 0;
      }

      const currentWidth = (widthRef.current || 460) * 2;
      globe?.update({
        phi: phiRef.current,
        theta: thetaRef.current,
        width: currentWidth,
        height: currentWidth,
      });

      // Update 2D HTML badge projections smoothly
      frameCount++;
      if (frameCount % 1 === 0) {
        updateBadgeProjections(phiRef.current, thetaRef.current);
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      try {
        globe?.destroy();
      } catch {}
    };
  }, [updateBadgeProjections]);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square w-full max-w-[580px] mx-auto select-none flex items-center justify-center ${className}`}
    >
      {/* Precision ambient background glow */}
      <div
        className="absolute inset-2 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,255,61,0.06) 0%, rgba(200,255,61,0.01) 55%, transparent 72%)",
        }}
      />

      {/* Outer subtle radar alignment rings */}
      <div className="absolute inset-0 rounded-full border border-white/[0.04] pointer-events-none" />
      <div className="absolute inset-8 rounded-full border border-[#c8ff3d]/[0.08] border-dashed pointer-events-none" />

      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing opacity-95 transition-opacity duration-300 z-10"
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          pointerInteractionMovement.current = 0;
          canvasRef.current?.classList.add("cursor-grabbing");
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current?.classList.remove("cursor-grabbing");
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current?.classList.remove("cursor-grabbing");
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteracting.current = e.clientX;
            pointerInteractionMovement.current = delta * 0.005;
          }
        }}
        onTouchStart={(e) => {
          if (e.touches[0]) {
            pointerInteracting.current = e.touches[0].clientX;
            pointerInteractionMovement.current = 0;
          }
        }}
        onTouchEnd={() => {
          pointerInteracting.current = null;
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteracting.current = e.touches[0].clientX;
            pointerInteractionMovement.current = delta * 0.005;
          }
        }}
      />

      {/* 3D Projected Connected Route Badges (e.g. NYC → LONDON, SF → TOKYO) */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {projectedArcs.map(({ route, x, y, opacity, scale, visible }) => {
          if (!visible) return null;
          return (
            <div
              key={route.id}
              className="absolute transition-transform duration-75"
              style={{
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                opacity: opacity,
                transform: `translate(-50%, -50%) scale(${scale})`,
              }}
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d120d]/90 border border-[#c8ff3d]/60 shadow-[0_0_15px_rgba(200,255,61,0.25)] text-[10px] font-mono font-bold text-[#c8ff3d] tracking-wider whitespace-nowrap backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-[#c8ff3d] animate-ping" />
                <span>{route.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3D Projected Interactive City Pins & Badges */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {projectedCities.map(({ city, x, y, opacity, scale, visible }) => {
          if (!visible) return null;
          const isActive = activeBadge === city.id;
          return (
            <div
              key={city.id}
              className="absolute pointer-events-auto transition-transform duration-75 group cursor-pointer"
              style={{
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                opacity: opacity,
                transform: `translate(-50%, -100%) scale(${scale})`,
              }}
              onClick={() => setActiveBadge(isActive ? null : city.id)}
            >
              {/* Badge container with pinpoint needle */}
              <div className="flex flex-col items-center">
                <div
                  className={`px-2.5 py-1 rounded border font-mono text-[10px] font-extrabold tracking-wider transition-all duration-200 shadow-lg backdrop-blur-md whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#c8ff3d] text-[#090b08] border-[#c8ff3d] shadow-[0_0_20px_#c8ff3d80] scale-110"
                      : "bg-[#0051ff] text-white border-[#3880ff] hover:bg-[#0040cc] hover:scale-105"
                  }`}
                >
                  <span>{city.name}</span>
                  {city.sub && (
                    <span
                      className={`text-[8px] font-normal px-1 rounded ${
                        isActive ? "bg-black/20 text-black" : "bg-white/20 text-white/90"
                      }`}
                    >
                      {city.sub}
                    </span>
                  )}
                </div>

                {/* Pinpoint needle pointing to WebGL surface dot */}
                <div className="w-[1.5px] h-2.5 bg-gradient-to-b from-[#3880ff] to-[#c8ff3d] shadow-[0_0_6px_#c8ff3d]" />
                <div className="size-1 rounded-full bg-[#c8ff3d] shadow-[0_0_8px_#c8ff3d]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
