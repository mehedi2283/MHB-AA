"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, LoaderCircle, Video } from "lucide-react";
import { PixelCalendar, PixelCheck, PixelSend } from "./PixelIcons";
import { PixelCard } from "./PixelCard";

const projectTypes = [
  "Workflow automation",
  "AI agent system",
  "SaaS MVP",
  "CRM and outreach",
  "Automation audit",
];
const budgets = ["Under $1,000", "$1,000–$3,000", "$3,000–$5,000", "$5,000+"];
const timelines = ["As soon as possible", "Within 1 month", "1–3 months", "Exploring options"];
const meetingTimeSlots = [
  "Morning (09:00 AM – 12:00 PM)",
  "Afternoon (01:00 PM – 05:00 PM)",
  "Evening (06:00 PM – 09:00 PM)",
  "Flexible / Anytime",
];

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
      className={`portfolio-select ${open ? "is-open" : ""} ${invalid ? "is-invalid" : ""}`}
      ref={root}
    >
      <select
        className="portfolio-select-native"
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
        className="portfolio-select-trigger"
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
        <span className={value ? "has-value" : ""}>{value || placeholder}</span>
        <ChevronDown size={15} />
      </button>
      {open && (
        <div className="portfolio-select-menu" role="listbox" aria-label={placeholder}>
          {options.map((option, index) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => choose(option)}
              key={option}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{option}</strong>
              {value === option && <PixelCheck size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [wantMeeting, setWantMeeting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name?: string;
    email?: string;
    meetingDate?: string;
    meetingTime?: string;
    projectType?: string;
  } | null>(null);

  // Tomorrow's date in YYYY-MM-DD for min date attribute
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    try {
      const payload = {
        ...values,
        meetingRequested: wantMeeting,
        meetingPlatform: wantMeeting ? "Google Meet (Online)" : undefined,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Unable to send");

      setSubmittedData({
        name: String(values.name || ""),
        email: String(values.email || ""),
        meetingDate: wantMeeting ? String(values.meetingDate || "") : undefined,
        meetingTime: wantMeeting ? String(values.meetingTime || "") : undefined,
        projectType: String(values.projectType || ""),
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
    const location = encodeURIComponent("Google Meet (Online Video Call)");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${cleanDate}T090000Z/${cleanDate}T100000Z`;
  }

  if (status === "done") {
    const gcalUrl = getGoogleCalendarUrl();

    return (
      <div className="glass card min-h-[420px] grid place-items-center text-center p-8">
        <div className="space-y-4 max-w-md">
          <div className="size-14 rounded-full bg-[#c8ff3d18] border border-[#c8ff3d44] text-[#c8ff3d] grid place-items-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h3 className="text-2xl font-bold text-white">Your brief is in.</h3>
          <p className="text-sm text-[#a4ada0] leading-relaxed">
            {submittedData?.meetingDate ? (
              <>
                Received your brief and meeting request for{" "}
                <strong className="text-[#c8ff3d]">{submittedData.meetingDate}</strong> (
                {submittedData.meetingTime || "Flexible"}). I will review it and send a Google Meet
                invite to <strong className="text-white">{submittedData.email}</strong>.
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
        <input className="input" name="name" minLength={2} maxLength={100} required />
      </label>
      <label className="label">
        <span>Work email</span>
        <input className="input" type="email" name="email" maxLength={200} required />
      </label>
      <label className="label">
        <span>
          Company <i>(optional)</i>
        </span>
        <input className="input" name="company" maxLength={150} />
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

      {/* Online Meeting / Google Calendar Booking Toggle */}
      <div className="contact-form-wide border border-[#ffffff15] hover:border-[#c8ff3d44] bg-[#0c120c] p-4 rounded-lg space-y-3 transition">
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

        {wantMeeting && (
          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[#ffffff10] animate-in fade-in duration-200">
            <label className="label">
              <span className="text-[#c8ff3d]">Preferred Meeting Date *</span>
              <input
                type="date"
                name="meetingDate"
                min={tomorrowStr}
                required={wantMeeting}
                className="input font-mono text-xs text-[#e8eee2] bg-[#070907] cursor-pointer border-[#c8ff3d44] focus:border-[#c8ff3d]"
              />
            </label>
            <div className="label">
              <span className="text-[#c8ff3d]">Preferred Time Slot</span>
              <PortfolioSelect
                name="meetingTime"
                placeholder="Select a time window"
                options={meetingTimeSlots}
              />
            </div>
          </div>
        )}
      </div>

      <label className="label contact-form-wide">
        <span>What should the system solve?</span>
        <textarea
          className="input min-h-32 resize-y"
          name="message"
          minLength={20}
          maxLength={5000}
          required
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
