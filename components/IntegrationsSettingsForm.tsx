"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Key,
  LoaderCircle,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  Video,
  Webhook,
} from "lucide-react";
import { PixelCalendar, PixelCheck } from "./PixelIcons";

type FormState = {
  googleCalendarUrl: string;
  googleMeetUrl: string;
  notificationEmail: string;
  autoShareCalendarInChat: boolean;
  sendEmailNotification: boolean;
  smtpEmail: string;
  smtpPassword?: string;
  webhookUrl: string;
};

export function IntegrationsSettingsForm() {
  const [form, setForm] = useState<FormState>({
    googleCalendarUrl: "",
    googleMeetUrl: "",
    notificationEmail: "",
    autoShareCalendarInChat: true,
    sendEmailNotification: true,
    smtpEmail: "",
    webhookUrl: "",
  });
  const [hasSmtpPassword, setHasSmtpPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeGuide, setActiveGuide] = useState<"calendar" | "gmail" | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/integrations");
        if (res.ok) {
          const data = await res.json();
          setForm({
            googleCalendarUrl: data.googleCalendarUrl || "",
            googleMeetUrl: data.googleMeetUrl || "",
            notificationEmail: data.notificationEmail || "",
            autoShareCalendarInChat: data.autoShareCalendarInChat !== false,
            sendEmailNotification: data.sendEmailNotification !== false,
            smtpEmail: data.smtpEmail || "",
            webhookUrl: data.webhookUrl || "",
          });
          setHasSmtpPassword(data.hasSmtpPassword);
        }
      } catch (err) {
        setError("Unable to load integration settings.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");

      setHasSmtpPassword(data.hasSmtpPassword);
      setForm((prev) => ({ ...prev, smtpPassword: "" }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#a4ada0]">
        <LoaderCircle size={24} className="animate-spin text-[#c8ff3d]" />
        <span className="text-xs font-mono tracking-wider">LOADING INTEGRATION CONFIGURATION…</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <div className="admin-kicker">CONTROL ROOM / INTEGRATIONS</div>
        <h1 className="text-xl font-bold tracking-wider text-[#ffffff] flex items-center gap-2.5">
          <PixelCalendar size={22} className="text-[#c8ff3d]" />
          Google Calendar & Gmail Setup
        </h1>
        <p className="text-xs text-[#a4ada0] mt-1">
          Connect your personal Google Calendar booking link and Gmail so the AI Assistant and Contact Form can route meeting inquiries directly to you.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-[#c8ff3d15] border border-[#c8ff3d44] text-[#c8ff3d] text-xs font-mono rounded flex items-center gap-2">
          <CheckCircle2 size={16} />
          Integration settings saved successfully to Supabase.
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono rounded flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Google Calendar & Meet */}
        <div className="border border-[#ffffff15] bg-[#0d110d] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#ffffff10] pb-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#c8ff3d]" />
              <h2 className="text-sm font-bold text-white">Google Calendar & Meeting Links</h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveGuide(activeGuide === "calendar" ? null : "calendar")}
              className="text-[11px] text-[#c8ff3d] hover:underline flex items-center gap-1 font-mono"
            >
              <HelpCircle size={12} />
              {activeGuide === "calendar" ? "Hide setup guide" : "How to get calendar link"}
            </button>
          </div>

          {activeGuide === "calendar" && (
            <div className="p-4 bg-[#111710] border border-[#c8ff3d33] rounded text-xs text-[#a4ada0] space-y-2 font-mono">
              <strong className="text-white block font-bold">How to get your Google Calendar Appointment Link:</strong>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Open <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className="text-[#c8ff3d] underline">calendar.google.com</a> on your computer.</li>
                <li>Click the <strong>+ Create</strong> button in the top-left and select <strong>Appointment schedule</strong>.</li>
                <li>Set your available days/hours and meeting duration (e.g. 30 mins) and save.</li>
                <li>Click <strong>Share</strong> on the schedule and copy your booking page link.</li>
                <li>Paste that link in the field below!</li>
              </ol>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="label">
              <span className="text-xs text-[#e8eee2] font-medium">Google Calendar Booking URL</span>
              <input
                type="url"
                value={form.googleCalendarUrl}
                onChange={(e) => setForm({ ...form, googleCalendarUrl: e.target.value })}
                placeholder="https://calendar.google.com/calendar/u/0/appointments/schedules/..."
                className="input text-xs font-mono text-[#e8eee2] bg-[#070907] border-[#ffffff20] focus:border-[#c8ff3d]"
              />
              <span className="text-[10px] text-[#717b6d]">
                Supports Google Appointment Schedules, Cal.com, or Calendly links.
              </span>
            </label>

            <label className="label">
              <span className="text-xs text-[#e8eee2] font-medium">Personal Google Meet Room URL (Optional)</span>
              <input
                type="url"
                value={form.googleMeetUrl}
                onChange={(e) => setForm({ ...form, googleMeetUrl: e.target.value })}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="input text-xs font-mono text-[#e8eee2] bg-[#070907] border-[#ffffff20] focus:border-[#c8ff3d]"
              />
              <span className="text-[10px] text-[#717b6d]">
                Your direct permanent Google Meet link for online discovery calls.
              </span>
            </label>
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.autoShareCalendarInChat}
              onChange={(e) => setForm({ ...form, autoShareCalendarInChat: e.target.checked })}
              className="size-4 accent-[#c8ff3d] rounded cursor-pointer"
            />
            <span className="text-xs text-[#a4ada0]">
              Allow AI Assistant to share this Google Calendar booking link directly in chat when users ask to schedule a call.
            </span>
          </label>
        </div>

        {/* Section 2: Gmail Notifications & SMTP */}
        <div className="border border-[#ffffff15] bg-[#0d110d] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#ffffff10] pb-3">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[#c8ff3d]" />
              <h2 className="text-sm font-bold text-white">Gmail & Lead Notification Alerts</h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveGuide(activeGuide === "gmail" ? null : "gmail")}
              className="text-[11px] text-[#c8ff3d] hover:underline flex items-center gap-1 font-mono"
            >
              <HelpCircle size={12} />
              {activeGuide === "gmail" ? "Hide setup guide" : "How to get Gmail App Password"}
            </button>
          </div>

          {activeGuide === "gmail" && (
            <div className="p-4 bg-[#111710] border border-[#c8ff3d33] rounded text-xs text-[#a4ada0] space-y-2 font-mono">
              <strong className="text-white block font-bold">How to generate a Gmail App Password:</strong>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Go to your <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-[#c8ff3d] underline">Google Account Security</a> settings.</li>
                <li>Ensure <strong>2-Step Verification</strong> is enabled.</li>
                <li>Search for <strong>"App passwords"</strong> in the search bar.</li>
                <li>Create a new app name (e.g. <code>Portfolio Alert</code>) and copy the 16-character code.</li>
                <li>Enter your Gmail and paste the 16-character password below (it will be encrypted in Supabase).</li>
              </ol>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="label">
              <span className="text-xs text-[#e8eee2] font-medium">Notification Destination Email</span>
              <input
                type="email"
                value={form.notificationEmail}
                onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })}
                placeholder="mehedi@example.com"
                className="input text-xs font-mono text-[#e8eee2] bg-[#070907] border-[#ffffff20] focus:border-[#c8ff3d]"
              />
              <span className="text-[10px] text-[#717b6d]">
                Where you want to receive new inquiry & meeting alert emails.
              </span>
            </label>

            <label className="label">
              <span className="text-xs text-[#e8eee2] font-medium">Sender Gmail Address</span>
              <input
                type="email"
                value={form.smtpEmail}
                onChange={(e) => setForm({ ...form, smtpEmail: e.target.value })}
                placeholder="your.email@gmail.com"
                className="input text-xs font-mono text-[#e8eee2] bg-[#070907] border-[#ffffff20] focus:border-[#c8ff3d]"
              />
              <span className="text-[10px] text-[#717b6d]">
                The Gmail account used to send confirmations.
              </span>
            </label>
          </div>

          <label className="label">
            <span className="text-xs text-[#e8eee2] font-medium flex items-center justify-between">
              <span>Gmail App Password (16 characters)</span>
              {hasSmtpPassword && (
                <span className="text-[10px] text-[#c8ff3d] flex items-center gap-1 font-mono">
                  <ShieldCheck size={12} /> Password Encrypted & Stored
                </span>
              )}
            </span>
            <input
              type="password"
              value={form.smtpPassword || ""}
              onChange={(e) => setForm({ ...form, smtpPassword: e.target.value })}
              placeholder={hasSmtpPassword ? "•••••••••••••••• (Leave blank to keep existing)" : "xxxx xxxx xxxx xxxx"}
              className="input text-xs font-mono text-[#e8eee2] bg-[#070907] border-[#ffffff20] focus:border-[#c8ff3d]"
            />
          </label>
        </div>

        {/* Section 3: Webhook Automation (n8n / Make / Discord) */}
        <div className="border border-[#ffffff15] bg-[#0d110d] rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#ffffff10] pb-3">
            <Webhook size={16} className="text-[#c8ff3d]" />
            <h2 className="text-sm font-bold text-white">Automation Webhook (n8n / Make / Telegram)</h2>
          </div>

          <label className="label">
            <span className="text-xs text-[#e8eee2] font-medium">Incoming Lead Webhook URL</span>
            <input
              type="url"
              value={form.webhookUrl}
              onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })}
              placeholder="https://n8n.yourdomain.com/webhook/portfolio-lead"
              className="input text-xs font-mono text-[#e8eee2] bg-[#070907] border-[#ffffff20] focus:border-[#c8ff3d]"
            />
            <span className="text-[10px] text-[#717b6d]">
              Automatically forwards new contact inquiries and meeting requests to your n8n workflow or Discord webhook in real time.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#c8ff3d] text-black font-bold text-xs rounded hover:bg-[#d8ff60] transition flex items-center gap-2"
        >
          {saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}
          Save Integration Settings
        </button>
      </form>
    </div>
  );
}
