"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, CalendarCheck, ChartNoAxesCombined, Check, Database, Radio, Send, Webhook } from "lucide-react";
import type { WorkflowItem } from "@/lib/site-content";
import { PixelCard } from "./PixelCard";

const icons = [Webhook, BrainCircuit, Database, CalendarCheck, Send, ChartNoAxesCombined];
const cycleDuration = 2200;
const eventLabels = [
  "New lead captured",
  "Lead scored and qualified",
  "Contact synced to CRM",
  "Appointment slot reserved",
  "Follow-up sequence launched",
  "Dashboard metrics refreshed",
];

export function WorkflowVisualizer({ workflowNodes }: { workflowNodes: WorkflowItem[] }) {
  const [active, setActive] = useState(0);
  const selected = workflowNodes[active];

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % workflowNodes.length);
    }, cycleDuration);

    return () => window.clearTimeout(timer);
  }, [active, workflowNodes.length]);

  return <div className="workflow-console">
    <div className="workflow-console-bar">
      <div><span className="workflow-live" />AUTOMATION / LEAD-TO-BOOKING</div>
      <div className="workflow-console-meta"><span>6 CONNECTED NODES</span><span>STATUS: HEALTHY</span><span>MODE: LIVE</span></div>
    </div>
    <div className="workflow-console-body">
      <div className="workflow-canvas">
        <div className="workflow-canvas-grid" aria-hidden="true" />
        <div className="workflow-track">{workflowNodes.map((node, index) => {
          const Icon = icons[index];
          return <div className="workflow-step-wrap" key={node.name}>
            <PixelCard as="button" variant="glass" gridSize={6} onClick={() => setActive(index)} className={`workflow-step ${active === index ? "is-active" : ""}`} aria-pressed={active === index}>
              <span className="workflow-step-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="workflow-step-icon"><Icon size={18} /></span>
              <strong>{node.name}</strong>
              <small>{active === index ? "Inspecting" : "Open node"}</small>
            </PixelCard>
            {index < workflowNodes.length - 1 && <div className={`workflow-connector ${index < active ? "is-complete" : ""} ${index === active ? "is-flowing" : ""}`} aria-hidden="true"><i /></div>}
          </div>;
        })}</div>
        <div className="workflow-event-log" aria-live="polite"><Radio size={13} /><span>Live event</span><strong>{eventLabels[active]}</strong><time>now</time></div>
      </div>
      <aside className="workflow-inspector">
        <div className="workflow-inspector-top"><span>NODE / {String(active + 1).padStart(2, "0")}</span><i>ACTIVE</i></div>
        <div className="workflow-inspector-icon">{(() => { const SelectedIcon = icons[active]; return <SelectedIcon size={25} />; })()}</div>
        <h3>{selected.name}</h3>
        <p>{selected.desc}</p>
        <div className="workflow-inspector-row"><span>TOOLS</span><strong>{selected.tools}</strong></div>
        <div className="workflow-benefit"><Check size={15} /><span>{selected.benefit}</span></div>
        <div className="workflow-node-stats"><div><small>AVG. RUN</small><strong>1.2s</strong></div><div><small>FAILURE PATH</small><strong>Ready</strong></div></div>
      </aside>
    </div>
  </div>;
}
