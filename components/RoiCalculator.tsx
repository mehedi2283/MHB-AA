"use client";

import React, { useState, useId } from "react";
import { Calculator, ArrowRight, DollarSign, Clock, Users, Zap, CheckCircle } from "lucide-react";
import { PixelCard } from "./PixelCard";
import { playTacticalClick, playSuccessSound } from "@/lib/tactical-audio";

export function RoiCalculator() {
  const [teamSize, setTeamSize] = useState(8);
  const [hoursPerWeek, setHoursPerWeek] = useState(12);
  const [hourlyRate, setHourlyRate] = useState(55);

  const teamId = useId();
  const hoursId = useId();
  const rateId = useId();

  // Math Calculations (50 working weeks/year, 2,000 hrs = 1 FTE)
  const weeklyHours = teamSize * hoursPerWeek;
  const annualHoursSaved = weeklyHours * 50;
  const annualCostSavings = annualHoursSaved * hourlyRate;
  const fteCapacity = (annualHoursSaved / 2000).toFixed(1);

  // Dynamic Architecture Recommendation
  let architectureName = "Compact n8n Pipeline + Gemini Triage Agent";
  let architectureEst = "1 – 2 Weeks Deployment";
  if (teamSize > 18) {
    architectureName = "Enterprise Multi-Agent Mesh + Self-Healing Webhooks + Vector RAG";
    architectureEst = "3 – 4 Weeks Deployment";
  } else if (teamSize > 6) {
    architectureName = "Multi-Agent Orchestrator + Auto-CRM Sync + Slack Webhook Alerts";
    architectureEst = "2 – 3 Weeks Deployment";
  }

  function handleDeployClick() {
    playSuccessSound();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }

    // Pre-fill contact message input if available
    setTimeout(() => {
      const msgInput = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
      if (msgInput) {
        msgInput.value = `Hi Mehedi, I calculated our team's automation ROI:\n- Team Size: ${teamSize} members\n- Estimated Annual Savings: $${annualCostSavings.toLocaleString()}/yr (${annualHoursSaved.toLocaleString()} hours)\n- Desired Architecture: ${architectureName}\n\nLet's discuss implementing this.`;
        msgInput.dispatchEvent(new Event("input", { bubbles: true }));
        msgInput.focus();
      }
    }, 400);
  }

  return (
    <section id="calculator" className="section os-calculator">
      <div className="shell">
        <div className="os-section-head os-section-head-row">
          <div>
            <span className="text-[11px] font-mono text-[#c8ff3d] tracking-widest uppercase font-bold block mb-1">
              FINANCIAL & BANDWIDTH MODELLING
            </span>
            <h2>
              Automation ROI
              <br />
              <em className="text-[#c8ff3d] not-italic">& Cost Savings Calculator</em>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#a4ada0] leading-relaxed">
            Estimate how many hundreds of hours and capital your organization reclaims annually by replacing
            repetitive manual tasks with autonomous AI pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Controls Column (Sliders) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded bg-[#0e140e] border border-white/[0.1] flex flex-col justify-between space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08]">
              <Calculator size={18} className="text-[#c8ff3d]" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Interactive Parameters
              </span>
            </div>

            {/* Slider 1: Team Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label htmlFor={teamId} className="flex items-center gap-1.5 text-[#d2dbd0] cursor-pointer">
                  <Users size={14} className="text-[#c8ff3d]" /> Team Size:
                </label>
                <span className="text-sm font-bold text-[#c8ff3d] bg-[#1a2918] px-2.5 py-0.5 rounded-[2px] border border-[#c8ff3d]/30">
                  {teamSize} {teamSize === 1 ? "person" : "people"}
                </span>
              </div>
              <input
                id={teamId}
                type="range"
                min="1"
                max="50"
                step="1"
                value={teamSize}
                onChange={(e) => {
                  playTacticalClick();
                  setTeamSize(Number(e.target.value));
                }}
                className="w-full accent-[#c8ff3d] bg-[#1b251a] h-1.5 rounded-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#5f685c]">
                <span>1 member</span>
                <span>25 members</span>
                <span>50+ members</span>
              </div>
            </div>

            {/* Slider 2: Hours/Week */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label htmlFor={hoursId} className="flex items-center gap-1.5 text-[#d2dbd0] cursor-pointer">
                  <Clock size={14} className="text-[#c8ff3d]" /> Manual Task Hours / Person / Week:
                </label>
                <span className="text-sm font-bold text-[#c8ff3d] bg-[#1a2918] px-2.5 py-0.5 rounded-[2px] border border-[#c8ff3d]/30">
                  {hoursPerWeek} hrs / week
                </span>
              </div>
              <input
                id={hoursId}
                type="range"
                min="2"
                max="30"
                step="1"
                value={hoursPerWeek}
                onChange={(e) => {
                  playTacticalClick();
                  setHoursPerWeek(Number(e.target.value));
                }}
                className="w-full accent-[#c8ff3d] bg-[#1b251a] h-1.5 rounded-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#5f685c]">
                <span>2 hrs/wk (Light)</span>
                <span>15 hrs/wk (Standard)</span>
                <span>30 hrs/wk (Heavy)</span>
              </div>
            </div>

            {/* Slider 3: Hourly Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <label htmlFor={rateId} className="flex items-center gap-1.5 text-[#d2dbd0] cursor-pointer">
                  <DollarSign size={14} className="text-[#c8ff3d]" /> Avg. Hourly Cost / Employee:
                </label>
                <span className="text-sm font-bold text-[#c8ff3d] bg-[#1a2918] px-2.5 py-0.5 rounded-[2px] border border-[#c8ff3d]/30">
                  ${hourlyRate} / hr
                </span>
              </div>
              <input
                id={rateId}
                type="range"
                min="20"
                max="150"
                step="5"
                value={hourlyRate}
                onChange={(e) => {
                  playTacticalClick();
                  setHourlyRate(Number(e.target.value));
                }}
                className="w-full accent-[#c8ff3d] bg-[#1b251a] h-1.5 rounded-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#5f685c]">
                <span>$20/hr</span>
                <span>$75/hr</span>
                <span>$150/hr+</span>
              </div>
            </div>

            {/* Recommended Architecture Box */}
            <div className="p-4 rounded bg-[#141c13] border border-[#c8ff3d]/20 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#838e7f] uppercase font-bold">
                <Zap size={12} className="text-[#c8ff3d]" />
                <span>Recommended System Architecture:</span>
              </div>
              <div className="text-xs font-mono font-bold text-white">
                {architectureName}
              </div>
              <div className="text-[11px] font-mono text-[#a4ada0]">
                Estimated build: <strong className="text-[#c8ff3d]">{architectureEst}</strong>
              </div>
            </div>
          </div>

          {/* Results Column (Financial ROI Output) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded bg-gradient-to-b from-[#111911] to-[#090d09] border border-[#c8ff3d]/50 flex flex-col justify-between shadow-[0_0_40px_rgba(200,255,61,0.12)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#c8ff3d]/20">
                <span className="text-xs font-mono text-[#a4ada0] uppercase tracking-wider">
                  PROJECTED ANNUAL VALUE
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-[#c8ff3d] bg-[#c8ff3d]/10 px-2 py-0.5 rounded-[2px] border border-[#c8ff3d]/30">
                  <CheckCircle size={10} /> 99.4% RELIABILITY
                </span>
              </div>

              {/* Big Savings Number */}
              <div>
                <span className="text-[11px] font-mono text-[#838e7f] block mb-1">
                  Estimated Financial Savings:
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-[#c8ff3d] tracking-tight">
                  ${annualCostSavings.toLocaleString()}
                  <span className="text-lg text-[#838e7f] font-normal"> /yr</span>
                </div>
              </div>

              {/* Hours & FTE Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded bg-[#0e160e] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-[#838e7f] block">Bandwidth Saved</span>
                  <strong className="text-lg font-mono text-white">
                    {annualHoursSaved.toLocaleString()}
                  </strong>
                  <span className="text-[10px] font-mono text-[#838e7f] block">hours / year</span>
                </div>

                <div className="p-3 rounded bg-[#0e160e] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-[#838e7f] block">Capacity Equivalent</span>
                  <strong className="text-lg font-mono text-white">
                    +{fteCapacity} FTE
                  </strong>
                  <span className="text-[10px] font-mono text-[#838e7f] block">full-time roles</span>
                </div>
              </div>
            </div>

            {/* Deploy CTA Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleDeployClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded font-mono font-bold text-xs uppercase tracking-wider text-black bg-[#c8ff3d] hover:bg-[#d5ff63] active:bg-[#b0e82c] transition shadow-[0_0_20px_rgba(200,255,61,0.3)] cursor-pointer"
              >
                <span>Deploy This Architecture With Mehedi</span>
                <ArrowRight size={14} />
              </button>
              <p className="text-center text-[10px] font-mono text-[#5f685c] mt-2">
                Auto-configures brief in discovery scheduler
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
