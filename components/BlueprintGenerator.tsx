"use client";

import React, { useState } from "react";
import { Cpu, Check, Copy, ArrowRight, Sparkles, Layers, RefreshCw } from "lucide-react";
import { playTacticalClick, playSuccessSound } from "@/lib/tactical-audio";

type BlueprintGoal = {
  id: string;
  name: string;
  category: string;
  schema: string;
  timeline: string;
  nodes: string[];
};

const GOALS: BlueprintGoal[] = [
  {
    id: "lead-triage",
    name: "Autonomous Lead Ingestion & Qualification",
    category: "Revenue Operations",
    timeline: "1 – 2 Weeks",
    nodes: ["Website Form / Typeform", "n8n Webhook Listener", "Gemini 2.5 Scoring LLM", "HubSpot / Notion CRM", "Google Calendar Slot", "Slack VIP Alert"],
    schema: `[ INBOUND LEAD ]
       │
       ▼
[ n8n WEBHOOK LISTENER ] ───► [ PAYLOAD VALIDATION ]
       │
       ▼
[ GEMINI 2.5 AGENT ] ───────► Qualify ICP (Budget / Timeline / Authority)
       │
  ┌────┴─────────────────────────┐
  ▼                              ▼
[ QUALIFIED ]              [ NURTURE STREAM ]
  │                              │
  ├──► HubSpot CRM Ingestion     └──► Automated Drip Sequence
  ├──► Calendar Reserved
  └──► Slack Notification (Instant)`,
  },
  {
    id: "rag-knowledge",
    name: "Multi-Agent RAG & Document Intelligence",
    category: "AI Infrastructure",
    timeline: "2 – 3 Weeks",
    nodes: ["PDF / Contract Upload", "Chunking & Tokenizer", "pgvector / Supabase Embeddings", "Gemini Pro Reasoning", "Contextual Answer API", "Audit Log"],
    schema: `[ CLIENT DOCUMENTS / PDF ]
       │
       ▼
[ SECURE INGESTION GATEWAY ]
       │
       ▼
[ VECTOR EMBEDDING PIPELINE ] ──► [ SUPABASE PGVECTOR ]
       │
       ▼
[ HYBRID SEMANTIC SEARCH ] ────► Top-K Relevant Document Chunks
       │
       ▼
[ GEMINI AGENT (STRICT PROMPT) ]
       │
       ▼
[ CITATION-BACKED ANSWER ] ────► [ JSON REST API / DASHBOARD ]`,
  },
  {
    id: "outreach-enrichment",
    name: "Cold Prospect Research & Personalized Drafting",
    category: "Growth Automation",
    timeline: "1 – 2 Weeks",
    nodes: ["LinkedIn / Apollo Ingestion", "Company Website Scraper", "Gemini Pitch Tailoring", "Human-in-Loop Approval", "Resend SMTP API", "Tracking Webhook"],
    schema: `[ PROSPECT LIST / CSV ]
       │
       ▼
[ ENRICHMENT SCRAPER ] ────────► Company Tech Stack + Recent News
       │
       ▼
[ GEMINI COPYWRITER AGENT ] ───► Draft Tailored Pain-Point Hook
       │
       ▼
[ TELEGRAM / SLACK APPROVAL ] ──► One-Click Approve / Reject
       │
       ▼
[ RESEND EMAIL DISPATCH ] ─────► Real-Time Open & Click Webhooks`,
  },
  {
    id: "financial-ops",
    name: "Invoice OCR & Multi-Currency Ledger Routing",
    category: "Financial Systems",
    timeline: "2 – 3 Weeks",
    nodes: ["Invoice Email Attachment", "OCR Line-Item Extractor", "Tax & Math Validator", "Stripe / QuickBooks Sync", "Discrepancy Exception Router"],
    schema: `[ INVOICE ATTACHMENT ]
       │
       ▼
[ MULTI-MODAL OCR ENGINE ] ────► Extract Vendor, Items, Tax, Total
       │
       ▼
[ INTEGRITY VALIDATOR ] ───────► Math verification & Duplicate check
       │
  ┌────┴────────────────────────┐
  ▼                             ▼
[ PASSES CHECK ]          [ DISCREPANCY ]
  │                             │
  ├──► Stripe / Accounting Sync  └──► Quarantine & Alert Finance Lead
  └──► Auto-Receipt Generated`,
  },
];

const INTEGRATIONS = [
  "HubSpot", "Salesforce", "Notion", "Slack", "Supabase", "Stripe", "n8n", "Make", "Google Gemini", "Resend", "Telegram"
];

export function BlueprintGenerator() {
  const [selectedGoal, setSelectedGoal] = useState<BlueprintGoal>(GOALS[0]);
  const [selectedTools, setSelectedTools] = useState<string[]>(["HubSpot", "Slack", "Supabase", "n8n", "Google Gemini"]);
  const [copied, setCopied] = useState(false);

  function toggleTool(tool: string) {
    playTacticalClick();
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  }

  function handleCopy() {
    playSuccessSound();
    navigator.clipboard.writeText(
      `ARCHITECTURE BLUEPRINT: ${selectedGoal.name}\n` +
      `Estimated Timeline: ${selectedGoal.timeline}\n` +
      `Connected Tools: ${selectedTools.join(", ")}\n\n` +
      selectedGoal.schema
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRequest() {
    playSuccessSound();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      const msgInput = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
      if (msgInput) {
        msgInput.value = `Hi Mehedi, I generated a blueprint for "${selectedGoal.name}".\n- Selected Tech Stack: ${selectedTools.join(", ")}\n- Desired Timeline: ${selectedGoal.timeline}\n\nPlease review this architecture schema with me.`;
        msgInput.dispatchEvent(new Event("input", { bubbles: true }));
        msgInput.focus();
      }
    }, 400);
  }

  return (
    <section id="blueprint" className="section os-blueprint">
      <div className="shell">
        <div className="os-section-head os-section-head-row">
          <div>
            <span className="text-[11px] font-mono text-[#c8ff3d] tracking-widest uppercase font-bold block mb-1">
              SYSTEM DESIGN STUDIO
            </span>
            <h2>
              Architecture Blueprint
              <br />
              <em className="text-[#c8ff3d] not-italic">Generator & Schema Builder</em>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#a4ada0] leading-relaxed">
            Select your automation objective and preferred software stack to generate a custom production-ready
            system topology schema in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-5 p-6 rounded bg-[#0e140e] border border-white/[0.1] space-y-6">
            {/* Step 1: Objective */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-[#838e7f] uppercase font-bold flex items-center gap-1.5">
                <span className="size-4 rounded-[2px] bg-[#c8ff3d20] border border-[#c8ff3d] text-[#c8ff3d] inline-flex items-center justify-center text-[9px]">1</span>
                Select Core Objective:
              </span>
              <div className="space-y-2">
                {GOALS.map((goal) => {
                  const isSelected = selectedGoal.id === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => {
                        playTacticalClick();
                        setSelectedGoal(goal);
                      }}
                      className={`w-full text-left p-3 rounded border transition cursor-pointer ${
                        isSelected
                          ? "bg-[#182615] border-[#c8ff3d] text-white shadow-[0_0_15px_rgba(200,255,61,0.1)]"
                          : "bg-white/[0.02] border-white/[0.08] text-[#a4ada0] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span>{goal.name}</span>
                        {isSelected && <Check size={14} className="text-[#c8ff3d]" />}
                      </div>
                      <span className="text-[10px] font-mono text-[#768472] block mt-0.5">
                        {goal.category} · {goal.timeline}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Integrations */}
            <div className="space-y-3 pt-3 border-t border-white/[0.08]">
              <span className="text-[11px] font-mono text-[#838e7f] uppercase font-bold flex items-center gap-1.5">
                <span className="size-4 rounded-[2px] bg-[#c8ff3d20] border border-[#c8ff3d] text-[#c8ff3d] inline-flex items-center justify-center text-[9px]">2</span>
                Toggle Stack Integrations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INTEGRATIONS.map((tool) => {
                  const active = selectedTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`px-2.5 py-1 rounded-[2px] text-[11px] font-mono transition cursor-pointer border ${
                        active
                          ? "bg-[#1f2f1a] border-[#c8ff3d]/60 text-[#c8ff3d] font-bold"
                          : "bg-white/[0.03] border-white/[0.08] text-[#838e7f] hover:text-white"
                      }`}
                    >
                      {active ? `✓ ${tool}` : `+ ${tool}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Output Blueprint Terminal View */}
          <div className="lg:col-span-7 p-6 rounded bg-[#090d09] border border-[#c8ff3d]/40 flex flex-col justify-between shadow-[0_0_30px_rgba(200,255,61,0.08)]">
            <div>
              {/* Terminal Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-[1px] bg-rose-500/80 inline-block" />
                    <span className="size-2 rounded-[1px] bg-amber-500/80 inline-block" />
                    <span className="size-2 rounded-[1px] bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono font-bold text-white ml-2">
                    topology_blueprint.schema
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#c8ff3d] bg-[#c8ff3d]/10 px-2 py-0.5 rounded-[2px] border border-[#c8ff3d]/30">
                    EST. {selectedGoal.timeline}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-mono text-[#a4ada0] hover:text-white bg-white/[0.04] px-2 py-1 rounded-[2px] border border-white/10 transition cursor-pointer"
                  >
                    {copied ? <Check size={12} className="text-[#c8ff3d]" /> : <Copy size={12} />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Node Sequence Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded bg-[#0e140e] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-[#838e7f] uppercase block mr-1 font-bold">
                  Data Pipeline:
                </span>
                {selectedGoal.nodes.map((node, i) => (
                  <span key={node} className="inline-flex items-center text-[10px] font-mono text-[#d2dbd0]">
                    <span className="px-1.5 py-0.5 rounded-[2px] bg-white/[0.05] border border-white/10 text-white font-bold">
                      {node}
                    </span>
                    {i < selectedGoal.nodes.length - 1 && (
                      <span className="text-[#c8ff3d] mx-1">→</span>
                    )}
                  </span>
                ))}
              </div>

              {/* ASCII Topology Diagram */}
              <pre className="p-4 rounded bg-[#050705] border border-[#c8ff3d]/20 text-[11px] sm:text-xs font-mono text-[#c8ff3d] overflow-x-auto leading-relaxed whitespace-pre scrollbar-none select-all">
                {selectedGoal.schema}
              </pre>

              {/* Active Stack Confirmation */}
              <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-wrap items-center gap-2 text-xs font-mono text-[#838e7f]">
                <span>Configured for:</span>
                {selectedTools.map((t) => (
                  <span key={t} className="text-white px-1.5 py-0.5 rounded-[2px] bg-white/[0.05] border border-white/10 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Request Blueprint CTA */}
            <div className="pt-6 mt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={handleRequest}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded font-mono font-bold text-xs uppercase tracking-wider text-black bg-[#c8ff3d] hover:bg-[#d5ff63] active:bg-[#b0e82c] transition shadow-[0_0_20px_rgba(200,255,61,0.25)] cursor-pointer"
              >
                <span>Request Custom Build of This Architecture</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
