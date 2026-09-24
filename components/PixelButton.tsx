"use client";

import React from "react";

export interface PixelButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass" | "acid" | "danger" | "amber";
  className?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: (e?: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: string;
  rel?: string;
  download?: string;
  "aria-label"?: string;
  title?: string;
  style?: React.CSSProperties;
}

export function PixelButton({
  children,
  variant = "primary",
  className = "",
  as = "button",
  href,
  onClick,
  type = "button",
  disabled = false,
  target,
  rel,
  download,
  "aria-label": ariaLabel,
  title,
  style,
}: PixelButtonProps) {
  let variantStyles = "";

  switch (variant) {
    case "primary":
      variantStyles =
        "bg-[#c8ff3d] text-[#070a07] font-bold border border-[#d9ff74] shadow-[0_0_18px_rgba(200,255,61,0.28)]";
      break;
    case "danger":
      variantStyles =
        "bg-rose-600 text-white font-bold border border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.35)]";
      break;
    case "acid":
      variantStyles =
        "bg-[#142013] text-[#c8ff3d] border border-[#c8ff3d]/60 font-semibold shadow-[0_0_15px_rgba(200,255,61,0.15)]";
      break;
    case "amber":
      variantStyles =
        "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-semibold";
      break;
    case "secondary":
    case "glass":
    default:
      variantStyles =
        "bg-white/[0.04] text-white border border-white/10 font-medium";
      break;
  }

  const baseClasses = `pixel-btn inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded font-mono text-xs uppercase tracking-wider select-none ${
    disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"
  } ${variantStyles} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        download={download}
        aria-label={ariaLabel}
        title={title}
        onClick={disabled ? undefined : onClick}
        style={style}
        className={baseClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      onClick={disabled ? undefined : onClick}
      style={style}
      className={baseClasses}
    >
      {children}
    </button>
  );
}
