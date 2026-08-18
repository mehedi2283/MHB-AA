"use client";

import { useState } from "react";
import { Box, Check, Radio } from "lucide-react";

const descriptions: Record<string, string> = {
  "GGLeap": "Supplies live member and activity events from the gaming environment.",
  "JWT Gateway": "Centralizes authentication and securely shares access across the workflow layer.",
  "n8n Workflows": "Orchestrates lifecycle rules, campaigns, retries and operational handoffs.",
  "SendGrid": "Delivers timely member communication triggered by lifecycle events.",
  "Reporting": "Turns workflow activity into a clear operational view for the team.",
  "Apollo": "Sources prospect data and begins the outreach pipeline with structured records.",
  "Enrichment": "Adds the business and contact context required for accurate personalization.",
  "AI Personalization": "Transforms enriched context into relevant, prospect-specific messaging.",
  "Instantly": "Runs sequenced delivery and returns campaign activity to the system.",
  "Client Dashboard": "Gives the client one focused place to review leads, campaigns and outcomes.",
  "Business Knowledge": "Maintains the shared facts, policies and context every specialist agent can trust.",
  "Agent Router": "Understands each request and sends it to the agent with the right responsibility.",
  "8 Specialist Agents": "Handle distinct business functions without collapsing everything into one general chatbot.",
  "n8n": "Coordinates triggers, tool calls, data movement, retries and cross-agent automation.",
  "Supabase": "Provides a centralized knowledge and operational data layer for the ecosystem.",
  "VPS": "Hosts the production environment with direct ownership of deployment and runtime control.",
};

export function ArchitectureDiagram({ nodes }: { nodes: string[] }) {
  const [active, setActive] = useState(0);
  const selected = nodes[active];

  return <div className="case-architecture">
    <div className="case-architecture-console"><span><i /> LIVE ARCHITECTURE</span><div>{nodes.length} COMPONENTS <strong>HEALTHY</strong></div></div>
    <div className="case-architecture-track" role="tablist" aria-label="System components">
      {nodes.map((node, index) => <button key={node} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={active === index ? "is-active" : ""}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <Box size={20} />
        <strong>{node}</strong>
        <i>{active === index ? "INSPECTING" : "OPEN LAYER"}</i>
      </button>)}
    </div>
    <div className="case-architecture-detail">
      <div className="case-architecture-number">{String(active + 1).padStart(2, "0")}</div>
      <div><span>SELECTED COMPONENT</span><h3>{selected}</h3><p>{descriptions[selected] ?? `${selected} owns one explicit responsibility within the system, keeping inputs, outputs and failure paths maintainable.`}</p></div>
      <div className="case-architecture-status"><div><Radio size={13} /><span>STATUS</span><strong>Connected</strong></div><div><Check size={13} /><span>FAILURE PATH</span><strong>Defined</strong></div></div>
    </div>
  </div>;
}
