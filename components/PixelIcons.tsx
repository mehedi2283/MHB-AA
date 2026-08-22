"use client";

import React from "react";

interface PixelIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * 8-Bit Pixel Art Icons
 * Designed on a strict pixel grid with integer coordinates for authentic retro aesthetic.
 */

// ↗ Stepped Pixel Diagonal Arrow
export function PixelArrowUpRight({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="5" y="2" width="9" height="2" />
      <rect x="12" y="4" width="2" height="7" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="8" y="6" width="2" height="2" />
      <rect x="6" y="8" width="2" height="2" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="2" y="12" width="2" height="2" />
    </svg>
  );
}

// ↑ Stepped Pixel Arrow Up
export function PixelArrowUp({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="7" y="2" width="2" height="12" />
      <rect x="5" y="4" width="2" height="2" />
      <rect x="9" y="4" width="2" height="2" />
      <rect x="3" y="6" width="2" height="2" />
      <rect x="11" y="6" width="2" height="2" />
      <rect x="1" y="8" width="2" height="2" />
      <rect x="13" y="8" width="2" height="2" />
    </svg>
  );
}

// → Stepped Pixel Arrow Right
export function PixelArrowRight({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="2" y="7" width="12" height="2" />
      <rect x="10" y="5" width="2" height="2" />
      <rect x="10" y="9" width="2" height="2" />
      <rect x="8" y="3" width="2" height="2" />
      <rect x="8" y="11" width="2" height="2" />
      <rect x="6" y="1" width="2" height="2" />
      <rect x="6" y="13" width="2" height="2" />
    </svg>
  );
}

// ↘ Stepped Pixel Down-Right Arrow
export function PixelArrowDownRight({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="5" y="12" width="9" height="2" />
      <rect x="12" y="5" width="2" height="7" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="8" y="8" width="2" height="2" />
      <rect x="6" y="6" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="2" y="2" width="2" height="2" />
    </svg>
  );
}

// ↳ Stepped Corner Down-Right Arrow
export function PixelCornerDownRight({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="2" y="3" width="2" height="7" />
      <rect x="4" y="8" width="8" height="2" />
      <rect x="9" y="6" width="2" height="2" />
      <rect x="9" y="10" width="2" height="2" />
      <rect x="11" y="7" width="2" height="4" />
    </svg>
  );
}

// 8-Bit Pixel Chat Bubble
export function PixelChat({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="3" y="2" width="10" height="2" />
      <rect x="2" y="3" width="2" height="8" />
      <rect x="12" y="3" width="2" height="8" />
      <rect x="4" y="10" width="8" height="2" />
      <rect x="2" y="11" width="3" height="2" />
      <rect x="1" y="13" width="2" height="2" />
      {/* Eye pixels */}
      <rect x="5" y="6" width="2" height="2" />
      <rect x="9" y="6" width="2" height="2" />
    </svg>
  );
}

// 8-Bit Pixel Bot Head
export function PixelBot({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="7" y="1" width="2" height="2" />
      <rect x="6" y="3" width="4" height="1" />
      <rect x="2" y="4" width="12" height="9" />
      <rect x="0" y="7" width="2" height="3" />
      <rect x="14" y="7" width="2" height="3" />
      {/* Eye cutouts */}
      <rect x="4" y="6" width="2" height="3" fill="#090c08" />
      <rect x="10" y="6" width="2" height="3" fill="#090c08" />
      {/* Mouth cutout */}
      <rect x="5" y="10" width="6" height="1" fill="#090c08" />
    </svg>
  );
}

// 8-Bit Pixel Brain Circuit
export function PixelBrain({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="4" y="2" width="3" height="2" />
      <rect x="9" y="2" width="3" height="2" />
      <rect x="2" y="4" width="3" height="3" />
      <rect x="11" y="4" width="3" height="3" />
      <rect x="1" y="7" width="3" height="4" />
      <rect x="12" y="7" width="3" height="4" />
      <rect x="3" y="11" width="3" height="3" />
      <rect x="10" y="11" width="3" height="3" />
      <rect x="7" y="3" width="2" height="10" />
      <rect x="5" y="6" width="6" height="2" />
      <rect x="5" y="9" width="6" height="2" />
    </svg>
  );
}

// 8-Bit Pixel Database Stack
export function PixelDatabase({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      {/* Top disk */}
      <rect x="3" y="2" width="10" height="2" />
      <rect x="2" y="3" width="12" height="2" />
      {/* Middle disk */}
      <rect x="2" y="7" width="12" height="2" />
      <rect x="2" y="5" width="2" height="3" />
      <rect x="12" y="5" width="2" height="3" />
      {/* Bottom disk */}
      <rect x="2" y="11" width="12" height="2" />
      <rect x="2" y="9" width="2" height="3" />
      <rect x="12" y="9" width="2" height="3" />
      <rect x="3" y="13" width="10" height="1" />
    </svg>
  );
}

// 8-Bit Pixel Calendar
export function PixelCalendar({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="4" y="1" width="2" height="3" />
      <rect x="10" y="1" width="2" height="3" />
      <rect x="2" y="3" width="12" height="11" />
      <rect x="4" y="6" width="8" height="1" fill="#090c08" />
      {/* Day blocks */}
      <rect x="4" y="8" width="2" height="2" fill="#090c08" />
      <rect x="7" y="8" width="2" height="2" fill="#090c08" />
      <rect x="10" y="8" width="2" height="2" fill="#090c08" />
      <rect x="4" y="11" width="2" height="2" fill="#090c08" />
      <rect x="7" y="11" width="2" height="2" fill="#090c08" />
      <rect x="10" y="11" width="2" height="2" fill="#090c08" />
    </svg>
  );
}

// 8-Bit Pixel Send / Rocket
export function PixelSend({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="13" y="2" width="2" height="2" />
      <rect x="10" y="3" width="3" height="2" />
      <rect x="7" y="4" width="3" height="2" />
      <rect x="4" y="5" width="3" height="2" />
      <rect x="1" y="6" width="3" height="2" />
      <rect x="11" y="5" width="2" height="3" />
      <rect x="9" y="8" width="2" height="3" />
      <rect x="7" y="11" width="2" height="3" />
      <rect x="5" y="13" width="2" height="2" />
      <rect x="5" y="7" width="4" height="2" />
    </svg>
  );
}

// 8-Bit Pixel Bar Chart
export function PixelChart({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="1" y="1" width="2" height="14" />
      <rect x="1" y="13" width="14" height="2" />
      {/* Bar 1 */}
      <rect x="4" y="9" width="2" height="4" />
      {/* Bar 2 */}
      <rect x="7" y="6" width="2" height="7" />
      {/* Bar 3 */}
      <rect x="10" y="3" width="2" height="10" />
      {/* Bar 4 */}
      <rect x="13" y="1" width="2" height="12" />
    </svg>
  );
}

// 8-Bit Pixel Webhook
export function PixelWebhook({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="6" y="2" width="4" height="4" />
      <rect x="2" y="10" width="4" height="4" />
      <rect x="10" y="10" width="4" height="4" />
      <rect x="7" y="6" width="2" height="3" />
      <rect x="5" y="8" width="6" height="2" />
    </svg>
  );
}

// 8-Bit Pixel Checkmark
export function PixelCheck({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="13" y="3" width="2" height="2" />
      <rect x="11" y="5" width="2" height="2" />
      <rect x="9" y="7" width="2" height="2" />
      <rect x="7" y="9" width="2" height="2" />
      <rect x="5" y="11" width="2" height="2" />
      <rect x="3" y="9" width="2" height="2" />
      <rect x="1" y="7" width="2" height="2" />
    </svg>
  );
}

// 8-Bit Pixel Cross (Close X)
export function PixelClose({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="2" height="2" />
      <rect x="12" y="2" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="2" y="12" width="2" height="2" />
      <rect x="12" y="12" width="2" height="2" />
    </svg>
  );
}

// 8-Bit Pixel Star / Sparkles (✦)
export function PixelSparkles({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="7" y="1" width="2" height="14" />
      <rect x="1" y="7" width="14" height="2" />
      <rect x="5" y="5" width="6" height="6" />
      <rect x="6" y="4" width="4" height="8" />
      <rect x="4" y="6" width="8" height="4" />
    </svg>
  );
}

// 8-Bit Pixel Radio Signal Tower
export function PixelRadio({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="7" y="6" width="2" height="8" />
      <rect x="5" y="13" width="6" height="2" />
      <rect x="6" y="4" width="4" height="3" />
      {/* Left wave */}
      <rect x="3" y="3" width="2" height="2" />
      <rect x="2" y="5" width="2" height="4" />
      <rect x="3" y="9" width="2" height="2" />
      {/* Right wave */}
      <rect x="11" y="3" width="2" height="2" />
      <rect x="12" y="5" width="2" height="4" />
      <rect x="11" y="9" width="2" height="2" />
    </svg>
  );
}

// 8-Bit Pixel Globe
export function PixelGlobe({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="5" y="1" width="6" height="2" />
      <rect x="3" y="3" width="10" height="2" />
      <rect x="1" y="5" width="14" height="6" />
      <rect x="3" y="11" width="10" height="2" />
      <rect x="5" y="13" width="6" height="2" />
      {/* Internal lines cutouts */}
      <rect x="7" y="2" width="2" height="12" fill="#090c08" />
      <rect x="2" y="7" width="12" height="2" fill="#090c08" />
    </svg>
  );
}

// 8-Bit Pixel Map Pin
export function PixelMapPin({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="5" y="1" width="6" height="2" />
      <rect x="3" y="3" width="10" height="5" />
      <rect x="4" y="8" width="8" height="2" />
      <rect x="5" y="10" width="6" height="2" />
      <rect x="6" y="12" width="4" height="2" />
      <rect x="7" y="14" width="2" height="2" />
      {/* Center cutout */}
      <rect x="6" y="4" width="4" height="3" fill="#090c08" />
    </svg>
  );
}

// 8-Bit Pixel Lightning Zap
export function PixelZap({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="8" y="1" width="5" height="2" />
      <rect x="6" y="3" width="5" height="2" />
      <rect x="4" y="5" width="5" height="2" />
      <rect x="2" y="7" width="11" height="2" />
      <rect x="7" y="9" width="5" height="2" />
      <rect x="5" y="11" width="5" height="2" />
      <rect x="3" y="13" width="5" height="2" />
    </svg>
  );
}

// 8-Bit Pixel Shield
export function PixelShield({ size = 16, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="12" height="2" />
      <rect x="1" y="4" width="14" height="5" />
      <rect x="2" y="9" width="12" height="2" />
      <rect x="3" y="11" width="10" height="2" />
      <rect x="5" y="13" width="6" height="1" />
      <rect x="7" y="14" width="2" height="1" />
      {/* Check inside */}
      <rect x="5" y="7" width="2" height="2" fill="#090c08" />
      <rect x="7" y="9" width="2" height="2" fill="#090c08" />
      <rect x="9" y="5" width="2" height="4" fill="#090c08" />
    </svg>
  );
}

// 8-Bit Pixel Pac-Man Character (Animated Chomp)
export function PixelPacman({ size = 18, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`pixel-pacman-icon ${className}`}
      {...props}
    >
      <rect x="5" y="1" width="6" height="2" />
      <rect x="3" y="3" width="10" height="2" />
      <rect x="2" y="5" width="12" height="2" />
      <rect x="1" y="7" width="14" height="2" />
      <rect x="1" y="9" width="14" height="2" />
      <rect x="2" y="11" width="12" height="2" />
      <rect x="3" y="13" width="10" height="2" />
      <rect x="5" y="15" width="6" height="1" />
      {/* Eye */}
      <rect x="8" y="3" width="2" height="2" fill="#090c08" />
      {/* Animated mouth cutout */}
      <polygon points="16,8 8,8 16,13" fill="#090c08" className="pixel-pacman-mouth" />
    </svg>
  );
}

// 8-Bit Pixel Android Bot Assistant
export function PixelAndroidBot({ size = 18, className = "", ...props }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`pixel-android-icon ${className}`}
      {...props}
    >
      {/* Antennas */}
      <rect x="3" y="1" width="1" height="2" />
      <rect x="12" y="1" width="1" height="2" />
      {/* Head Dome */}
      <rect x="4" y="3" width="8" height="1" />
      <rect x="2" y="4" width="12" height="4" />
      {/* Eyes */}
      <rect x="4" y="5" width="2" height="2" fill="#090c08" />
      <rect x="10" y="5" width="2" height="2" fill="#090c08" />
      {/* Body */}
      <rect x="2" y="9" width="12" height="6" />
      {/* Arms */}
      <rect x="0" y="9" width="1" height="5" />
      <rect x="15" y="9" width="1" height="5" />
    </svg>
  );
}
