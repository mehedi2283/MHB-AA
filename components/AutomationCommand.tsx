"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, Command, Sparkles } from "lucide-react";
import { PixelCard } from "./PixelCard";

export function AutomationCommand() {
  const [value, setValue] = useState("");
  const [answer, setAnswer] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const v = value.toLowerCase();
    const service =
      v.includes("call") || v.includes("voice")
        ? "an AI Voice Agent"
        : v.includes("lead") || v.includes("email")
        ? "a CRM & Outreach System"
        : v.includes("support") || v.includes("chat")
        ? "a knowledge-grounded AI Assistant"
        : "a workflow architecture sprint";
    setAnswer(
      `A strong starting point is ${service}. I’d map the inputs, decisions, integrations and success metrics before we build.`
    );
  }

  return (
    <div className="mt-9 max-w-2xl">
      <form onSubmit={submit} className="glass flex items-center gap-3 rounded-[4px] p-2 pl-4">
        <Command className="text-blue-400 shrink-0" size={18} />
        <input
          aria-label="Automation idea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-0 flex-1 bg-transparent outline-none text-sm"
          placeholder="What would you like to automate?"
        />
        <PixelCard
          as="button"
          type="submit"
          variant="primaryButton"
          gridSize={5}
          className="grid place-items-center size-10 rounded-[4px] bg-blue-500 hover:bg-blue-400 transition"
          aria-label="Get recommendation"
        >
          <ArrowRight size={18} />
        </PixelCard>
      </form>
      {answer && (
        <div className="mt-3 flex gap-2 rounded-[4px] border border-blue-400/20 bg-blue-400/8 p-4 text-sm text-slate-300 leading-relaxed">
          <Sparkles className="text-blue-400 shrink-0" size={16} />
          <span>
            {answer} <a href="#contact" className="text-blue-300">Discuss the idea →</a>
          </span>
        </div>
      )}
    </div>
  );
}

