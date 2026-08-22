"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "./PixelCard";
import {
  PixelArrowUpRight,
  PixelBot,
  PixelChat,
  PixelClose,
  PixelSend,
  PixelSparkles,
  PixelZap,
} from "./PixelIcons";

type Msg = { role: "user" | "assistant"; content: string };
const suggestions = ["What does Mehedi build?", "Explore the 8-agent project", "Can Mehedi build my SaaS?"];

const IDLE_TRANSFORMATIONS = [
  {
    id: "ready",
    text: "AI READY · ASK ME ANYTHING",
    icon: "sparkle" as const,
  },
  {
    id: "guide",
    text: "MEHEDI’S GUIDE · CLICK TO CHAT",
    icon: "bot" as const,
  },
  {
    id: "workflows",
    text: "20+ SYSTEMS & AGENTS LIVE",
    icon: "zap" as const,
  },
  {
    id: "explore",
    text: "EXPLORE AUTOMATION STACK",
    icon: "chat" as const,
  },
];

function PixelTransitionOverlay({
  mode,
  onComplete,
}: {
  mode: "open" | "close";
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 420);
    const height = (canvas.height = canvas.offsetHeight || 640);
    const pixelSize = 14;
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
      "rgba(255, 255, 255, 0.92)", // Cyber White
      "rgba(143, 108, 255, 0.85)", // Neon Violet
      "rgba(200, 255, 61, 0.60)",
      "rgba(255, 255, 255, 0.45)",
    ];

    if (mode === "open") {
      const maxDist = Math.hypot(cols - 1, rows - 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const distFromBottomRight = Math.hypot(cols - 1 - c, rows - 1 - r);
          const diagNorm = distFromBottomRight / maxDist;
          const baseDelay = diagNorm * 200;
          grid.push({
            x: c * pixelSize,
            y: r * pixelSize,
            delay: baseDelay + Math.random() * 40,
            duration: 120 + Math.random() * 60,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    } else {
      const maxDist = Math.hypot(cols - 1, rows - 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const distFromTopLeft = Math.hypot(c, r);
          const diagNorm = distFromTopLeft / maxDist;
          const baseDelay = diagNorm * 180;
          grid.push({
            x: c * pixelSize,
            y: r * pixelSize,
            delay: baseDelay + Math.random() * 35,
            duration: 100 + Math.random() * 45,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    }

    const startTime = performance.now();
    let animationId: number;

    function render(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let animating = false;

      if (mode === "open") {
        for (const p of grid) {
          if (elapsed < p.delay) {
            ctx.fillStyle = "rgba(11, 14, 11, 0.96)";
            ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
            animating = true;
          } else if (elapsed < p.delay + p.duration) {
            const progress = (elapsed - p.delay) / p.duration;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 1 - progress;
            ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
            if (progress < 0.35) {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(p.x + 3, p.y + 3, pixelSize - 7, pixelSize - 7);
            }
            ctx.globalAlpha = 1;
            animating = true;
          }
        }
      } else {
        for (const p of grid) {
          if (elapsed >= p.delay + p.duration) {
            ctx.fillStyle = "rgba(11, 14, 11, 0.98)";
            ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
          } else if (elapsed >= p.delay) {
            const progress = (elapsed - p.delay) / p.duration;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = progress;
            ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
            if (progress > 0.6) {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(p.x + 3, p.y + 3, pixelSize - 7, pixelSize - 7);
            }
            ctx.globalAlpha = 1;
            animating = true;
          } else {
            animating = true;
          }
        }
      }

      if (animating && elapsed < 320) {
        animationId = requestAnimationFrame(render);
      } else {
        if (mode === "open") {
          ctx.clearRect(0, 0, width, height);
        }
        onComplete?.();
      }
    }

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [mode, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [transitionMode, setTransitionMode] = useState<"open" | "close" | null>(null);
  const [idleTransform, setIdleTransform] = useState<(typeof IDLE_TRANSFORMATIONS)[number] | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I’m Mehedi’s portfolio guide. Ask me about his automation systems, AI projects, technical stack, or availability.",
    },
  ]);
  const messageEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  // Full section transformation idle cycle
  useEffect(() => {
    if (open) {
      setIdleTransform(null);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let resetId: NodeJS.Timeout;

    function triggerNextTransform() {
      // Trigger a random transformation every 5.5 to 8.5 seconds
      const delay = 5500 + Math.random() * 3000;
      timeoutId = setTimeout(() => {
        const chosen = IDLE_TRANSFORMATIONS[Math.floor(Math.random() * IDLE_TRANSFORMATIONS.length)];
        setIdleTransform(chosen);

        // Transform back to original resting state after 2.4s
        resetId = setTimeout(() => {
          setIdleTransform(null);
          triggerNextTransform();
        }, 2400);
      }, delay);
    }

    triggerNextTransform();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resetId);
    };
  }, [open]);

  function handleOpen() {
    setIdleTransform(null);
    setTransitionMode("open");
    setOpen(true);
  }

  function handleClose() {
    setTransitionMode("close");
  }

  function handleTransitionComplete() {
    if (transitionMode === "close") {
      setOpen(false);
      setTransitionMode(null);
    } else {
      setTransitionMode(null);
    }
  }

  async function send(text = input) {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json();
      setMessages([...next, { role: "assistant", content: data.message || "I couldn’t answer that just now. Please try again." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "I’m temporarily offline. You can still send Mehedi a project brief below." }]);
    } finally {
      setLoading(false);
    }
  }

  const showSuggestions = !input.trim() && messages.length <= 1;

  function renderTransformIcon(type: "sparkle" | "bot" | "zap" | "chat") {
    switch (type) {
      case "sparkle":
        return <PixelSparkles size={16} className="text-[#c8ff3d] animate-spin-slow" />;
      case "bot":
        return <PixelBot size={17} className="text-[#c8ff3d]" />;
      case "zap":
        return <PixelZap size={16} className="text-[#c8ff3d]" />;
      case "chat":
      default:
        return <PixelChat size={17} className="text-[#c8ff3d]" />;
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[99999] pointer-events-none" style={{ transformOrigin: "bottom right" }}>
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 440,
          damping: 30,
          mass: 0.75,
        }}
        className={`pointer-events-auto origin-bottom-right ${
          open ? "ai-shell-active" : "ai-launcher-active"
        }`}
      >
        {!open ? (
          <PixelCard
            as="button"
            variant="primaryButton"
            gridSize={6}
            onClick={handleOpen}
            className={`ai-launcher ${idleTransform ? "ai-launcher-transformed" : ""}`}
            aria-label="Open AI assistant"
          >
            <AnimatePresence mode="wait">
              {idleTransform ? (
                <motion.span
                  key={idleTransform.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center gap-2.5 whitespace-nowrap"
                >
                  <span className="ai-launcher-icon-wrap">
                    {renderTransformIcon(idleTransform.icon)}
                  </span>
                  <span className="text-[9.5px] font-bold tracking-wider text-[#c8ff3d]">
                    {idleTransform.text}
                  </span>
                  <PixelArrowUpRight size={13} className="text-[#c8ff3d]" />
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center gap-2.5 whitespace-nowrap"
                >
                  <span className="ai-launcher-icon-wrap">
                    <PixelChat size={17} />
                  </span>
                  <span>Ask My AI</span>
                  <PixelArrowUpRight size={14} className="ai-launcher-arrow" />
                </motion.span>
              )}
            </AnimatePresence>
          </PixelCard>
        ) : (
          <div className="ai-shell" role="dialog" aria-modal="true" aria-label="Mehedi portfolio assistant">
            {/* Evolving Pixel Transition (Radiates from bottom-right on open, cascades top-to-bottom on close) */}
            {transitionMode && (
              <PixelTransitionOverlay mode={transitionMode} onComplete={handleTransitionComplete} />
            )}

            <header className="ai-header">
              <div className="ai-avatar">
                <PixelBot size={20} />
              </div>
              <div>
                <small>PERSONAL AI / v1.0</small>
                <strong>Mehedi’s portfolio guide</strong>
                <span>
                  <i />
                  Online · portfolio knowledge
                </span>
              </div>
              <button onClick={handleClose} aria-label="Close assistant" type="button">
                <PixelClose size={18} />
              </button>
            </header>

            <div className="ai-messages scrollbar-hidden">
              {messages.map((message, index) => (
                <div className={`ai-message ${message.role}`} key={index}>
                  {message.role === "assistant" && <PixelSparkles size={14} />}
                  <p>{message.content}</p>
                </div>
              ))}
              {loading && (
                <div className="ai-thinking">
                  <i />
                  <i />
                  <i />
                </div>
              )}
              <div ref={messageEnd} aria-hidden="true" />
            </div>

            {showSuggestions && (
              <>
                <div className="ai-quick-label">START WITH A QUESTION</div>
                <div className="ai-suggestions">
                  {suggestions.map((suggestion) => (
                    <button onClick={() => send(suggestion)} key={suggestion} type="button">
                      <span>{suggestion}</span>
                      <PixelArrowUpRight size={13} />
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="ai-composer">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && send()}
                placeholder="Ask about my work…"
                aria-label="Ask about Mehedi’s work"
              />
              <button onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send message" type="button">
                <PixelSend size={17} />
              </button>
            </div>
            <footer className="ai-footer">
              <span>Powered by portfolio knowledge</span>
              <span>↵ to send</span>
            </footer>
          </div>
        )}
      </motion.div>
    </div>
  );
}
