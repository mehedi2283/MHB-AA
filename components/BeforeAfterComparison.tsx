"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Zap, Clock, ShieldAlert, Cpu, ArrowRight } from "lucide-react";
import { PixelCard } from "./PixelCard";
import { playTacticalClick } from "@/lib/tactical-audio";

export function BeforeAfterComparison() {
  const [viewMode, setViewMode] = useState<"comparison" | "interactive">("comparison");
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");

  const comparisonData = [
    {
      metric: "Inbound Lead Qualification",
      before: {
        value: "24 – 48 Hours",
        desc: "Leads sit in inbox, cooled-off prospects, manual calendar ping-pong",
        status: "bad",
      },
      after: {
        value: "< 3.2 Seconds",
        desc: "Instant AI qualification, automated calendar booking, CRM enrichment",
        status: "good",
      },
    },
    {
      metric: "Data Entry & Sync Error Rate",
      before: {
        value: "12% – 16% Error",
        desc: "Typos, mismatched fields, fragmented records across 4 tools",
        status: "bad",
      },
      after: {
        value: "0.0% Error Rate",
        desc: "Strict schema validation, automated self-healing webhook retries",
        status: "good",
      },
    },
    {
      metric: "Weekly Repetitive Workload",
      before: {
        value: "18+ Hours / Person",
        desc: "Manual copy-pasting, invoice drafting, lead chasing, status updates",
        status: "bad",
      },
      after: {
        value: "0 Hours (Autonomous)",
        desc: "Background n8n pipelines & AI agents handle end-to-end execution",
        status: "good",
      },
    },
    {
      metric: "Scaling Throughput",
      before: {
        value: "Capped by Headcount",
        desc: "Every 20 new clients require hiring another full-time operations coordinator",
        status: "bad",
      },
      after: {
        value: "Infinite Scale / $0 Extra Headcount",
        desc: "Cloud infrastructure scales to 10,000+ operations/day with zero operational drag",
        status: "good",
      },
    },
  ];

  return (
    <section id="comparison" className="section os-comparison">
      <div className="shell">
        <div className="os-section-head os-section-head-row">
          <div>
            <span className="text-[11px] font-mono text-[#c8ff3d] tracking-widest uppercase font-bold block mb-1">
              OPERATIONAL IMPACT ANALYSIS
            </span>
            <h2>
              The Cost of Manual Work
              <br />
              <em className="text-[#c8ff3d] not-italic">vs. Autonomous AI Systems</em>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#a4ada0] leading-relaxed">
            See the structural difference between fragmented, human-bottlenecked workflows and Mehedi&apos;s
            self-healing AI architecture.
          </p>
        </div>

        {/* View Switcher (Desktop & Mobile) */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 p-1 rounded bg-[#0d120d] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                setViewMode("comparison");
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition cursor-pointer ${
                viewMode === "comparison"
                  ? "bg-[#1f2b1c] text-[#c8ff3d] border border-[#c8ff3d]/40 shadow-sm"
                  : "text-[#838e7f] hover:text-white"
              }`}
            >
              Side-by-Side Matrix
            </button>
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                setViewMode("interactive");
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded transition cursor-pointer ${
                viewMode === "interactive"
                  ? "bg-[#1f2b1c] text-[#c8ff3d] border border-[#c8ff3d]/40 shadow-sm"
                  : "text-[#838e7f] hover:text-white"
              }`}
            >
              Interactive Focus Toggle
            </button>
          </div>

          {viewMode === "interactive" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTacticalClick();
                  setActiveTab("before");
                }}
                className={`px-3 py-1 text-xs font-mono rounded font-bold transition cursor-pointer ${
                  activeTab === "before"
                    ? "bg-rose-950/60 text-rose-300 border border-rose-600"
                    : "text-[#838e7f] hover:text-white"
                }`}
              >
                ⚠️ Legacy Manual
              </button>
              <button
                type="button"
                onClick={() => {
                  playTacticalClick();
                  setActiveTab("after");
                }}
                className={`px-3 py-1 text-xs font-mono rounded font-bold transition cursor-pointer ${
                  activeTab === "after"
                    ? "bg-[#182615] text-[#c8ff3d] border border-[#c8ff3d]"
                    : "text-[#838e7f] hover:text-white"
                }`}
              >
                ⚡ Autonomous AI
              </button>
            </div>
          )}
        </div>

        {/* Matrix Comparison View */}
        {viewMode === "comparison" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Box */}
            <div className="p-6 rounded bg-[#110d0d] border border-rose-900/40 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-rose-950">
                <AlertTriangle size={18} className="text-rose-500" />
                <h3 className="text-sm font-bold font-mono text-rose-300 uppercase tracking-wider">
                  Legacy / Fragmented Manual Ops
                </h3>
              </div>
              <div className="space-y-5">
                {comparisonData.map((item) => (
                  <div key={item.metric} className="p-3.5 rounded bg-rose-950/20 border border-rose-900/30">
                    <span className="text-[11px] font-mono text-rose-400 block mb-1 font-bold">
                      {item.metric}
                    </span>
                    <div className="text-lg font-bold font-mono text-rose-200 mb-1">
                      {item.before.value}
                    </div>
                    <p className="text-xs text-rose-300/70 leading-relaxed">
                      {item.before.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* After Box */}
            <div className="p-6 rounded bg-[#0d140d] border border-[#c8ff3d]/50 relative overflow-hidden shadow-[0_0_30px_rgba(200,255,61,0.08)]">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#c8ff3d]/20">
                <CheckCircle2 size={18} className="text-[#c8ff3d]" />
                <h3 className="text-sm font-bold font-mono text-[#c8ff3d] uppercase tracking-wider">
                  Mehedi&apos;s Autonomous AI Backbone
                </h3>
              </div>
              <div className="space-y-5">
                {comparisonData.map((item) => (
                  <div key={item.metric} className="p-3.5 rounded bg-[#131f13] border border-[#c8ff3d]/30">
                    <span className="text-[11px] font-mono text-[#a4ada0] block mb-1 font-bold">
                      {item.metric}
                    </span>
                    <div className="text-lg font-bold font-mono text-[#c8ff3d] mb-1">
                      {item.after.value}
                    </div>
                    <p className="text-xs text-[#d2dbd0] leading-relaxed">
                      {item.after.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Focus Toggle View */
          <div className="p-6 rounded border bg-[#0b0e0b] transition-all">
            {activeTab === "before" ? (
              <div className="border border-rose-900/40 bg-[#120c0c] p-6 rounded">
                <div className="flex items-center gap-2 mb-4 text-rose-400 font-mono font-bold text-sm">
                  <ShieldAlert size={18} />
                  <span>LEGACY SYSTEM BOTTLENECKS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {comparisonData.map((item) => (
                    <div key={item.metric} className="p-4 rounded bg-rose-950/30 border border-rose-900/30">
                      <span className="text-[11px] font-mono text-rose-400 block mb-1">
                        {item.metric}
                      </span>
                      <strong className="text-base font-mono text-rose-200 block mb-1">
                        {item.before.value}
                      </strong>
                      <p className="text-xs text-rose-300/70">{item.before.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-[#c8ff3d]/50 bg-[#0d140d] p-6 rounded shadow-[0_0_30px_rgba(200,255,61,0.08)]">
                <div className="flex items-center gap-2 mb-4 text-[#c8ff3d] font-mono font-bold text-sm">
                  <Zap size={18} />
                  <span>AUTONOMOUS WORKFLOW ADVANTAGE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {comparisonData.map((item) => (
                    <div key={item.metric} className="p-4 rounded bg-[#131f13] border border-[#c8ff3d]/30">
                      <span className="text-[11px] font-mono text-[#a4ada0] block mb-1">
                        {item.metric}
                      </span>
                      <strong className="text-base font-mono text-[#c8ff3d] block mb-1">
                        {item.after.value}
                      </strong>
                      <p className="text-xs text-[#d2dbd0]">{item.after.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
