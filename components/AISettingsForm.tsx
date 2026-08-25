"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Bot,
  CheckCircle2,
  Key,
  LoaderCircle,
  Save,
  Sparkles,
  TestTube2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Brain,
  ChevronDown,
  Check,
  Eye,
  EyeOff,
  Cpu,
  Sliders,
  Terminal,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

export type ProviderType = "gemini" | "openai" | "anthropic";

interface ProviderOption {
  id: string;
  name: string;
  description?: string;
  badge?: string;
  recommended?: boolean;
}

export const PROVIDERS_CONFIG: Record<
  ProviderType,
  {
    name: string;
    tagline: string;
    badge: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  gemini: {
    name: "Google Gemini",
    tagline: "Ultra-fast multimodal reasoning with massive context",
    badge: "Recommended & Fastest",
    icon: Sparkles,
    color: "#c8ff3d",
    bgColor: "#141c10",
    borderColor: "#2a3d21",
  },
  openai: {
    name: "OpenAI",
    tagline: "Industry-standard GPT-4o and deep reasoning models",
    badge: "High Performance",
    icon: Zap,
    color: "#72a4ff",
    bgColor: "#0e1826",
    borderColor: "#1f3350",
  },
  anthropic: {
    name: "Anthropic Claude",
    tagline: "Nuanced, thoughtful conversation with state-of-the-art coding",
    badge: "Hybrid Reasoning",
    icon: Brain,
    color: "#c084fc",
    bgColor: "#1f1228",
    borderColor: "#442359",
  },
};

export const PROVIDER_MODELS: Record<ProviderType, ProviderOption[]> = {
  gemini: [
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      description: "Sub-second responses, lowest latency & zero-drop reliability",
      badge: "Fastest & Recommended",
      recommended: true,
    },
    {
      id: "gemini-3.5-flash",
      name: "Gemini 3.5 Flash",
      description: "Latest 2026 Flash architecture with enhanced logical flow",
      badge: "Latest Flash",
    },
    {
      id: "gemini-3.5-flash-lite",
      name: "Gemini 3.5 Flash-Lite",
      description: "Ultra lightweight, minimal resource usage",
      badge: "Lightweight",
    },
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      description: "Deep reasoning engine for complex queries and code analysis",
      badge: "Deep Reasoning",
    },
    {
      id: "gemini-3.6-flash",
      name: "Gemini 3.6 Flash",
      description: "Frontier preview model with experimental capabilities",
      badge: "Frontier Preview",
    },
    {
      id: "gemini-flash-latest",
      name: "Gemini Flash Latest",
      description: "Auto-routes to the newest stable production Flash checkpoint",
      badge: "Auto-Updating",
    },
  ],
  openai: [
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      description: "Cost-efficient, fast reasoning for interactive chat",
      badge: "Fast & Efficient",
      recommended: true,
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      description: "Flagship intelligence across text, logic, and coding",
      badge: "High Performance",
    },
    {
      id: "o3-mini",
      name: "o3-mini",
      description: "High-reasoning STEM and deliberate problem-solving model",
      badge: "Reasoning Model",
    },
    {
      id: "gpt-4.5-preview",
      name: "GPT-4.5 Preview",
      description: "Frontier-scale model with vast world knowledge",
      badge: "Frontier Scale",
    },
  ],
  anthropic: [
    {
      id: "claude-3-7-sonnet-latest",
      name: "Claude 3.7 Sonnet",
      description: "State-of-the-art hybrid reasoning with adaptive thinking tokens",
      badge: "Recommended Flagship",
      recommended: true,
    },
    {
      id: "claude-3-5-sonnet-latest",
      name: "Claude 3.5 Sonnet",
      description: "World-class coding benchmark and human-like natural prose",
      badge: "State of the Art",
    },
    {
      id: "claude-3-5-haiku-latest",
      name: "Claude 3.5 Haiku",
      description: "Instantaneous responses tailored for high-volume assistant workflows",
      badge: "Fast & Compact",
    },
  ],
};

const PROVIDER_KEY_LINKS: Record<ProviderType, { label: string; url: string }> = {
  gemini: { label: "Get Gemini Key (Google AI Studio)", url: "https://aistudio.google.com/app/apikey" },
  openai: { label: "Get OpenAI Key (OpenAI Platform)", url: "https://platform.openai.com/api-keys" },
  anthropic: { label: "Get Anthropic Key (Anthropic Console)", url: "https://console.anthropic.com/settings/keys" },
};

const PROMPT_PRESETS = [
  {
    label: "Concise & Direct",
    prompt: "You are the concise and professional AI assistant for Mehedi's portfolio. Answer questions directly, highlight his automation & AI systems engineering skills, and keep answers to 2-3 short sentences.",
  },
  {
    label: "Lead Qualifier & Booker",
    prompt: "You are Mehedi's AI client strategist. Guide visitors toward scheduling a systems audit or exploring relevant case studies (n8n, GoHighLevel, LLMs). Ask clarifying questions to understand their budget and timeline.",
  },
  {
    label: "Technical Architecture Expert",
    prompt: "You are an AI engineer representing Mehedi's portfolio. Provide technical, in-depth breakdowns of his automation pipelines, Supabase schemas, and agent architectures while maintaining a clean, professional tone.",
  },
];

type Form = {
  activeProvider: ProviderType;
  model: string;
  apiKey: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  monthlyLimit: number;
  leadQualification: boolean;
  bookingEnabled: boolean;
  fallbackEnabled: boolean;
};

const initial: Form = {
  activeProvider: "gemini",
  model: "gemini-2.5-flash",
  apiKey: "",
  systemPrompt:
    "You are the concise, professional guide for Mehedi's personal portfolio. Never invent results or guarantees.",
  temperature: 0.3,
  maxTokens: 500,
  monthlyLimit: 0,
  leadQualification: true,
  bookingEnabled: true,
  fallbackEnabled: true,
};

/* -------------------------------------------------------------------------- */
/* Custom Cyberpunk Model Selector Dropdown                                  */
/* -------------------------------------------------------------------------- */
function CustomModelDropdown({
  models,
  selectedModel,
  isCustom,
  onSelectModel,
  onSelectCustom,
}: {
  models: ProviderOption[];
  selectedModel: string;
  isCustom: boolean;
  onSelectModel: (modelId: string) => void;
  onSelectCustom: () => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = models.find((m) => m.id === selectedModel);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-[#101610] hover:bg-[#141d14] border border-white/[0.12] hover:border-[#c8ff3d55] focus:border-[#c8ff3d] rounded px-4 py-2.5 text-left transition shadow-[0_4px_16px_rgba(0,0,0,0.4)] group cursor-pointer"
      >
        <div className="flex items-center gap-3 truncate">
          <Cpu size={16} className="text-[#c8ff3d] flex-shrink-0" />
          <div className="truncate">
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>{isCustom ? "Custom Model ID" : activeOption?.name || selectedModel}</span>
              {!isCustom && activeOption?.badge && (
                <span className="text-[9.5px] font-mono font-medium px-2 py-0.5 rounded bg-[#1c2a19] text-[#c8ff3d] border border-[#2d4428]">
                  {activeOption.badge}
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-[#838e7f] truncate mt-0.5">
              {isCustom ? selectedModel || "Enter identifier below" : activeOption?.description || selectedModel}
            </div>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`text-[#838e7f] group-hover:text-white transition-transform duration-200 flex-shrink-0 ml-2 ${
            open ? "rotate-180 text-[#c8ff3d]" : ""
          }`}
        />
      </button>

      {/* Dropdown Popup Menu */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-[#0c120c] border border-white/[0.15] rounded shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto scrollbar-none">
          <div className="text-[10px] font-mono text-[#838e7f] uppercase tracking-wider px-3 py-1.5 border-b border-white/[0.06] mb-1 flex items-center justify-between">
            <span>AVAILABLE MODELS</span>
            <span>2025 / 2026 ARCHITECTURE</span>
          </div>

          <div className="space-y-1">
            {models.map((m) => {
              const isSelected = !isCustom && m.id === selectedModel;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(m.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded text-left transition-all group/opt ${
                    isSelected
                      ? "bg-[#172516] border border-[#c8ff3d44] text-white"
                      : "hover:bg-[#131a13] border border-transparent text-[#a4ada0] hover:text-white"
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white group-hover/opt:text-[#c8ff3d] transition">
                        {m.name}
                      </span>
                      {m.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            isSelected
                              ? "bg-[#c8ff3d]/20 text-[#c8ff3d] border-[#c8ff3d]/40 font-bold"
                              : "bg-white/[0.06] text-white/70 border-white/[0.08]"
                          }`}
                        >
                          {m.badge}
                        </span>
                      )}
                    </div>
                    {m.description && (
                      <p className="text-[10.5px] font-mono text-[#838e7f] leading-snug">
                        {m.description}
                      </p>
                    )}
                    <span className="text-[9.5px] font-mono text-[#5f685c] block pt-0.5">
                      id: {m.id}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="size-5 rounded bg-[#c8ff3d]/20 border border-[#c8ff3d] grid place-items-center flex-shrink-0 text-[#c8ff3d]">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}

            {/* Custom Model Option */}
            <button
              type="button"
              onClick={() => {
                onSelectCustom();
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded text-left transition border ${
                isCustom
                  ? "bg-[#172516] border-[#c8ff3d44] text-white"
                  : "hover:bg-[#131a13] border-transparent text-[#a4ada0] hover:text-white"
              }`}
            >
              <div>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span>Custom Model ID...</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/80">
                    Manual
                  </span>
                </div>
                <p className="text-[10.5px] font-mono text-[#838e7f] mt-0.5">
                  Specify any experimental or fine-tuned model checkpoint
                </p>
              </div>

              {isCustom && (
                <div className="size-5 rounded bg-[#c8ff3d]/20 border border-[#c8ff3d] grid place-items-center flex-shrink-0 text-[#c8ff3d]">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main AISettingsForm Component                                              */
/* -------------------------------------------------------------------------- */
export function AISettingsForm() {
  const [form, setForm] = useState<Form>(initial);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"info" | "success" | "error">("info");
  const [busy, setBusy] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testOutput, setTestOutput] = useState<{ provider?: string; model?: string; message?: string; latency?: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/ai-settings")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) {
          const provider: ProviderType = data.activeProvider || "gemini";
          const currentModel: string = data.model || PROVIDER_MODELS[provider][0].id;
          const knownModel = PROVIDER_MODELS[provider]?.some((m) => m.id === currentModel);

          setForm((current) => ({
            ...current,
            ...data,
            activeProvider: provider,
            model: currentModel,
            apiKey: "",
          }));
          setHasApiKey(Boolean(data.hasApiKey));
          setIsCustomModel(!knownModel);
        }
      });
  }, []);

  function handleProviderChange(newProvider: ProviderType) {
    const defaultModel = PROVIDER_MODELS[newProvider][0].id;
    setForm((current) => ({
      ...current,
      activeProvider: newProvider,
      model: defaultModel,
    }));
    setIsCustomModel(false);
  }

  function handleModelSelect(value: string) {
    setIsCustomModel(false);
    update("model", value);
  }

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/ai-settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      setBusy(false);
      if (response.ok) {
        setStatus("Configuration & API key securely saved in database.");
        setStatusType("success");
        setHasApiKey(true);
        update("apiKey", "");
      } else {
        setStatus(data.error || "Unable to save configuration.");
        setStatusType("error");
      }
    } catch {
      setBusy(false);
      setStatus("Failed to connect to backend server.");
      setStatusType("error");
    }
  }

  async function test() {
    setBusy(true);
    setStatus("Testing live model connection…");
    setStatusType("info");
    setTestOutput(null);
    const start = performance.now();

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Say hello and give a one-sentence overview of Mehedi's portfolio." }],
        }),
      });
      const data = await response.json();
      const end = performance.now();
      const latencyMs = Math.round(end - start);

      setBusy(false);
      if (!response.ok) {
        setStatus("Provider test failed. Please verify your API key and model selection.");
        setStatusType("error");
      } else if (data.provider === "local") {
        setStatus("Provider credentials missing or invalid; answering via fallback. Please save a valid API key.");
        setStatusType("error");
        setTestOutput({
          provider: "Local Fallback",
          model: "Static Knowledge",
          message: data.message,
          latency: latencyMs,
        });
      } else {
        setStatus(`Connected to ${data.provider?.toUpperCase()} (${data.model || form.model}) in ${latencyMs}ms`);
        setStatusType("success");
        setTestOutput({
          provider: data.provider,
          model: data.model || form.model,
          message: data.message,
          latency: latencyMs,
        });
      }
    } catch {
      setBusy(false);
      setStatus("Network error during test execution.");
      setStatusType("error");
    }
  }

  const currentModels = PROVIDER_MODELS[form.activeProvider] || PROVIDER_MODELS.gemini;
  const keyLink = PROVIDER_KEY_LINKS[form.activeProvider];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="text-[11px] font-mono text-[#c8ff3d] uppercase tracking-widest flex items-center gap-1.5">
            <Bot size={13} />
            <span>OPERATIONS / AI ASSISTANT</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-white mt-1">
            AI Assistant & Model Routing
          </h1>
          <p className="text-xs text-[#838e7f] font-mono mt-1">
            Configure dynamic LLM routing, encrypted credentials, persona instructions, and safety controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasApiKey ? (
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#c8ff3d] bg-[#141f12] px-3 py-1.5 rounded border border-[#c8ff3d44]">
              <ShieldCheck size={14} />
              <span>KEY ACTIVE</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-mono text-[#facc15] bg-[#231e0c] px-3 py-1.5 rounded border border-[#facc1544]">
              <AlertCircle size={14} />
              <span>KEY REQUIRED</span>
            </span>
          )}
        </div>
      </div>

      {/* SECTION 1: Active Provider Segmented Cards */}
      <section className="bg-[#0b100b] border border-white/[0.08] rounded p-6 space-y-5 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="size-7 rounded bg-[#141b14] border border-white/[0.1] grid place-items-center font-mono text-xs font-bold text-[#c8ff3d]">
              01
            </span>
            <div>
              <h2 className="text-sm font-bold font-mono text-white">Active AI Provider</h2>
              <p className="text-[11px] font-mono text-[#838e7f]">
                Select the core intelligence backend that powers your portfolio chatbot.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Interactive Provider Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {(Object.keys(PROVIDERS_CONFIG) as ProviderType[]).map((provKey) => {
            const config = PROVIDERS_CONFIG[provKey];
            const Icon = config.icon;
            const isSelected = form.activeProvider === provKey;

            return (
              <button
                key={provKey}
                type="button"
                onClick={() => handleProviderChange(provKey)}
                className={`relative p-4 rounded border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                  isSelected
                    ? "bg-[#131b12] border-[#c8ff3d] shadow-[0_0_25px_rgba(200,255,61,0.15)]"
                    : "bg-[#0f140f] border-white/[0.08] hover:border-white/[0.2] hover:bg-[#121912]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="size-9 rounded grid place-items-center border"
                      style={{
                        backgroundColor: config.bgColor,
                        borderColor: config.borderColor,
                        color: config.color,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white group-hover:text-[#c8ff3d] transition">
                        {config.name}
                      </div>
                      <div
                        className="text-[9.5px] font-mono font-medium"
                        style={{ color: config.color }}
                      >
                        {config.badge}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`size-5 rounded border grid place-items-center transition ${
                      isSelected
                        ? "bg-[#c8ff3d] border-[#c8ff3d] text-black"
                        : "border-white/20 bg-transparent"
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>

                <p className="text-[11px] font-mono text-[#838e7f] leading-relaxed">
                  {config.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Model & Encrypted API Key */}
      <section className="bg-[#0b100b] border border-white/[0.08] rounded p-6 space-y-5 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <span className="size-7 rounded bg-[#141b14] border border-white/[0.1] grid place-items-center font-mono text-xs font-bold text-[#c8ff3d]">
            02
          </span>
          <div>
            <h2 className="text-sm font-bold font-mono text-white">Model Selection & Credentials</h2>
            <p className="text-[11px] font-mono text-[#838e7f]">
              Pick your exact model variant and manage secure Supabase database encrypted keys.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Custom Model Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-white flex items-center justify-between">
              <span>Model Selection (Latest 2025/2026 Models)</span>
              <span className="text-[10px] font-mono text-[#838e7f]">
                Active: {form.model}
              </span>
            </label>

            <CustomModelDropdown
              models={currentModels}
              selectedModel={form.model}
              isCustom={isCustomModel}
              onSelectModel={handleModelSelect}
              onSelectCustom={() => setIsCustomModel(true)}
            />
          </div>

          {/* Custom Model Input (if selected) */}
          {isCustomModel && (
            <div className="bg-[#121812] border border-[#c8ff3d44] rounded p-3.5 space-y-1.5 animate-in fade-in duration-150">
              <label className="text-[11px] font-mono font-bold text-[#c8ff3d]">
                Custom Model Identifier:
              </label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder="e.g. gemini-2.5-pro, gpt-4o, or claude-3-7-sonnet-latest"
                className="w-full bg-[#090d09] border border-white/[0.12] rounded px-3 py-2 text-xs font-mono text-white placeholder:text-[#5f685c] focus:border-[#c8ff3d] focus:outline-none"
              />
            </div>
          )}

          {/* API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Key size={13} className="text-[#c8ff3d]" />
                <span>{PROVIDERS_CONFIG[form.activeProvider].name} API Key</span>
                {hasApiKey && (
                  <span className="text-[9.5px] font-mono text-[#c8ff3d] bg-[#1a2517] px-2 py-0.5 rounded border border-[#c8ff3d44] flex items-center gap-1">
                    <ShieldCheck size={11} /> Saved in Database
                  </span>
                )}
              </label>

              {keyLink && (
                <a
                  href={keyLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-[#c8ff3d] hover:underline flex items-center gap-1"
                >
                  <span>{keyLink.label}</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>

            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={form.apiKey}
                onChange={(e) => update("apiKey", e.target.value)}
                placeholder={
                  hasApiKey
                    ? "•••••••••••••••••••• (API key is saved in database. Enter new key only to replace)"
                    : "Paste your API key here..."
                }
                className="w-full bg-[#101610] border border-white/[0.12] focus:border-[#c8ff3d] rounded pl-3.5 pr-10 py-2.5 text-xs font-mono text-white placeholder:text-[#5f685c] focus:outline-none transition shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#838e7f] hover:text-white p-1"
                title={showApiKey ? "Hide key" : "Show key"}
              >
                {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: System Persona & Instruction Tuning */}
      <section className="bg-[#0b100b] border border-white/[0.08] rounded p-6 space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="size-7 rounded bg-[#141b14] border border-white/[0.1] grid place-items-center font-mono text-xs font-bold text-[#c8ff3d]">
              03
            </span>
            <div>
              <h2 className="text-sm font-bold font-mono text-white">System Persona & Behavior</h2>
              <p className="text-[11px] font-mono text-[#838e7f]">
                Dictate the AI assistant's tone, knowledge boundaries, and lead conversion goals.
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#838e7f]">
            {form.systemPrompt.length} chars
          </div>
        </div>

        {/* Prompt Presets Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono text-[#5f685c] uppercase flex-shrink-0">
            Presets:
          </span>
          {PROMPT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => update("systemPrompt", preset.prompt)}
              className="text-[10.5px] font-mono px-2.5 py-1 rounded bg-[#131a13] hover:bg-[#1a2517] text-[#a4ada0] hover:text-[#c8ff3d] border border-white/[0.06] hover:border-[#c8ff3d44] transition whitespace-nowrap cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <textarea
          value={form.systemPrompt}
          onChange={(e) => update("systemPrompt", e.target.value)}
          rows={4}
          placeholder="You are the concise and professional AI guide for Mehedi's portfolio..."
          className="w-full bg-[#101610] border border-white/[0.12] focus:border-[#c8ff3d] rounded p-3.5 text-xs font-mono text-white placeholder:text-[#5f685c] focus:outline-none leading-relaxed transition shadow-[0_4px_16px_rgba(0,0,0,0.4)] resize-y min-h-[100px]"
        />
      </section>

      {/* SECTION 4: Response Fine-Tuning & Feature Switches */}
      <section className="bg-[#0b100b] border border-white/[0.08] rounded p-6 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <span className="size-7 rounded bg-[#141b14] border border-white/[0.1] grid place-items-center font-mono text-xs font-bold text-[#c8ff3d]">
            04
          </span>
          <div>
            <h2 className="text-sm font-bold font-mono text-white">Response Controls & Guardrails</h2>
            <p className="text-[11px] font-mono text-[#838e7f]">
              Tune model creativity, output limits, and automated booking triggers.
            </p>
          </div>
        </div>

        {/* Sliders & Rate Limit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Temperature Slider */}
          <div className="bg-[#101610] border border-white/[0.06] rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <SlidersHorizontal size={13} className="text-[#c8ff3d]" />
                <span>Temperature</span>
              </label>
              <span className="text-xs font-mono font-bold text-[#c8ff3d] bg-[#141f12] px-2 py-0.5 rounded border border-[#c8ff3d33]">
                {form.temperature}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={form.temperature}
              onChange={(e) => update("temperature", parseFloat(e.target.value))}
              className="w-full accent-[#c8ff3d] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[9.5px] font-mono text-[#5f685c]">
              <span>0.0 (Strict/Precise)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Max Output Tokens */}
          <div className="bg-[#101610] border border-white/[0.06] rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Cpu size={13} className="text-[#72a4ff]" />
                <span>Max Output Tokens</span>
              </label>
              <span className="text-xs font-mono font-bold text-[#72a4ff] bg-[#0e1826] px-2 py-0.5 rounded border border-[#72a4ff33]">
                {form.maxTokens}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={form.maxTokens}
              onChange={(e) => update("maxTokens", parseInt(e.target.value))}
              className="w-full accent-[#72a4ff] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[9.5px] font-mono text-[#5f685c]">
              <span>100 (Short)</span>
              <span>2000 (Detailed)</span>
            </div>
          </div>

          {/* Monthly Limit */}
          <div className="bg-[#101610] border border-white/[0.06] rounded p-4 space-y-2 flex flex-col justify-between">
            <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <RefreshCw size={13} className="text-[#facc15]" />
              <span>Monthly Rate Limit</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.monthlyLimit}
              onChange={(e) => update("monthlyLimit", Number(e.target.value))}
              placeholder="0 = Unlimited"
              className="w-full bg-[#090d09] border border-white/[0.12] focus:border-[#facc15] rounded px-3 py-1.5 text-xs font-mono text-white placeholder:text-[#5f685c] focus:outline-none"
            />
            <div className="text-[9.5px] font-mono text-[#5f685c]">
              0 = Unlimited requests / month
            </div>
          </div>
        </div>

        {/* Feature Switches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          {/* Lead Qualification */}
          <label className="flex items-start gap-3 bg-[#101610] hover:bg-[#141c14] border border-white/[0.06] p-3.5 rounded cursor-pointer transition select-none">
            <input
              type="checkbox"
              checked={form.leadQualification}
              onChange={(e) => update("leadQualification", e.target.checked)}
              className="mt-0.5 accent-[#c8ff3d] size-4 rounded"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-white">Lead Qualification</div>
              <p className="text-[10.5px] font-mono text-[#838e7f]">
                Scores prospect messages and captures company requirements automatically.
              </p>
            </div>
          </label>

          {/* Appointment Booking */}
          <label className="flex items-start gap-3 bg-[#101610] hover:bg-[#141c14] border border-white/[0.06] p-3.5 rounded cursor-pointer transition select-none">
            <input
              type="checkbox"
              checked={form.bookingEnabled}
              onChange={(e) => update("bookingEnabled", e.target.checked)}
              className="mt-0.5 accent-[#c8ff3d] size-4 rounded"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-white">Appointment Booking</div>
              <p className="text-[10.5px] font-mono text-[#838e7f]">
                Offers discovery call calendar links when high buyer intent is detected.
              </p>
            </div>
          </label>

          {/* Provider Fallback */}
          <label className="flex items-start gap-3 bg-[#101610] hover:bg-[#141c14] border border-white/[0.06] p-3.5 rounded cursor-pointer transition select-none">
            <input
              type="checkbox"
              checked={form.fallbackEnabled}
              onChange={(e) => update("fallbackEnabled", e.target.checked)}
              className="mt-0.5 accent-[#c8ff3d] size-4 rounded"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-white">Intelligent Fallback</div>
              <p className="text-[10.5px] font-mono text-[#838e7f]">
                Switches seamlessly to static knowledge base on network or rate limit spikes.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* Test Response Preview Terminal (if test was triggered) */}
      {testOutput && (
        <div className="bg-[#090d09] border border-[#c8ff3d44] rounded p-5 space-y-3 shadow-[0_0_30px_rgba(200,255,61,0.1)] animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <Terminal size={14} className="text-[#c8ff3d]" />
              <span>LIVE TEST RESPONSE</span>
            </div>
            <div className="flex items-center gap-3 text-[10.5px] font-mono text-[#838e7f]">
              <span>Provider: <strong className="text-white">{testOutput.provider}</strong></span>
              <span>Model: <strong className="text-[#c8ff3d]">{testOutput.model}</strong></span>
              <span>Latency: <strong className="text-[#facc15]">{testOutput.latency}ms</strong></span>
            </div>
          </div>
          <p className="text-xs font-mono text-[#d1d5db] leading-relaxed bg-[#101610] p-3.5 rounded border border-white/[0.06]">
            {testOutput.message}
          </p>
        </div>
      )}

      {/* Action Bar Footer */}
      <div className="sticky bottom-6 bg-[#0c120c]/90 backdrop-blur-xl border border-white/[0.12] p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-30">
        {/* Status Message */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {statusType === "success" && <CheckCircle2 size={16} className="text-[#c8ff3d] flex-shrink-0" />}
          {statusType === "error" && <AlertCircle size={16} className="text-red-400 flex-shrink-0" />}
          {statusType === "info" && <Sparkles size={16} className="text-white/60 flex-shrink-0" />}
          <span
            className={
              statusType === "error"
                ? "text-red-400 font-bold"
                : statusType === "success"
                ? "text-[#c8ff3d] font-bold"
                : "text-[#838e7f]"
            }
          >
            {status || "Credentials are encrypted before database storage."}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={test}
            disabled={busy}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded bg-[#141b14] hover:bg-[#1a2517] text-white hover:text-[#c8ff3d] border border-white/[0.1] hover:border-[#c8ff3d44] font-mono text-xs font-bold transition cursor-pointer"
          >
            {busy ? <LoaderCircle className="animate-spin" size={14} /> : <TestTube2 size={14} />}
            <span>Test Connection</span>
          </button>

          <button
            onClick={save}
            disabled={busy}
            type="button"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded bg-[#c8ff3d] hover:bg-[#d4ff66] text-black font-mono text-xs font-bold transition shadow-[0_0_20px_rgba(200,255,61,0.25)] cursor-pointer"
          >
            {busy ? <LoaderCircle className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
