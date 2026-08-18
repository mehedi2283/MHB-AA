"use client";

import React from "react";
import { PixelCard } from "./PixelCard";

export function TechSignal({ technologies }: { technologies: string[] }) {
  return (
    <div className="signal-board">
      <div className="signal-line" aria-hidden="true" />
      {technologies.map((technology, index) => (
        <PixelCard
          as="div"
          variant="glass"
          gridSize={6}
          className="signal-chip"
          style={{ "--delay": `${index * 45}ms` } as React.CSSProperties}
          key={technology}
        >
          <span className="signal-dot" />
          {technology}
          <small>{String(index + 1).padStart(2, "0")}</small>
        </PixelCard>
      ))}
    </div>
  );
}
