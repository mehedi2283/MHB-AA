"use client";

import React, { useEffect, useState } from "react";
import { Clock, Volume2, VolumeX, Zap, Radio, Command } from "lucide-react";
import { isAudioMuted, toggleAudioMute, playTacticalClick } from "@/lib/tactical-audio";

interface TelemetryHUDProps {
  location?: string;
  specialties?: string;
}

export function TelemetryHUD({ location = "Dhaka, BD", specialties = "Automation & AI Architect" }: TelemetryHUDProps) {
  const [time, setTime] = useState<string>("");
  const [muted, setMuted] = useState(true);
  const [ping, setPing] = useState(24);

  useEffect(() => {
    setMuted(isAudioMuted());

    function updateDhakaTime() {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now);
        setTime(formatted);
      } catch {
        setTime("1:05 PM");
      }
    }

    updateDhakaTime();
    const clockInterval = setInterval(updateDhakaTime, 30000);

    // Subtle edge latency jitter
    const pingInterval = setInterval(() => {
      setPing(20 + Math.floor(Math.random() * 12));
    }, 4500);

    function onSoundChange(e: Event) {
      const custom = e as CustomEvent<{ muted: boolean }>;
      setMuted(custom.detail?.muted ?? true);
    }
    window.addEventListener("portfolio-sound-changed", onSoundChange);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pingInterval);
      window.removeEventListener("portfolio-sound-changed", onSoundChange);
    };
  }, []);

  function handleSoundToggle() {
    const isNowMuted = toggleAudioMute();
    setMuted(isNowMuted);
  }

  function handleOpenPalette() {
    playTacticalClick();
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  }

  return (
    <div className="shell os-status-strip flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#a4ada0] py-2.5 border-t border-white/[0.08]">
      <div className="flex flex-wrap items-center gap-4">
        {/* Location & Time */}
        <span className="flex items-center gap-1.5 text-white/90">
          <Clock size={12} className="text-[#c8ff3d]" />
          <span>{location}</span>
          {time && <span className="text-[#c8ff3d] font-bold">[{time} GMT+6]</span>}
        </span>

        {/* Specialties / Discipline */}
        <span className="hidden sm:inline text-[#838e7f]">·</span>
        <span className="hidden sm:inline">{specialties}</span>

        {/* Edge Ping Latency */}
        <span className="hidden md:inline text-[#838e7f]">·</span>
        <span className="hidden md:flex items-center gap-1 text-[#838e7f]">
          <Zap size={11} className="text-[#c8ff3d]" />
          <span>Edge Ping:</span>
          <span className="text-[#c8ff3d] font-bold">{ping}ms</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={handleOpenPalette}
          className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-[11px] text-white/80 hover:text-white transition cursor-pointer"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command size={11} className="text-[#c8ff3d]" />
          <span>Cmd+K</span>
        </button>

        {/* Audio FX Mute / Unmute Toggle */}
        <button
          type="button"
          onClick={handleSoundToggle}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] border text-[11px] transition cursor-pointer select-none ${
            !muted
              ? "bg-[#1c2919] border-[#c8ff3d] text-[#c8ff3d] font-bold shadow-[0_0_10px_rgba(200,255,61,0.15)]"
              : "bg-white/[0.03] border-white/10 text-[#838e7f] hover:text-white hover:border-white/20"
          }`}
          title={!muted ? "Sound FX: ON (Click to mute)" : "Sound FX: MUTED (Click to activate)"}
        >
          {!muted ? <Volume2 size={12} className="animate-pulse" /> : <VolumeX size={12} />}
          <span>{!muted ? "AUDIO ON" : "AUDIO FX"}</span>
        </button>

        {/* Live Systems Online status */}
        <span className="os-status-right flex items-center gap-1.5 text-white/90">
          <Radio size={12} className="text-[#c8ff3d] animate-pulse" />
          <span className="font-bold text-[#c8ff3d]">SYSTEMS LIVE</span>
        </span>
      </div>
    </div>
  );
}
