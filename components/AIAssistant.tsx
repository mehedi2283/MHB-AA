"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { PixelCard } from "./PixelCard";

type Msg = { role: "user" | "assistant"; content: string };
const suggestions = ["What does Mehedi build?", "Explore the 8-agent project", "Can Mehedi build my SaaS?"];

function PixelMaterializeEffect({ onComplete }: { onComplete?: () => void }) {
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

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Stagger radiating outward from bottom-right (where launcher was clicked)
        const distFromBottomRight = Math.hypot(cols - 1 - c, rows - 1 - r);
        const baseDelay = (distFromBottomRight / (cols + rows)) * 240;
        grid.push({
          x: c * pixelSize,
          y: r * pixelSize,
          delay: baseDelay + Math.random() * 60,
          duration: 160 + Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    const startTime = performance.now();
    let animationId: number;

    function render(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let activePixels = 0;

      for (const p of grid) {
        if (elapsed < p.delay) {
          // Solid pre-materialization pixel
          ctx.fillStyle = "rgba(11, 14, 11, 0.96)";
          ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
          activePixels++;
        } else if (elapsed < p.delay + p.duration) {
          const progress = (elapsed - p.delay) / p.duration;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 1 - progress;
          ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);

          // Center spark on pixel materialization
          if (progress < 0.35) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(p.x + 3, p.y + 3, pixelSize - 7, pixelSize - 7);
          }
          ctx.globalAlpha = 1;
          activePixels++;
        }
      }

      if (activePixels > 0 && elapsed < 420) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        onComplete?.();
      }
    }

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [onComplete]);

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
  const [isPixelating, setIsPixelating] = useState(false);
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

  useEffect(() => {
    if (!open) return;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, [open]);

  function handleOpen() {
    setIsPixelating(true);
    setOpen(true);
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

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.15 } }}
            className="fixed bottom-5 right-5 z-40"
          >
            <PixelCard
              as="button"
              variant="primaryButton"
              gridSize={6}
              onClick={handleOpen}
              className="ai-launcher"
              aria-label="Open AI assistant"
            >
              <span>
                <MessageCircle size={17} />
              </span>
              Ask My AI
              <ArrowUpRight size={14} />
            </PixelCard>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 340, damping: 26, mass: 0.85 }}
            className="ai-shell"
            role="dialog"
            aria-modal="true"
            aria-label="Mehedi portfolio assistant"
          >
            {/* 8-bit Pixel Materialization Grid Wave */}
            {isPixelating && <PixelMaterializeEffect onComplete={() => setIsPixelating(false)} />}

            {/* CRT Pixel Scanline Sweep */}
            <div className="ai-shell-pixel-sweep" aria-hidden="true" />

            <header className="ai-header">
              <div className="ai-avatar">
                <Bot size={19} />
              </div>
              <div>
                <small>PERSONAL AI / v1.0</small>
                <strong>Mehedi’s portfolio guide</strong>
                <span>
                  <i />
                  Online · portfolio knowledge
                </span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close assistant">
                <X size={19} />
              </button>
            </header>

            <div className="ai-messages scrollbar-hidden">
              {messages.map((message, index) => (
                <div className={`ai-message ${message.role}`} key={index}>
                  {message.role === "assistant" && <Sparkles size={13} />}
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
                    <button onClick={() => send(suggestion)} key={suggestion}>
                      <span>{suggestion}</span>
                      <ArrowUpRight size={13} />
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
              <button onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send message">
                <Send size={17} />
              </button>
            </div>
            <footer className="ai-footer">
              <span>Powered by portfolio knowledge</span>
              <span>↵ to send</span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
