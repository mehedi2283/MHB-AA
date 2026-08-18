"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { PixelCard } from "./PixelCard";

type Msg = { role: "user" | "assistant"; content: string };
const suggestions = ["What does Mehedi build?", "Explore the 8-agent project", "Can Mehedi build my SaaS?"];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: "Hi — I’m Mehedi’s portfolio guide. Ask me about his automation systems, AI projects, technical stack, or availability." }]);
  const messageEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { messageEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, loading]);
  useEffect(() => {
    if (!open) return;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = htmlOverflow; document.body.style.overflow = bodyOverflow; };
  }, [open]);

  async function send(text = input) {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const response = await fetch("/api/ai/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = await response.json();
      setMessages([...next, { role: "assistant", content: data.message || "I couldn’t answer that just now. Please try again." }]);
    } catch { setMessages([...next, { role: "assistant", content: "I’m temporarily offline. You can still send Mehedi a project brief below." }]); }
    finally { setLoading(false); }
  }

  return <>
    {!open && <PixelCard as="button" variant="primaryButton" gridSize={6} onClick={() => setOpen(true)} className="ai-launcher" aria-label="Open AI assistant"><span><MessageCircle size={17} /></span>Ask My AI<ArrowUpRight size={14} /></PixelCard>}
    {open && <div className="ai-shell" role="dialog" aria-modal="true" aria-label="Mehedi portfolio assistant">
      <header className="ai-header"><div className="ai-avatar"><Bot size={19} /></div><div><small>PERSONAL AI / v1.0</small><strong>Mehedi’s portfolio guide</strong><span><i />Online · portfolio knowledge</span></div><button onClick={() => setOpen(false)} aria-label="Close assistant"><X size={19} /></button></header>
      <div className="ai-messages scrollbar-hidden">{messages.map((message, index) => <div className={`ai-message ${message.role}`} key={index}>{message.role === "assistant" && <Sparkles size={13} />}<p>{message.content}</p></div>)}{loading && <div className="ai-thinking"><i /><i /><i /></div>}<div ref={messageEnd} aria-hidden="true" /></div>
      <div className="ai-quick-label">START WITH A QUESTION</div>
      <div className="ai-suggestions">{suggestions.map(suggestion => <button onClick={() => send(suggestion)} key={suggestion}><span>{suggestion}</span><ArrowUpRight size={13} /></button>)}</div>
      <div className="ai-composer"><input value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => event.key === "Enter" && send()} placeholder="Ask about my work…" aria-label="Ask about Mehedi’s work" /><button onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send message"><Send size={17} /></button></div>
      <footer className="ai-footer"><span>Powered by portfolio knowledge</span><span>↵ to send</span></footer>
    </div>}
  </>;
}
