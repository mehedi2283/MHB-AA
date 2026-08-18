"use client";
import { useEffect, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

type SectionKey = Exclude<keyof SiteContent, "metrics" | "workflowNodes">;
const labels: Record<SectionKey, string> = { hero: "Hero", about: "About", projects: "Projects heading", playground: "Playground", capabilities: "Capabilities", technology: "Technology", process: "Process", contact: "Contact", footer: "Footer" };
export function SiteContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null), [busy, setBusy] = useState(true), [message, setMessage] = useState("");
  useEffect(() => { fetch("/api/admin/site-content").then(async response => { const data = await response.json(); setContent(response.ok ? data : data.defaults); setMessage(response.ok ? "" : data.error); }).finally(() => setBusy(false)); }, []);
  function change(section: SectionKey, key: string, value: string) { setContent(current => current ? ({ ...current, [section]: { ...current[section], [key]: value } }) : current); }
  function jsonChange(key: "metrics" | "workflowNodes", value: string) { try { const parsed = JSON.parse(value); setContent(current => current ? ({ ...current, [key]: parsed }) : current); setMessage(""); } catch { setMessage(`The ${key} JSON is not valid yet.`); } }
  async function save() { if (!content) return; setBusy(true); setMessage(""); const response = await fetch("/api/admin/site-content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(content) }); const data = await response.json(); setMessage(response.ok ? "Website content saved to Supabase." : data.error); setBusy(false); }
  if (!content || busy && !content) return <div className="admin-loader"><LoaderCircle className="animate-spin" /></div>;
  return <div className="admin-page admin-page-wide"><header className="admin-page-header"><div><div className="admin-kicker">Content / Homepage</div><h1>Full website</h1><p>Every public-facing line, grouped by the section where it appears.</p></div><button className="admin-button admin-button-primary" onClick={save} disabled={busy}>{busy ? <LoaderCircle className="animate-spin" size={15} /> : <Save size={15} />}Publish changes</button></header>
    {message && <div className="admin-notice" role="status">{message}</div>}
    <div className="admin-editor-stack">{(Object.keys(labels) as SectionKey[]).map((section,index) => <section className="admin-panel admin-editor-section" key={section}><div className="admin-section-heading"><span>{String(index+1).padStart(2,"0")}</span><div><h2>{labels[section]}</h2><p>{Object.keys(content[section]).length} editable fields</p></div></div><div className="admin-form-grid">{Object.entries(content[section]).map(([key, value]) => <label className="admin-field" key={key}><span>{key.replace(/([A-Z])/g, " $1")}</span><textarea className="admin-input admin-textarea" value={String(value)} onChange={event => change(section, key, event.target.value)} /></label>)}</div></section>)}
      <section className="admin-panel admin-editor-section"><div className="admin-section-heading"><span>10</span><div><h2>Metrics</h2><p>Structured values shown on the homepage.</p></div></div><textarea className="admin-input admin-code-input" defaultValue={JSON.stringify(content.metrics, null, 2)} onBlur={event => jsonChange("metrics", event.target.value)} /></section>
      <section className="admin-panel admin-editor-section"><div className="admin-section-heading"><span>11</span><div><h2>Interactive workflow</h2><p>Names, descriptions, tools and benefits for each node.</p></div></div><textarea className="admin-input admin-code-input admin-code-input-tall" defaultValue={JSON.stringify(content.workflowNodes, null, 2)} onBlur={event => jsonChange("workflowNodes", event.target.value)} /></section>
    </div>
  </div>;
}
