"use client";

import React from "react";
import {
  ArrowUpRight,
  ArrowUp,
  ArrowRight,
  ArrowDownRight,
  CornerDownRight,
  MessageSquare,
  Bot,
  Brain,
  Database,
  Calendar,
  Send,
  BarChart3,
  Webhook,
  Check,
  X,
  Sparkles,
  Radio,
  Globe,
  MapPin,
  Zap,
  ShieldCheck,
} from "lucide-react";

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  [key: string]: any;
}

export function PixelArrowUpRight({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <ArrowUpRight size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelArrowUp({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <ArrowUp size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelArrowRight({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <ArrowRight size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelArrowDownRight({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <ArrowDownRight size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelCornerDownRight({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <CornerDownRight size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelChat({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <MessageSquare size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelBot({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Bot size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelBrain({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Brain size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelDatabase({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Database size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelCalendar({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Calendar size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelSend({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Send size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelChart({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <BarChart3 size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelWebhook({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Webhook size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelCheck({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Check size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelClose({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <X size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelSparkles({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Sparkles size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelRadio({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Radio size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelGlobe({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Globe size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelMapPin({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <MapPin size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelZap({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Zap size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelShield({ size = 16, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <ShieldCheck size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}

export function PixelPacman({ size = 18, className = "", ...props }: IconProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <div className="size-full rounded-full border-2 border-t-transparent border-[#c8ff3d] animate-spin" />
    </div>
  );
}

export function PixelAndroidBot({ size = 18, className = "", strokeWidth = 2, ...props }: IconProps) {
  return <Bot size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}
