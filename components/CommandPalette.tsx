"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Command,
  ArrowRight,
  Sparkles,
  Download,
  Calendar,
  Mail,
  Volume2,
  VolumeX,
  Code,
  Layers,
  Cpu,
  Calculator,
  Terminal,
  ExternalLink,
  X,
  Check,
} from "lucide-react";
import { playTacticalClick, playTacticalBlip, playSuccessSound, toggleAudioMute, isAudioMuted } from "@/lib/tactical-audio";

type PaletteItem = {
  id: string;
  category: "Navigation" | "Quick Action" | "Easter Egg";
  title: string;
  description?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  shortcut?: string;
  action: () => void;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keydown handler for Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) playTacticalBlip();
          return !prev;
        });
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    function onOpenEvent() {
      setIsOpen(true);
      playTacticalBlip();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setActiveIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const items: PaletteItem[] = [
    // Navigation
    {
      id: "nav-calc",
      category: "Navigation",
      title: "ROI & Cost Savings Calculator",
      description: "Calculate bandwidth and capital savings from automation",
      icon: Calculator,
      action: () => {
        window.location.hash = "#calculator";
        setIsOpen(false);
      },
    },
    {
      id: "nav-blueprint",
      category: "Navigation",
      title: "Architecture Blueprint Generator",
      description: "Generate a custom automated pipeline schema",
      icon: Cpu,
      action: () => {
        window.location.hash = "#blueprint";
        setIsOpen(false);
      },
    },
    {
      id: "nav-playground",
      category: "Navigation",
      title: "Workflow Visualizer & Agent Sandbox",
      description: "Inspect live interactive automation pipelines",
      icon: Terminal,
      action: () => {
        window.location.hash = "#playground";
        setIsOpen(false);
      },
    },
    {
      id: "nav-work",
      category: "Navigation",
      title: "Explore Case Studies & Projects",
      description: "Production SaaS MVPs, autonomous agents & workflows",
      icon: Layers,
      action: () => {
        window.location.hash = "#projects";
        setIsOpen(false);
      },
    },
    {
      id: "nav-about",
      category: "Navigation",
      title: "About Mehedi",
      description: "Systems philosophy, bio, and operational principles",
      icon: Code,
      action: () => {
        window.location.hash = "#about";
        setIsOpen(false);
      },
    },
    {
      id: "nav-contact",
      category: "Navigation",
      title: "Book Discovery Call & Send Brief",
      description: "Calendar scheduling & project specifications",
      icon: Calendar,
      action: () => {
        window.location.hash = "#contact";
        setIsOpen(false);
      },
    },

    // Quick Actions
    {
      id: "act-resume",
      category: "Quick Action",
      title: "Download Resume / CV (PDF)",
      description: "Direct download of Mehedi's verified credentials",
      icon: Download,
      shortcut: "PDF",
      action: () => {
        playSuccessSound();
        const a = document.createElement("a");
        a.href = "/api/resume/download";
        a.download = "Mehedi_Hasan_Resume.pdf";
        a.click();
        setIsOpen(false);
      },
    },
    {
      id: "act-email",
      category: "Quick Action",
      title: copiedEmail ? "Email Copied to Clipboard!" : "Copy Direct Email",
      description: "mehedihasan123456789.mh.mh@gmail.com",
      icon: copiedEmail ? Check : Mail,
      shortcut: "COPY",
      action: () => {
        playSuccessSound();
        navigator.clipboard.writeText("mehedihasan123456789.mh.mh@gmail.com");
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      },
    },
    {
      id: "act-audio",
      category: "Quick Action",
      title: isAudioMuted() ? "Turn On Tactical Sound Effects" : "Mute Sound Effects",
      description: "Toggle Web Audio API mechanical feedback",
      icon: isAudioMuted() ? VolumeX : Volume2,
      shortcut: "TOGGLE",
      action: () => {
        toggleAudioMute();
      },
    },
    {
      id: "act-ai",
      category: "Quick Action",
      title: "Talk to Portfolio AI Assistant",
      description: "Query Mehedi's knowledge-grounded AI agent",
      icon: Sparkles,
      action: () => {
        playTacticalClick();
        setIsOpen(false);
        const launcher = document.querySelector(".ai-launcher") as HTMLButtonElement;
        if (launcher) launcher.click();
      },
    },

    // Easter Egg
    {
      id: "easter-admin",
      category: "Easter Egg",
      title: "Access Admin Control Room",
      description: "Client Hub, Outreach Pipeline, AI Telemetry",
      icon: ExternalLink,
      shortcut: "ADMIN",
      action: () => {
        playSuccessSound();
        window.location.href = "/admin";
      },
    },
  ];

  const filtered = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  function handleSelect(item: PaletteItem) {
    playTacticalClick();
    item.action();
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      playTacticalClick();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      playTacticalClick();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        handleSelect(filtered[activeIndex]);
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cmd-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          className="fixed inset-0 z-[999999] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md"
        >
          <motion.div
            key="cmd-dialog"
            initial={{ opacity: 0, scale: 0.94, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-full max-w-xl bg-[#0b0f0b] border border-[#c8ff3d]/40 rounded shadow-[0_0_60px_rgba(200,255,61,0.18)] overflow-hidden flex flex-col font-sans"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-[#0e140e]">
              <Search size={18} className="text-[#c8ff3d] shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command or jump to section..."
                className="w-full bg-transparent text-sm text-white placeholder:text-[#5f685c] outline-none font-mono"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-[#838e7f] hover:text-white rounded-[2px]"
                >
                  <X size={14} />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 ml-2 text-[10px] font-mono text-[#838e7f] border border-white/10 px-1.5 py-0.5 rounded-[2px]">
                <span>ESC</span>
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 divide-y divide-white/[0.03] scrollbar-none">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-[#838e7f]">
                  No commands matching &ldquo;{query}&rdquo;
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = activeIndex === idx;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full text-left flex items-center justify-between p-2.5 rounded transition group cursor-pointer ${
                        isSelected
                          ? "bg-[#182517] border border-[#c8ff3d]/50 text-white"
                          : "hover:bg-white/[0.04] text-[#a4ada0] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`size-8 rounded-[2px] flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-[#c8ff3d20] border-[#c8ff3d] text-[#c8ff3d]"
                              : "bg-white/[0.04] border-white/10 text-[#838e7f]"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`text-xs font-bold font-mono block truncate ${
                              isSelected ? "text-white" : "text-[#e0e6dd]"
                            }`}
                          >
                            {item.title}
                          </span>
                          {item.description && (
                            <span className="text-[10px] text-[#788474] font-mono block truncate">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {item.shortcut && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] bg-white/[0.06] border border-white/10 text-[#838e7f]">
                            {item.shortcut}
                          </span>
                        )}
                        <ArrowRight
                          size={12}
                          className={`transition ${
                            isSelected ? "text-[#c8ff3d] translate-x-0.5" : "text-transparent"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2 bg-[#090d09] border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#5f685c]">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#c8ff3d]">
                <Command size={10} />
                <span>COMMAND HUB v1.0</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
