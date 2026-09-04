"use client";

import React, { useState } from "react";
import { Play, RotateCcw, CheckCircle2, Terminal, Cpu, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { playTacticalClick, playSimulationPulse, playSuccessSound } from "@/lib/tactical-audio";

type Scenario = {
  id: string;
  title: string;
  badge: string;
  description: string;
  steps: {
    title: string;
    agent: string;
    action: string;
  }[];
  mockResult: Record<string, unknown>;
};

const SCENARIOS: Scenario[] = [
  {
    id: "lead-qualification",
    title: "Autonomous Lead Triage & Enrichment",
    badge: "99.2% Accuracy",
    description: "Evaluates inbound lead budget, team size, and ICP criteria using Gemini 2.5, creating CRM records in milliseconds.",
    steps: [
      { title: "Webhook Payload Intercept", agent: "Listener Node", action: "Parsed inbound form from 'Vanguard Robotics' ($25k budget)" },
      { title: "Gemini ICP Reasoning", agent: "Evaluation Agent", action: "Scored 96/100 · High Intent · Verified Domain Authority" },
      { title: "Automated Dispatch & Sync", agent: "Integration Router", action: "HubSpot Deal #9420 created · Slack #leads alerted · Calendar reserved" },
    ],
    mockResult: {
      status: "QUALIFIED_ICP",
      leadScore: 96,
      company: "Vanguard Robotics",
      estimatedValue: "$25,000",
      crmRecordId: "deal_vg_84920",
      actionsExecuted: ["hubspot.createDeal", "slack.notifyVIP", "google_calendar.reserveSlot"],
      latencyMs: 312,
    },
  },
  {
    id: "invoice-ocr",
    title: "Document Intelligence & OCR Extraction",
    badge: "Zero Hallucination",
    description: "Vision LLM agent parses scanned PDF receipts/invoices, verifies mathematical line-items, and reconciles ledgers.",
    steps: [
      { title: "PDF Ingestion Gateway", agent: "Stream Ingester", action: "Received raw 3-page vendor invoice PDF (2.4MB)" },
      { title: "Vision Model Line-Item OCR", agent: "Gemini Vision", action: "Extracted 14 line items, calculated subtotal + VAT validation" },
      { title: "Ledger Settlement", agent: "Finance Bridge", action: "Synced to PostgreSQL ledger · Discrepancy delta: $0.00" },
    ],
    mockResult: {
      status: "VERIFIED_ACCURATE",
      invoiceNumber: "INV-2026-993",
      vendor: "Apex Cloud Services",
      lineItemsExtracted: 14,
      totalAmount: "$8,450.00 USD",
      taxCalculated: "$676.00 (8%)",
      reconciliationStatus: "MATCHED_ZERO_DELTA",
      latencyMs: 420,
    },
  },
  {
    id: "outreach-research",
    title: "Cold Prospect Research & Pitch Tailoring",
    badge: "Autonomous RAG",
    description: "Scrapes prospect website, reads recent press releases, identifies friction points, and crafts a bespoke outreach message.",
    steps: [
      { title: "Digital Footprint Ingestion", agent: "Research Scraper", action: "Analyzed company landing page, tech stack & open job roles" },
      { title: "Friction Diagnosis", agent: "Reasoning Engine", action: "Identified operational bottleneck: Manual data entry across 4 SaaS tools" },
      { title: "Tailored Pitch Generation", agent: "Copywriting Agent", action: "Generated 3-sentence non-generic hook tailored to VP of Operations" },
    ],
    mockResult: {
      status: "DRAFT_READY",
      prospect: "Alex Vance, VP Operations @ Nexus Dynamics",
      detectedStack: ["HubSpot", "Postgres", "Stripe", "Manual CSV"],
      corePainPoint: "35 hrs/week lost in manual customer onboarding",
      generatedHook: "Saw Nexus is scaling to 50 engineers—most teams at this stage lose 30+ hrs/wk manually syncing HubSpot to Postgres. Built a self-healing pipeline for this.",
      latencyMs: 388,
    },
  },
];

export function AgentSandbox() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [completed, setCompleted] = useState(false);

  function runSimulation() {
    if (isRunning) return;
    playTacticalClick();
    setIsRunning(true);
    setCurrentStep(0);
    setCompleted(false);

    // Step 0 pulse
    playSimulationPulse();

    // Step 1
    setTimeout(() => {
      setCurrentStep(1);
      playSimulationPulse();
    }, 1100);

    // Step 2
    setTimeout(() => {
      setCurrentStep(2);
      playSimulationPulse();
    }, 2200);

    // Completion
    setTimeout(() => {
      setIsRunning(false);
      setCurrentStep(3);
      setCompleted(true);
      playSuccessSound();
    }, 3200);
  }

  function resetSimulation() {
    playTacticalClick();
    setIsRunning(false);
    setCurrentStep(-1);
    setCompleted(false);
  }

  return (
    <div className="mt-10 p-6 sm:p-8 rounded bg-[#090d09] border border-[#c8ff3d]/30 shadow-[0_0_40px_rgba(200,255,61,0.06)]">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded bg-[#c8ff3d20] border border-[#c8ff3d] flex items-center justify-center text-[#c8ff3d]">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <span>LIVE AI AGENT EXECUTION SANDBOX</span>
              <span className="text-[10px] text-[#c8ff3d] bg-[#c8ff3d]/10 px-2 py-0.5 rounded-[2px] border border-[#c8ff3d]/30">
                INTERACTIVE
              </span>
            </h3>
            <p className="text-[11px] font-mono text-[#838e7f]">
              Trigger simulated multi-agent execution pipelines and inspect live JSON telemetry
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetSimulation}
            disabled={isRunning || currentStep === -1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-[2px] text-xs font-mono text-[#838e7f] hover:text-white bg-white/[0.04] border border-white/10 transition disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-mono font-bold text-black bg-[#c8ff3d] hover:bg-[#d5ff63] active:bg-[#b0e82c] transition shadow-[0_0_15px_rgba(200,255,61,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="fill-current" />}
            <span>{isRunning ? "Executing Pipeline..." : "Run Live Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Scenario Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
        {SCENARIOS.map((scenario) => {
          const isSelected = activeScenario.id === scenario.id;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => {
                playTacticalClick();
                setActiveScenario(scenario);
                resetSimulation();
              }}
              className={`p-3.5 rounded text-left border transition cursor-pointer ${
                isSelected
                  ? "bg-[#142013] border-[#c8ff3d] text-white shadow-[0_0_15px_rgba(200,255,61,0.12)]"
                  : "bg-white/[0.02] border-white/[0.08] text-[#838e7f] hover:text-white hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                <span>{scenario.title}</span>
              </div>
              <p className="text-[10px] font-mono text-[#788574] line-clamp-2">
                {scenario.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Live Pipeline Step Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step Nodes */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-[10px] font-mono text-[#838e7f] uppercase font-bold tracking-wider block">
            Agent Execution Sequence:
          </span>

          <div className="space-y-3">
            {activeScenario.steps.map((step, idx) => {
              const isPast = currentStep > idx;
              const isCurrent = currentStep === idx;
              const isPending = currentStep < idx;

              return (
                <div
                  key={step.title}
                  className={`p-4 rounded border transition-all flex items-start gap-3.5 ${
                    isCurrent
                      ? "bg-[#172516] border-[#c8ff3d] shadow-[0_0_20px_rgba(200,255,61,0.15)] animate-pulse"
                      : isPast
                      ? "bg-[#101710] border-[#c8ff3d]/40 text-white"
                      : "bg-[#0b0e0b] border-white/[0.06] opacity-60"
                  }`}
                >
                  <div
                    className={`size-7 rounded-[2px] flex items-center justify-center shrink-0 text-xs font-mono font-bold border ${
                      isCurrent
                        ? "bg-[#c8ff3d] text-black border-[#c8ff3d]"
                        : isPast
                        ? "bg-[#c8ff3d20] text-[#c8ff3d] border-[#c8ff3d]"
                        : "bg-white/[0.04] text-[#5f685c] border-white/10"
                    }`}
                  >
                    {isPast ? <CheckCircle2 size={14} /> : idx + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold font-mono text-white">
                        {step.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#c8ff3d] bg-[#c8ff3d]/10 px-2 py-0.5 rounded-[2px] border border-[#c8ff3d]/30">
                        {step.agent}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#a4ada0] mt-1">
                      {step.action}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Output JSON Telemetry */}
        <div className="lg:col-span-5 p-4 rounded bg-[#050705] border border-white/[0.1] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5 text-xs font-mono text-white font-bold">
              <Terminal size={14} className="text-[#c8ff3d]" />
              <span>telemetry_output.json</span>
            </div>
            <span className="text-[10px] font-mono text-[#5f685c]">
              {completed ? "STATUS: 200 OK" : isRunning ? "STREAMING..." : "AWAITING RUN"}
            </span>
          </div>

          <pre className="p-3 rounded bg-black/60 border border-white/[0.04] text-[11px] font-mono text-[#c8ff3d] overflow-x-auto leading-relaxed max-h-56 scrollbar-none">
            {completed || isRunning
              ? JSON.stringify(activeScenario.mockResult, null, 2)
              : "// Click 'Run Live Simulation' to execute this agent pipeline"}
          </pre>

          {completed && (
            <div className="p-2.5 rounded bg-[#101c10] border border-[#c8ff3d]/30 flex items-center justify-between text-xs font-mono text-[#c8ff3d]">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>Execution Complete</span>
              </span>
              <span className="text-[10px] text-[#a4ada0]">
                Latency: {String(activeScenario.mockResult.latencyMs)}ms
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
