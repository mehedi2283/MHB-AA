"use client";

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";

type Item = {
  _id: string;
  title?: string;
  name?: string;
  email?: string;
  status?: string;
  visible?: boolean;
  [key: string]: unknown;
};

type Field = {
  key: string;
  label: string;
  multiline?: boolean;
  kind?: "number" | "list" | "pairs";
};

const fields: Record<string, Field[]> = {
  projects: [
    { key: "number", label: "Case number" },
    { key: "client", label: "Client" },
    { key: "title", label: "Title" },
    { key: "slug", label: "URL slug" },
    { key: "summary", label: "Card summary", multiline: true },
    { key: "tags", label: "Tags (comma separated)", kind: "list" },
    { key: "problem", label: "Case-study problem", multiline: true },
    { key: "solution", label: "Case-study solution", multiline: true },
    { key: "implementation", label: "Implementation story", multiline: true },
    { key: "nodes", label: "Architecture nodes (comma separated)", kind: "list" },
    { key: "capabilities", label: "Capabilities (comma separated)", kind: "list" },
    { key: "stats", label: "Project stats", kind: "pairs" },
    { key: "color", label: "Accent color" },
    { key: "order", label: "Order", kind: "number" },
  ],
  services: [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
    { key: "tools", label: "Tools (comma separated)", kind: "list" },
    { key: "order", label: "Order", kind: "number" },
  ],
  technologies: [
    { key: "name", label: "Technology" },
    { key: "order", label: "Order", kind: "number" },
  ],
  process: [
    { key: "title", label: "Step" },
    { key: "order", label: "Order", kind: "number" },
  ],
  inquiries: [
    { key: "name", label: "Client Name" },
    { key: "email", label: "Email Address" },
    { key: "company", label: "Company" },
    { key: "projectType", label: "Project Type" },
    { key: "budget", label: "Budget Range" },
    { key: "timeline", label: "Timeline" },
    { key: "meetingDate", label: "Meeting Date" },
    { key: "meetingTime", label: "Meeting Time" },
    { key: "meetUrl", label: "Google Meet URL" },
    { key: "message", label: "Client Brief / Message", multiline: true },
  ],
  leads: [
    { key: "name", label: "Lead Name" },
    { key: "email", label: "Email Address" },
    { key: "company", label: "Company" },
    { key: "projectType", label: "Project Interest" },
    { key: "budget", label: "Budget" },
    { key: "timeline", label: "Timeline" },
    { key: "meetingDate", label: "Scheduled Meeting Date" },
    { key: "meetingTime", label: "Scheduled Time" },
    { key: "meetUrl", label: "Google Meet Room" },
    { key: "message", label: "Project Brief", multiline: true },
  ],
};

function toPairs(value: unknown): [string, string][] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is unknown[] => Array.isArray(entry))
    .map(entry => [String(entry[0] ?? ""), String(entry[1] ?? "")]);
}

import { PixelLoader } from "./PixelLoader";

export function ContentManager({ collection }: { collection: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const editable = Boolean(fields[collection]);

  async function load() {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/admin/${collection}`);
    const data = await response.json();
    if (response.ok) setItems(data);
    else setError(data.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [collection]);

  async function save() {
    if (!editing) return;
    const exists = editing._id;
    const response = await fetch(`/api/admin/${collection}${exists ? `/${editing._id}` : ""}`, {
      method: exists ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (response.ok) {
      setEditing(null);
      load();
    } else {
      setError((await response.json()).error);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await fetch(`/api/admin/${collection}/${id}`, { method: "DELETE" });
    load();
  }

  function setField(field: Field, raw: string) {
    let value: unknown = raw;
    if (field.kind === "list") value = raw.split(",").map(item => item.trim()).filter(Boolean);
    if (field.kind === "number") value = Number(raw);
    setEditing(current => current ? ({ ...current, [field.key]: value }) : current);
  }

  function updatePair(field: Field, index: number, part: 0 | 1, value: string) {
    setEditing(current => {
      if (!current) return current;
      const next = toPairs(current[field.key]);
      next[index] = [...next[index]] as [string, string];
      next[index][part] = value;
      return { ...current, [field.key]: next };
    });
  }

  function addPair(field: Field) {
    setEditing(current => current ? ({
      ...current,
      [field.key]: [...toPairs(current[field.key]), ["", ""]],
    }) : current);
  }

  function removePair(field: Field, index: number) {
    setEditing(current => current ? ({
      ...current,
      [field.key]: toPairs(current[field.key]).filter((_, pairIndex) => pairIndex !== index),
    }) : current);
  }

  return <div className="admin-page">
    <header className="admin-page-header">
      <div>
        <div className="admin-kicker">Content / Collection</div>
        <h1 className="capitalize">{collection}</h1>
        <p>{items.length} records stored in Supabase.</p>
      </div>
      {editable && <button className="admin-button admin-button-primary" onClick={() => setEditing({ _id: "", status: "published", visible: true, order: items.length })}><Plus size={15} />Add record</button>}
    </header>

    {error && <div className="admin-notice">{error}</div>}

    <section className="admin-panel admin-collection">
      {loading ? (
        <PixelLoader variant="skeleton-table" label={`LOADING ${collection.toUpperCase()} RECORDS...`} />
      ) : items.length ? (
        items.map((item, index) => (
          <div className="admin-collection-row" key={item._id}>
            <span className="admin-row-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="admin-row-main">
              <strong>{String(item.name || item.title || item.email || "Untitled")}</strong>
              <span className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#a4ada0]">
                {Boolean(item.email) && <span className="text-[#c8ff3d] font-mono">{String(item.email)}</span>}
                {Boolean(item.projectType) && <span>· {String(item.projectType)}</span>}
                {Boolean(item.budget) && <span>· {String(item.budget)}</span>}
                {Boolean(item.meetingDate) && (
                  <span className="text-white font-mono bg-[#162215] px-1.5 py-0.5 rounded border border-[#c8ff3d33]">
                    📅 {String(item.meetingDate)} at {String(item.meetingTime || "11:00 AM")}
                  </span>
                )}
                {Boolean(item.meetUrl) && (
                  <a href={String(item.meetUrl)} target="_blank" rel="noreferrer" className="text-[#c8ff3d] underline text-[11px]">
                    📹 Google Meet
                  </a>
                )}
              </span>
            </div>
            <div className="admin-row-actions">
              {editable && <button className="admin-button admin-button-quiet" onClick={() => setEditing(item)}>Edit</button>}
              <button className="admin-icon-button is-danger" onClick={() => remove(item._id)} aria-label="Delete"><Trash2 size={15} /></button>
            </div>
          </div>
        ))
      ) : (
        <div className="admin-empty"><span>00</span><h2>No {collection} yet</h2><p>Add the first record to begin this collection.</p></div>
      )}
    </section>

    {editing && <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <div className="admin-modal-head">
          <div><span>SUPABASE RECORD</span><h2>{editing._id ? "Edit" : "Add"} {collection.slice(0, -1)}</h2></div>
          <button className="admin-button admin-button-quiet" onClick={() => setEditing(null)}>Close</button>
        </div>

        <div className="admin-form-grid">
          {fields[collection].map(field => field.kind === "pairs" ? <div className="admin-field admin-field-wide admin-repeater" key={field.key}>
            <div className="admin-repeater-heading">
              <div><span>{field.label}</span><small>Each stat has a short value and a descriptive label.</small></div>
              <button type="button" className="admin-button admin-button-quiet" onClick={() => addPair(field)}><Plus size={13} />Add stat</button>
            </div>
            <div className="admin-repeater-list">
              {toPairs(editing[field.key]).map((pair, index) => <div className="admin-repeater-row" key={`${field.key}-${index}`}>
                <span className="admin-repeater-index">{String(index + 1).padStart(2, "0")}</span>
                <label><span>Value</span><input className="admin-input" value={pair[0]} placeholder="13+" onChange={event => updatePair(field, index, 0, event.target.value)} /></label>
                <label><span>Label</span><input className="admin-input" value={pair[1]} placeholder="Connected workflows" onChange={event => updatePair(field, index, 1, event.target.value)} /></label>
                <button type="button" className="admin-icon-button is-danger" aria-label={`Remove stat ${index + 1}`} onClick={() => removePair(field, index)}><Trash2 size={14} /></button>
              </div>)}
              {!toPairs(editing[field.key]).length && <div className="admin-repeater-empty">No stats added yet.</div>}
            </div>
          </div> : <label className={`admin-field ${field.multiline ? "admin-field-wide" : ""}`} key={field.key}>
            <span>{field.label}</span>
            {field.multiline ? <textarea className="admin-input admin-textarea admin-textarea-tall" value={String(editing[field.key] || "")} onChange={event => setField(field, event.target.value)} /> : <input className="admin-input" type={field.kind === "number" ? "number" : "text"} value={field.kind === "list" ? (editing[field.key] as string[] || []).join(", ") : String(editing[field.key] ?? "")} onChange={event => setField(field, event.target.value)} />}
          </label>)}

          <div className="admin-field">
            <span>Publication Status</span>
            <div className="flex items-center gap-1.5 pt-1">
              {(["draft", "published", "archived"] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setEditing({ ...editing, status: st })}
                  className={`text-xs font-mono uppercase px-3 py-1.5 rounded border transition cursor-pointer ${
                    (editing.status || "published") === st
                      ? "bg-[#182617] text-[#c8ff3d] border-[#c8ff3d] font-bold"
                      : "bg-[#101610] text-[#838e7f] hover:text-white border-white/[0.08]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-field">
            <span>Visibility</span>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setEditing({ ...editing, visible: true })}
                className={`text-xs font-mono px-3 py-1.5 rounded border transition cursor-pointer ${
                  editing.visible !== false
                    ? "bg-[#182617] text-[#c8ff3d] border-[#c8ff3d] font-bold"
                    : "bg-[#101610] text-[#838e7f] hover:text-white border-white/[0.08]"
                }`}
              >
                Visible
              </button>
              <button
                type="button"
                onClick={() => setEditing({ ...editing, visible: false })}
                className={`text-xs font-mono px-3 py-1.5 rounded border transition cursor-pointer ${
                  editing.visible === false
                    ? "bg-[#2d1b1b] text-[#ff8888] border-[#ff555544] font-bold"
                    : "bg-[#101610] text-[#838e7f] hover:text-white border-white/[0.08]"
                }`}
              >
                Hidden
              </button>
            </div>
          </div>
        </div>

        <div className="admin-modal-actions">
          <button className="admin-button" onClick={() => setEditing(null)}>Cancel</button>
          <button className="admin-button admin-button-primary" onClick={save}><Save size={15} />Save record</button>
        </div>
      </div>
    </div>}
  </div>;
}
