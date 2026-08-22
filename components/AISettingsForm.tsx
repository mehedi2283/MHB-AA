"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";

export type ProviderType = "openai" | "anthropic" | "gemini";

interface ProviderOption {
  id: string;
  name: string;
  recommended?: boolean;
}

export const PROVIDER_MODELS: Record<ProviderType, ProviderOption[]> = {
  gemini: [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Fastest & Recommended)", recommended: true },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Advanced Reasoning)" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash-Lite (Ultra Lightweight)" },
    { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash (Frontier Preview)" },
    { id: "gemini-flash-latest", name: "Gemini Flash Latest (Always Latest Stable)" },
  ],
  openai: [
    { id: "gpt-4o-mini", name: "GPT-4o Mini (Fast & Efficient)", recommended: true },
    { id: "gpt-4o", name: "GPT-4o (High Performance)" },
    { id: "o3-mini", name: "o3-mini (Reasoning Model)" },
    { id: "gpt-4.5-preview", name: "GPT-4.5 Preview (Frontier Scale)" },
  ],
  anthropic: [
    { id: "claude-3-7-sonnet-latest", name: "Claude 3.7 Sonnet (Hybrid Reasoning)", recommended: true },
    { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet (State of the Art)" },
    { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku (Fast & Cost-Efficient)" },
  ],
};

const PROVIDER_KEY_LINKS: Record<ProviderType, { label: string; url: string }> = {
  gemini: { label: "Get Gemini Key (Google AI Studio)", url: "https://aistudio.google.com/app/apikey" },
  openai: { label: "Get OpenAI Key (OpenAI Platform)", url: "https://platform.openai.com/api-keys" },
  anthropic: { label: "Get Anthropic Key (Anthropic Console)", url: "https://console.anthropic.com/settings/keys" },
};

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
    "You are the concise, professional guide for Mehedi’s personal portfolio. Never invent results or guarantees.",
  temperature: 0.3,
  maxTokens: 500,
  monthlyLimit: 0,
  leadQualification: true,
  bookingEnabled: true,
  fallbackEnabled: true,
};

export function AISettingsForm() {
  const [form, setForm] = useState<Form>(initial);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"info" | "success" | "error">("info");
  const [busy, setBusy] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);

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
    if (value === "custom") {
      setIsCustomModel(true);
    } else {
      setIsCustomModel(false);
      update("model", value);
    }
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
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Say hello and give a one-sentence overview of Mehedi's portfolio." }],
        }),
      });
      const data = await response.json();
      setBusy(false);
      if (!response.ok) {
        setStatus("Provider test failed. Please verify your API key and model selection.");
        setStatusType("error");
      } else if (data.provider === "local") {
        setStatus("Provider credentials missing or invalid; answering via knowledge fallback. Please save a valid API key.");
        setStatusType("error");
      } else {
        setStatus(`✓ Connected to ${data.provider.toUpperCase()} (${data.model || form.model}): "${data.message}"`);
        setStatusType("success");
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
    <div className="admin-page admin-page-narrow">
      <header className="admin-page-header">
        <div>
          <div className="admin-kicker">Operations / Assistant</div>
          <h1>AI Assistant Configuration</h1>
          <p>Configure model routing, API credentials, and behavioral controls. All keys are encrypted in Supabase.</p>
        </div>
        <Bot size={28} strokeWidth={1.3} className="text-[var(--acid)]" />
      </header>

      {/* Section 01: Provider & Model Routing */}
      <section className="admin-panel admin-settings-panel">
        <div className="admin-section-heading">
          <span>01</span>
          <div>
            <h2>Provider & Model Routing</h2>
            <p>Select your AI provider and modern model. API keys are saved directly into your database.</p>
          </div>
        </div>

        <div className="admin-form-grid">
          {/* Active Provider Dropdown */}
          <label className="admin-field">
            <span>Active Provider</span>
            <select
              value={form.activeProvider}
              onChange={(e) => handleProviderChange(e.target.value as ProviderType)}
              className="admin-input font-medium bg-[#0c100c]"
            >
              <option value="gemini">Google Gemini (Recommended & Fast)</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic Claude</option>
            </select>
          </label>

          {/* Model Dropdown */}
          <label className="admin-field">
            <span>Model Selection (Latest 2025/2026 Models)</span>
            <select
              value={isCustomModel ? "custom" : form.model}
              onChange={(e) => handleModelSelect(e.target.value)}
              className="admin-input font-mono text-xs bg-[#0c100c]"
            >
              {currentModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
              <option value="custom">Custom Model ID...</option>
            </select>
          </label>

          {/* Custom Model Text Input */}
          {isCustomModel && (
            <label className="admin-field admin-field-wide">
              <span>Custom Model Identifier</span>
              <input
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder="e.g. gemini-2.5-pro or gpt-4o"
                className="admin-input font-mono text-xs"
              />
            </label>
          )}

          {/* API Key Field with Helper Link & Database Status */}
          <label className="admin-field admin-field-wide">
            <div className="flex items-center justify-between pb-1">
              <span className="flex items-center gap-1.5">
                <Key size={13} /> API Key
                {hasApiKey && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--acid)] font-mono bg-[var(--acid)]/10 px-2 py-0.5 rounded border border-[var(--acid)]/25">
                    <ShieldCheck size={11} /> Saved in Database
                  </span>
                )}
              </span>
              {keyLink && (
                <a
                  href={keyLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[var(--acid)] hover:underline flex items-center gap-1"
                >
                  {keyLink.label} <ExternalLink size={11} />
                </a>
              )}
            </div>
            <input
              value={form.apiKey}
              onChange={(e) => update("apiKey", e.target.value)}
              type="password"
              className="admin-input font-mono"
              placeholder={
                hasApiKey
                  ? "•••••••••••••••••••• (API key is saved in database. Enter a new key only to replace it)"
                  : "Paste your API key here (e.g. AIzaSy...)"
              }
              autoComplete="new-password"
            />
          </label>

          {/* System Prompt */}
          <label className="admin-field admin-field-wide">
            <span>System Persona & Instructions</span>
            <textarea
              value={form.systemPrompt}
              onChange={(e) => update("systemPrompt", e.target.value)}
              className="admin-input admin-textarea admin-textarea-tall"
              rows={4}
            />
          </label>
        </div>
      </section>

      {/* Section 02: Response Controls */}
      <section className="admin-panel admin-settings-panel">
        <div className="admin-section-heading">
          <span>02</span>
          <div>
            <h2>Response Controls & Features</h2>
            <p>Keep response outputs focused, fast, and usage predictable.</p>
          </div>
        </div>

        <div className="admin-form-grid admin-form-grid-three">
          <label className="admin-field">
            <span>Temperature (0 = Strict, 1 = Creative)</span>
            <input
              value={form.temperature}
              onChange={(e) => update("temperature", Number(e.target.value))}
              className="admin-input"
              type="number"
              min="0"
              max="2"
              step="0.1"
            />
          </label>

          <label className="admin-field">
            <span>Max Tokens</span>
            <input
              value={form.maxTokens}
              onChange={(e) => update("maxTokens", Number(e.target.value))}
              className="admin-input"
              type="number"
              min="100"
              max="4000"
            />
          </label>

          <label className="admin-field">
            <span>Monthly Rate Limit</span>
            <input
              value={form.monthlyLimit}
              onChange={(e) => update("monthlyLimit", Number(e.target.value))}
              className="admin-input"
              type="number"
              min="0"
              placeholder="0 = Unlimited"
            />
          </label>
        </div>

        <div className="admin-switch-grid">
          <label>
            <input
              type="checkbox"
              checked={form.leadQualification}
              onChange={(e) => update("leadQualification", e.target.checked)}
            />
            <span>
              <strong>Lead Qualification</strong>
              <small>Score portfolio inquiries automatically</small>
            </span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.bookingEnabled}
              onChange={(e) => update("bookingEnabled", e.target.checked)}
            />
            <span>
              <strong>Appointment Booking</strong>
              <small>Offer scheduling suggestions in chat</small>
            </span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.fallbackEnabled}
              onChange={(e) => update("fallbackEnabled", e.target.checked)}
            />
            <span>
              <strong>Provider Fallback</strong>
              <small>Failover to secondary providers on outage</small>
            </span>
          </label>
        </div>
      </section>

      {/* Action Footer */}
      <div className="admin-action-bar flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          {statusType === "success" && <CheckCircle2 size={15} className="text-[var(--acid)]" />}
          {statusType === "error" && <AlertCircle size={15} className="text-red-400" />}
          {statusType === "info" && <Sparkles size={15} className="text-white/60" />}
          <span
            className={
              statusType === "error"
                ? "text-red-400"
                : statusType === "success"
                ? "text-[var(--acid)] font-semibold"
                : "text-white/70"
            }
          >
            {status || "Credentials are encrypted before database storage."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={test} disabled={busy} className="admin-button" type="button">
            <TestTube2 size={15} /> Test Connection
          </button>
          <button onClick={save} disabled={busy} className="admin-button admin-button-primary" type="button">
            {busy ? <LoaderCircle className="animate-spin" size={15} /> : <Save size={15} />} Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
