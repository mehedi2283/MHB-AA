"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, LoaderCircle, Send } from "lucide-react";
import { PixelCard } from "./PixelCard";

const projectTypes = ["Workflow automation", "AI agent system", "SaaS MVP", "CRM and outreach", "Automation audit"];
const budgets = ["Under $1,000", "$1,000–$3,000", "$3,000–$5,000", "$5,000+"];
const timelines = ["As soon as possible", "Within 1 month", "1–3 months", "Exploring options"];

function PortfolioSelect({ name, placeholder, options }: { name: string; placeholder: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function close(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  function choose(option: string) {
    setValue(option);
    setInvalid(false);
    setOpen(false);
    trigger.current?.focus();
  }

  return <div className={`portfolio-select ${open ? "is-open" : ""} ${invalid ? "is-invalid" : ""}`} ref={root}>
    <select className="portfolio-select-native" name={name} value={value} onChange={(event) => setValue(event.target.value)} required tabIndex={-1} aria-hidden="true" onInvalid={(event) => { event.preventDefault(); setInvalid(true); trigger.current?.focus(); }}>
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
    <button ref={trigger} type="button" className="portfolio-select-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} onKeyDown={(event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpen(true); }
      if (event.key === "Escape") setOpen(false);
    }}>
      <span className={value ? "has-value" : ""}>{value || placeholder}</span><ChevronDown size={15} />
    </button>
    {open && <div className="portfolio-select-menu" role="listbox" aria-label={placeholder}>
      {options.map((option, index) => <button type="button" role="option" aria-selected={value === option} onClick={() => choose(option)} key={option}><span>{String(index + 1).padStart(2, "0")}</span><strong>{option}</strong>{value === option && <Check size={14} />}</button>)}
    </div>}
  </div>;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
      if (!response.ok) throw new Error("Unable to send");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") return <div className="glass card min-h-[400px] grid place-items-center text-center"><div><div className="size-14 rounded-full bg-lime-400/15 text-lime-300 grid place-items-center mx-auto text-2xl">✓</div><h3 className="text-2xl mt-5">Your brief is in.</h3><p className="muted mt-2">I’ll review it personally and reply with a focused next step.</p></div></div>;

  return <form onSubmit={submit} className="glass card contact-form-grid">
    <label className="label"><span>Name</span><input className="input" name="name" minLength={2} maxLength={100} required /></label>
    <label className="label"><span>Work email</span><input className="input" type="email" name="email" maxLength={200} required /></label>
    <label className="label"><span>Company <i>(optional)</i></span><input className="input" name="company" maxLength={150} /></label>
    <div className="label"><span>Project type</span><PortfolioSelect name="projectType" placeholder="Select a project" options={projectTypes} /></div>
    <div className="label"><span>Budget range</span><PortfolioSelect name="budget" placeholder="Select a range" options={budgets} /></div>
    <div className="label"><span>Desired timeline</span><PortfolioSelect name="timeline" placeholder="Select a timeline" options={timelines} /></div>
    <label className="label contact-form-wide"><span>What should the system solve?</span><textarea className="input min-h-32 resize-y" name="message" minLength={20} maxLength={5000} required /></label>
    <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {status === "error" && <p className="contact-form-wide text-sm text-red-300" role="alert">The message could not be sent. Please try again.</p>}
    <PixelCard as="button" type="submit" disabled={status === "sending"} variant="primaryButton" gridSize={6} className="btn btn-primary contact-form-wide">{status === "sending" ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />} Send project brief</PixelCard>
  </form>;
}
