"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, LoaderCircle, Video } from "lucide-react";
import { PixelCalendar, PixelCheck, PixelSend } from "./PixelIcons";
import { PixelCard } from "./PixelCard";
import { InteractiveMeetingPicker } from "./InteractiveMeetingPicker";

const projectTypes = [
  "Workflow automation",
  "AI agent system",
  "SaaS MVP",
  "CRM and outreach",
  "Automation audit",
];
const budgets = ["Under $1,000", "$1,000–$3,000", "$3,000–$5,000", "$5,000+"];
const timelines = ["As soon as possible", "Within 1 month", "1–3 months", "Exploring options"];

function PortfolioSelect({
  name,
  placeholder,
  options,
  value: controlledValue,
  onChange,
}: {
  name: string;
  placeholder: string;
  options: string[];
  value?: string;
  onChange?: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(controlledValue || "");
  const [invalid, setInvalid] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    function close(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  function choose(option: string) {
    if (onChange) onChange(option);
    else setInternalValue(option);
    setInvalid(false);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div
      className={`relative w-full select-none ${open ? "z-40" : "z-10"}`}
      ref={root}
    >
      <select
        className="sr-only opacity-0 pointer-events-none absolute"
        name={name}
        value={value}
        onChange={(event) => {
          if (onChange) onChange(event.target.value);
          else setInternalValue(event.target.value);
        }}
        required
        tabIndex={-1}
        aria-hidden="true"
        onInvalid={(event) => {
          event.preventDefault();
          setInvalid(true);
          trigger.current?.focus();
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button
        ref={trigger}
        type="button"
        className={`w-full min-h-[46px] h-[46px] px-3.5 py-2.5 rounded bg-[#0b100b] hover:bg-[#111711] border ${
          open
            ? "border-[#c8ff3d] shadow-[0_0_15px_rgba(200,255,61,0.18)] ring-1 ring-[#c8ff3d]/40"
            : invalid
            ? "border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
            : "border-white/[0.14] hover:border-[#c8ff3d]/40"
        } flex items-center justify-between text-left transition-all duration-150 cursor-pointer group`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <div className="flex items-center gap-2.5 truncate">
          <span
            className={`size-2 rounded-full transition-all duration-200 ${
              value
                ? "bg-[#c8ff3d] shadow-[0_0_8px_#c8ff3d]"
                : "bg-white/20 group-hover:bg-[#c8ff3d]/60"
            }`}
          />
          <span
            className={`text-xs font-mono font-medium truncate ${
              value ? "text-white font-bold" : "text-[#798575]"
            }`}
          >
            {value || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-2 pl-2 shrink-0">
          {value && (
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-[#c8ff3d] bg-[#142214] px-1.5 py-0.5 rounded border border-[#c8ff3d]/30 hidden sm:inline-block">
              SET
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-[#838e7f] group-hover:text-white transition-transform duration-200 ${
              open ? "rotate-180 text-[#c8ff3d] group-hover:text-[#c8ff3d]" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 bg-[#090e09]/95 backdrop-blur-2xl border border-[#c8ff3d]/40 rounded shadow-[0_16px_48px_rgba(0,0,0,0.85)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
          role="listbox"
          aria-label={placeholder}
        >
          <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-[#838e7f] border-b border-white/[0.06] mb-1 flex items-center justify-between">
            <span>{placeholder}</span>
            <span className="text-[#c8ff3d]">{options.length} OPTIONS</span>
          </div>

          <div className="max-h-60 overflow-y-auto scrollbar-none space-y-1">
            {options.map((option, index) => (
              <button
                type="button"
                role="option"
                aria-selected={value === option}
                onClick={() => choose(option)}
                key={option}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all text-left cursor-pointer group ${
                  value === option
                    ? "bg-[#142414] text-[#c8ff3d] font-bold border border-[#c8ff3d]/40 shadow-[0_0_12px_rgba(200,255,61,0.12)]"
                    : "text-[#a4ada0] hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`text-[10px] font-bold font-mono transition-colors ${
                      value === option
                        ? "text-[#c8ff3d]"
                        : "text-[#5f685c] group-hover:text-[#c8ff3d]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{option}</span>
                </div>
                {value === option && (
                  <PixelCheck size={14} className="text-[#c8ff3d] shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [wantMeeting, setWantMeeting] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [submittedData, setSubmittedData] = useState<{
    name?: string;
    email?: string;
    meetingDate?: string;
    meetingTime?: string;
    projectType?: string;
    meetUrl?: string;
  } | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    try {
      const finalDate = wantMeeting ? (meetingDate || String(values.meetingDate || "")) : undefined;
      const finalTime = wantMeeting ? (meetingTime || String(values.meetingTime || "")) : undefined;

      const clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka";
      const payload = {
        ...values,
        meetingRequested: wantMeeting,
        meetingDate: finalDate,
        meetingTime: finalTime,
        timezone: clientTz,
        meetingPlatform: wantMeeting ? "Google Meet (Online)" : undefined,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "Unable to send");

      setSubmittedData({
        name: String(values.name || ""),
        email: String(values.email || ""),
        meetingDate: finalDate,
        meetingTime: finalTime,
        projectType: String(values.projectType || ""),
        meetUrl: resData.meetUrl,
      });

      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  function getGoogleCalendarUrl() {
    if (!submittedData?.meetingDate) return "";
    const cleanDate = submittedData.meetingDate.replace(/-/g, "");
    const title = encodeURIComponent(`Discovery Call · Mehedi & ${submittedData.name || "Client"}`);
    const details = encodeURIComponent(
      `Project Brief Discussion: ${submittedData.projectType || "AI & Automation"}\nClient Email: ${submittedData.email}\nPlatform: Google Meet\n\nScheduled via Mehedi's Portfolio.`
    );
    const location = encodeURIComponent(submittedData.meetUrl || "Google Meet (Online Video Call)");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${cleanDate}T100000Z/${cleanDate}T104500Z`;
  }

  if (status === "done") {
    const gcalUrl = getGoogleCalendarUrl();

    return (
      <div className="glass card min-h-[420px] grid place-items-center text-center p-8">
        <div className="space-y-4 max-w-md">
          <div className="size-14 rounded bg-[#c8ff3d18] border border-[#c8ff3d44] text-[#c8ff3d] grid place-items-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h3 className="text-2xl font-bold text-white">Your brief is in.</h3>
          <p className="text-sm text-[#a4ada0] leading-relaxed">
            {submittedData?.meetingDate ? (
              <>
                Received your brief and discovery meeting request for{" "}
                <strong className="text-[#c8ff3d]">{submittedData.meetingDate}</strong> at{" "}
                <strong className="text-[#c8ff3d]">{submittedData.meetingTime || "11:00 AM"}</strong>.
                {submittedData.meetUrl ? (
                  <> A Google Calendar event and Google Meet link have been automatically generated and sent to <strong className="text-white">{submittedData.email}</strong>.</>
                ) : (
                  <> I will review it personally and send a Google Meet invite directly to <strong className="text-white">{submittedData.email}</strong>.</>
                )}
              </>
            ) : (
              "I’ll review your brief personally and reply to your email with a focused next step."
            )}
          </p>

          {submittedData?.meetingDate && gcalUrl && (
            <div className="pt-2">
              <a
                href={gcalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#162215] border border-[#c8ff3d55] hover:border-[#c8ff3d] text-[#c8ff3d] text-xs font-bold rounded transition"
              >
                <PixelCalendar size={15} />
                Add to Google Calendar <ExternalLink size={13} />
              </a>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setSubmittedData(null);
                setWantMeeting(false);
              }}
              className="text-xs text-[#a4ada0] hover:text-white underline font-mono"
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass card contact-form-grid">
      <label className="label">
        <span>Name</span>
        <input
          className="input min-h-[46px] h-[46px] px-3.5 py-2.5 rounded bg-[#0b100b] border border-white/[0.14] hover:border-white/25 focus:border-[#c8ff3d] focus:ring-1 focus:ring-[#c8ff3d]/30 text-white text-xs font-mono transition"
          name="name"
          minLength={2}
          maxLength={100}
          required
          placeholder="e.g. Alex Vance"
        />
      </label>
      <label className="label">
        <span>Work email</span>
        <input
          className="input min-h-[46px] h-[46px] px-3.5 py-2.5 rounded bg-[#0b100b] border border-white/[0.14] hover:border-white/25 focus:border-[#c8ff3d] focus:ring-1 focus:ring-[#c8ff3d]/30 text-white text-xs font-mono transition"
          type="email"
          name="email"
          maxLength={200}
          required
          placeholder="alex@company.com"
        />
      </label>
      <label className="label">
        <span>
          Company <i>(optional)</i>
        </span>
        <input
          className="input min-h-[46px] h-[46px] px-3.5 py-2.5 rounded bg-[#0b100b] border border-white/[0.14] hover:border-white/25 focus:border-[#c8ff3d] focus:ring-1 focus:ring-[#c8ff3d]/30 text-white text-xs font-mono transition"
          name="company"
          maxLength={150}
          placeholder="Acme Corp"
        />
      </label>
      <div className="label">
        <span>Project type</span>
        <PortfolioSelect
          name="projectType"
          placeholder="Select a project"
          options={projectTypes}
        />
      </div>
      <div className="label">
        <span>Budget range</span>
        <PortfolioSelect name="budget" placeholder="Select a range" options={budgets} />
      </div>
      <div className="label">
        <span>Desired timeline</span>
        <PortfolioSelect name="timeline" placeholder="Select a timeline" options={timelines} />
      </div>

      {/* Online Meeting / Interactive Calendar & Time Slot Picker */}
      <div className="contact-form-wide border border-[#ffffff15] hover:border-[#c8ff3d44] bg-[#0c120c] p-4 rounded space-y-4 transition">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={wantMeeting}
              onChange={(e) => setWantMeeting(e.target.checked)}
              className="size-4 accent-[#c8ff3d] rounded cursor-pointer"
            />
            <span className="flex items-center gap-2 text-xs font-bold text-[#ffffff]">
              <PixelCalendar size={16} className="text-[#c8ff3d]" />
              Schedule an online discovery meeting (Google Meet)
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#c8ff3d15] border border-[#c8ff3d33] rounded text-[10px] font-mono text-[#c8ff3d]">
            <Video size={11} /> Google Meet
          </span>
        </label>

        {/* Visual 8-Bit Interactive Calendar & Date-based Time Slot Selector */}
        {wantMeeting && (
          <div className="pt-2 animate-in fade-in duration-200">
            <InteractiveMeetingPicker
              onSelect={(date, time) => {
                setMeetingDate(date);
                setMeetingTime(time);
              }}
              initialDate={meetingDate}
              initialTime={meetingTime}
            />
          </div>
        )}
      </div>

      <label className="label contact-form-wide">
        <span>What should the system solve?</span>
        <textarea
          className="input min-h-32 resize-y p-3.5 rounded bg-[#0b100b] border border-white/[0.14] hover:border-white/25 focus:border-[#c8ff3d] focus:ring-1 focus:ring-[#c8ff3d]/30 text-white text-xs font-mono transition leading-relaxed"
          name="message"
          minLength={20}
          maxLength={5000}
          required
          placeholder="Describe your current bottleneck, tools to connect, or project goals..."
        />
      </label>
      <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {status === "error" && (
        <p className="contact-form-wide text-sm text-red-300" role="alert">
          The message could not be sent. Please try again.
        </p>
      )}
      <PixelCard
        as="button"
        type="submit"
        disabled={status === "sending"}
        variant="primaryButton"
        gridSize={6}
        className="btn btn-primary contact-form-wide"
      >
        {status === "sending" ? (
          <LoaderCircle className="animate-spin" size={17} />
        ) : (
          <PixelSend size={17} />
        )}
        {wantMeeting ? "Schedule meeting & send brief" : "Send project brief"}
      </PixelCard>
    </form>
  );
}
