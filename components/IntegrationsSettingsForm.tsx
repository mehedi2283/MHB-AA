"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Key,
  Link2,
  LoaderCircle,
  LogOut,
  Mail,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Unlink,
  Video,
  Webhook,
} from "lucide-react";
import { PixelCalendar, PixelCheck } from "./PixelIcons";
import { PixelLoader } from "./PixelLoader";

type GoogleStatus = {
  connected: boolean;
  account: {
    email: string;
    name: string;
    picture?: string;
    connectedAt: string;
    scopes: string[];
  } | null;
  hasClientId: boolean;
  clientId: string;
  hasClientSecret: boolean;
};

export function IntegrationsSettingsForm() {
  const [googleStatus, setGoogleStatus] = useState<GoogleStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCredsForm, setShowCredsForm] = useState(false);
  const [clientIdInput, setClientIdInput] = useState("");
  const [clientSecretInput, setClientSecretInput] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadStatus() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google/status");
      if (res.ok) {
        const data: GoogleStatus = await res.json();
        setGoogleStatus(data);
      }
    } catch {
      setMsg({ type: "error", text: "Unable to load Google integration status." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
    // Check URL params for success/error from OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("google") === "connected") {
      setMsg({ type: "success", text: "Google account connected successfully! Calendar and Gmail are now synced." });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get("error")) {
      const err = urlParams.get("error");
      setMsg({
        type: "error",
        text: err === "missing_google_client_id"
          ? "Google Client ID is missing. Please configure your Google Cloud OAuth credentials below."
          : `Google OAuth connection failed: ${err}`,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  async function handleDisconnect() {
    if (!confirm("Disconnect your Google account? Automatic Calendar and Gmail sync will be paused.")) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/auth/google/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Google account disconnected." });
        await loadStatus();
      }
    } catch {
      setMsg({ type: "error", text: "Failed to disconnect Google account." });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSaveCredentials(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/google/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "save_credentials",
          clientId: clientIdInput,
          clientSecret: clientSecretInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");

      setMsg({ type: "success", text: "Google OAuth credentials saved securely in Supabase!" });
      setShowCredsForm(false);
      setClientSecretInput("");
      await loadStatus();
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to save credentials." });
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <PixelLoader label="VERIFYING GOOGLE ACCOUNT INTEGRATION STATUS..." />;
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-[#ffffff10]">
        <div className="admin-kicker">CONTROL ROOM / DIRECT INTEGRATIONS</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white flex items-center gap-3 mt-1">
          <PixelCalendar size={28} className="text-[#c8ff3d]" />
          Google Account & Direct Sync
        </h1>
        <p className="text-sm text-[#a4ada0] mt-2 leading-relaxed max-w-2xl">
          Directly connect your Google Account with 1-click OAuth to sync Google Calendar discovery meetings and send Gmail notifications.
        </p>
      </div>

      {msg && (
        <div
          className={`p-3.5 border rounded-lg text-xs font-mono flex items-center gap-2.5 ${
            msg.type === "success"
              ? "bg-[#c8ff3d12] border-[#c8ff3d44] text-[#c8ff3d]"
              : "bg-rose-950/40 border-rose-800 text-rose-300"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {msg.text}
        </div>
      )}

      {/* Main Google OAuth Card */}
      <div className="border border-[#ffffff18] bg-[#0d110d] rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ffffff10] pb-5">
          <div className="flex items-center gap-3.5">
            {/* Google SVG Icon */}
            <div className="size-11 rounded-lg bg-[#ffffff0a] border border-[#ffffff18] grid place-items-center flex-shrink-0">
              <svg className="size-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Google Workspace Integration
                {googleStatus?.connected && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#c8ff3d20] border border-[#c8ff3d44] text-[#c8ff3d] flex items-center gap-1 font-bold">
                    <span className="size-1.5 rounded-full bg-[#c8ff3d] animate-pulse" />
                    CONNECTED
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#a4ada0] mt-0.5">
                Google Calendar · Google Meet Video Calls · Gmail Notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {googleStatus?.connected ? (
              <button
                onClick={handleDisconnect}
                disabled={actionLoading}
                className="px-3.5 py-2 rounded text-xs font-mono font-bold bg-rose-950/40 border border-rose-800 text-rose-300 hover:bg-rose-900/60 transition flex items-center gap-1.5"
              >
                {actionLoading ? <LoaderCircle size={14} className="animate-spin" /> : <Unlink size={14} />}
                Disconnect Account
              </button>
            ) : (
              <a
                href="/api/auth/google"
                className="px-4 py-2.5 rounded text-xs font-bold bg-white text-black hover:bg-[#eaeaea] shadow-lg transition flex items-center gap-2"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign in & Connect Google Account
              </a>
            )}
          </div>
        </div>

        {/* Connected Account Details View */}
        {googleStatus?.connected && googleStatus.account ? (
          <div className="bg-[#111710] border border-[#c8ff3d33] rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              {googleStatus.account.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={googleStatus.account.picture}
                  alt={googleStatus.account.name}
                  className="size-10 rounded-full border border-[#c8ff3d]"
                />
              ) : (
                <div className="size-10 rounded-full bg-[#c8ff3d20] border border-[#c8ff3d] grid place-items-center text-[#c8ff3d] font-bold">
                  {googleStatus.account.name.charAt(0)}
                </div>
              )}
              <div>
                <strong className="text-sm text-white block">{googleStatus.account.name}</strong>
                <span className="text-xs font-mono text-[#c8ff3d]">{googleStatus.account.email}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-[#ffffff10] text-xs text-[#a4ada0]">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#c8ff3d]" />
                <span>Auto-creates Google Calendar events</span>
              </div>
              <div className="flex items-center gap-2">
                <Video size={15} className="text-[#c8ff3d]" />
                <span>Auto-generates Google Meet links</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-[#c8ff3d]" />
                <span>Sends Gmail client invites</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#a4ada0] leading-relaxed space-y-3">
            <p>
              Clicking <strong>Sign in & Connect Google Account</strong> will open Google’s secure account selection screen. Once authorized, any discovery call booked in your contact form or AI chat will instantly appear on your real Google Calendar with a Google Meet link!
            </p>
          </div>
        )}

        {/* OAuth Credentials Configurator / Setup Drawer */}
        <div className="pt-2 border-t border-[#ffffff10]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#a4ada0]">
              <Key size={13} className="text-[#c8ff3d]" />
              <span>
                Google Cloud OAuth App:{" "}
                <strong className="text-white">
                  {googleStatus?.hasClientId ? "Configured ✓" : "Needs Credentials"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-[11px] text-[#c8ff3d] hover:underline flex items-center gap-1 font-mono"
              >
                <HelpCircle size={12} />
                {showGuide ? "Hide Google Cloud guide" : "How to get OAuth Client ID"}
              </button>
              <button
                type="button"
                onClick={() => setShowCredsForm(!showCredsForm)}
                className="text-[11px] text-[#a4ada0] hover:text-white underline font-mono"
              >
                {showCredsForm ? "Close configuration" : "Edit OAuth Credentials"}
              </button>
            </div>
          </div>

          {/* Setup Guide */}
          {showGuide && (
            <div className="mt-4 p-4 bg-[#111710] border border-[#c8ff3d33] rounded-lg text-xs text-[#a4ada0] space-y-2.5 font-mono">
              <strong className="text-white block font-bold">Quick 2-Minute Google Cloud OAuth Setup:</strong>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed">
                <li>
                  Go to{" "}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#c8ff3d] underline"
                  >
                    console.cloud.google.com/apis/credentials
                  </a>
                  .
                </li>
                <li>Click <strong>+ CREATE CREDENTIALS</strong> → <strong>OAuth client ID</strong>.</li>
                <li>Set Application type to <strong>Web application</strong>.</li>
                <li>
                  Under <strong>Authorized redirect URIs</strong>, add:
                  <div className="mt-1 p-2 bg-[#060806] border border-[#ffffff15] text-[#c8ff3d] select-all rounded">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/api/auth/google/callback`
                      : "http://localhost:3000/api/auth/google/callback"}
                  </div>
                </li>
                <li>Enable <strong>Google Calendar API</strong> and <strong>Gmail API</strong> in Library.</li>
                <li>Copy your <strong>Client ID</strong> and <strong>Client Secret</strong> and paste below!</li>
              </ol>
            </div>
          )}

          {/* Custom Credentials Form */}
          {showCredsForm && (
            <form onSubmit={handleSaveCredentials} className="mt-4 p-4 bg-[#0a0d0a] border border-[#ffffff18] rounded-lg space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="label">
                  <span className="text-xs text-[#e8eee2]">Google OAuth Client ID</span>
                  <input
                    type="text"
                    value={clientIdInput}
                    onChange={(e) => setClientIdInput(e.target.value)}
                    placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                    required
                    className="input text-xs font-mono text-[#e8eee2] bg-[#070907] border-[#ffffff20] focus:border-[#c8ff3d]"
                  />
                </label>

                <label className="label">
                  <span className="text-xs text-[#e8eee2]">Google OAuth Client Secret</span>
                  <input
                    type="password"
                    value={clientSecretInput}
                    onChange={(e) => setClientSecretInput(e.target.value)}
                    placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                    required
                    className="input text-xs font-mono text-[#e8eee2] bg-[#070907] border-[#ffffff20] focus:border-[#c8ff3d]"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCredsForm(false)}
                  className="px-3 py-1.5 text-xs text-[#a4ada0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-[#c8ff3d] text-black font-bold text-xs rounded hover:bg-[#d8ff60] transition flex items-center gap-1.5"
                >
                  {actionLoading ? <LoaderCircle size={13} className="animate-spin" /> : <Save size={13} />}
                  Save Credentials
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
