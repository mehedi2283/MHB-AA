"use client";

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckSquare, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { PixelLoader } from "./PixelLoader";

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
    .map((entry) => [String(entry[0] ?? ""), String(entry[1] ?? "")]);
}

export function ContentManager({ collection }: { collection: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<{
    type: "single" | "batch";
    id?: string;
    label?: string;
    count?: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const editable = Boolean(fields[collection]);

  async function load() {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/admin/${collection}`);
    const data = await response.json();
    if (response.ok) {
      setItems(data);
    } else {
      setError(data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    setSelectedIds(new Set());
    load();
  }, [collection]);

  async function save() {
    if (!editing) return;
    const exists = editing._id;
    const response = await fetch(
      `/api/admin/${collection}${exists ? `/${editing._id}` : ""}`,
      {
        method: exists ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editing),
      }
    );
    if (response.ok) {
      setEditing(null);
      load();
    } else {
      setError((await response.json()).error);
    }
  }

  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i._id));
  const someSelected = items.some((i) => selectedIds.has(i._id));

  function toggleSelect(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i._id)));
    }
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  async function handleConfirmDelete() {
    if (!confirmDeleteTarget) return;
    setIsDeleting(true);
    setError("");
    try {
      if (confirmDeleteTarget.type === "single" && confirmDeleteTarget.id) {
        const res = await fetch(
          `/api/admin/${collection}/${confirmDeleteTarget.id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Delete failed");
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(confirmDeleteTarget.id!);
          return next;
        });
      } else if (confirmDeleteTarget.type === "batch") {
        const ids = Array.from(selectedIds);
        const res = await fetch(`/api/admin/${collection}`, {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ids }),
        });
        if (!res.ok) throw new Error("Batch delete failed");
        setSelectedIds(new Set());
      }
      setConfirmDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  }

  function setField(field: Field, raw: string) {
    let value: unknown = raw;
    if (field.kind === "list")
      value = raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    if (field.kind === "number") value = Number(raw);
    setEditing((current) => (current ? { ...current, [field.key]: value } : current));
  }

  function updatePair(field: Field, index: number, part: 0 | 1, value: string) {
    setEditing((current) => {
      if (!current) return current;
      const next = toPairs(current[field.key]);
      next[index] = [...next[index]] as [string, string];
      next[index][part] = value;
      return { ...current, [field.key]: next };
    });
  }

  function addPair(field: Field) {
    setEditing((current) =>
      current
        ? {
            ...current,
            [field.key]: [...toPairs(current[field.key]), ["", ""]],
          }
        : current
    );
  }

  function removePair(field: Field, index: number) {
    setEditing((current) =>
      current
        ? {
            ...current,
            [field.key]: toPairs(current[field.key]).filter(
              (_, pairIndex) => pairIndex !== index
            ),
          }
        : current
    );
  }

  return (
    <div className="admin-page space-y-4">
      <header className="admin-page-header">
        <div>
          <div className="admin-kicker">Content / Collection</div>
          <h1 className="capitalize">{collection}</h1>
          <p>{items.length} records stored in Supabase.</p>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              type="button"
              className={`admin-button ${allSelected ? "border-[#c8ff3d] text-[#c8ff3d]" : "admin-button-quiet"}`}
              onClick={toggleSelectAll}
              title={allSelected ? "Deselect All" : "Select All"}
            >
              <CheckSquare size={14} />
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          )}
          {editable && (
            <button
              className="admin-button admin-button-primary"
              onClick={() =>
                setEditing({
                  _id: "",
                  status: "published",
                  visible: true,
                  order: items.length,
                })
              }
            >
              <Plus size={15} />
              Add record
            </button>
          )}
        </div>
      </header>

      {error && <div className="admin-notice">{error}</div>}

      {/* Batch Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            key="batch-action-bar-content"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#151b14] border border-[#c8ff3d55] rounded shadow-lg shadow-black/50 mb-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#c8ff3d20] border border-[#c8ff3d55] text-[#c8ff3d] font-mono text-xs font-bold rounded">
                  <CheckSquare size={13} />
                  {selectedIds.size} {selectedIds.size === 1 ? "record" : "records"} selected
                </span>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-mono text-[#a4ada0] hover:text-white underline underline-offset-4 transition cursor-pointer"
                >
                  {allSelected ? "Deselect all" : `Select all ${items.length}`}
                </button>
                <span className="text-[#3c4a38]">·</span>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs font-mono text-[#a4ada0] hover:text-white transition cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setConfirmDeleteTarget({ type: "batch", count: selectedIds.size })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 border border-rose-500 rounded transition shadow-lg shadow-rose-950/40 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Delete Selected ({selectedIds.size})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="admin-panel admin-collection">
        {loading ? (
          <PixelLoader
            variant="skeleton-table"
            label={`LOADING ${collection.toUpperCase()} RECORDS...`}
          />
        ) : items.length ? (
          items.map((item, index) => {
            const isSelected = selectedIds.has(item._id);
            return (
              <div
                className={`admin-collection-row transition ${
                  isSelected ? "bg-[#182617] border-l-2 border-l-[#c8ff3d]" : ""
                }`}
                key={item._id}
              >
                <div
                  className="flex items-center gap-3 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item._id)}
                    aria-label={`Select item ${index + 1}`}
                    className="w-4 h-4 rounded-[2px] bg-[#111710] border-[#ffffff33] text-[#c8ff3d] accent-[#c8ff3d] cursor-pointer"
                  />
                  <span className="admin-row-index font-mono text-[11px] text-[#5f685c]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="admin-row-main min-w-0">
                  <strong className="text-sm font-semibold text-white block truncate">
                    {String(item.name || item.title || item.email || "Untitled")}
                  </strong>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#a4ada0]">
                    {Boolean(item.email) && (
                      <span className="text-[#c8ff3d] font-mono font-bold">
                        {String(item.email)}
                      </span>
                    )}
                    {Boolean(item.projectType) && <span className="text-[#838e7f]">· {String(item.projectType)}</span>}
                    {Boolean(item.budget) && <span className="text-[#838e7f]">· {String(item.budget)}</span>}
                    {Boolean(item.meetingDate) && (
                      <span className="text-white font-mono bg-[#162215] px-2 py-0.5 rounded-[2px] border border-[#c8ff3d33] text-[11px] inline-flex items-center gap-1">
                        📅 {String(item.meetingDate)} at{" "}
                        {String(item.meetingTime || "11:00 AM")}
                      </span>
                    )}
                    {Boolean(item.meetUrl) && (
                      <a
                        href={String(item.meetUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#c8ff3d] hover:underline text-[11px] font-mono inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#c8ff3d10] border border-[#c8ff3d33]"
                      >
                        📹 Google Meet
                      </a>
                    )}
                  </div>
                </div>
                <div className="admin-row-actions shrink-0 flex items-center gap-2">
                  {editable && (
                    <button
                      className="admin-button admin-button-quiet"
                      onClick={() => setEditing(item)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="admin-icon-button is-danger"
                    onClick={() =>
                      setConfirmDeleteTarget({
                        type: "single",
                        id: item._id,
                        label: String(
                          item.name || item.title || item.email || "Untitled record"
                        ),
                      })
                    }
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="admin-empty">
            <span>00</span>
            <h2>No {collection} yet</h2>
            <p>Add the first record to begin this collection.</p>
          </div>
        )}
      </section>

      {/* Record Edit Modal */}
      {editing && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-head">
              <div>
                <span>SUPABASE RECORD</span>
                <h2>
                  {editing._id ? "Edit" : "Add"} {collection.slice(0, -1)}
                </h2>
              </div>
              <button
                className="admin-button admin-button-quiet"
                onClick={() => setEditing(null)}
              >
                Close
              </button>
            </div>

            <div className="admin-form-grid">
              {fields[collection]?.map((field) =>
                field.kind === "pairs" ? (
                  <div
                    className="admin-field admin-field-wide admin-repeater"
                    key={field.key}
                  >
                    <div className="admin-repeater-heading">
                      <div>
                        <span>{field.label}</span>
                        <small>
                          Each stat has a short value and a descriptive label.
                        </small>
                      </div>
                      <button
                        type="button"
                        className="admin-button admin-button-quiet"
                        onClick={() => addPair(field)}
                      >
                        <Plus size={13} />
                        Add stat
                      </button>
                    </div>
                    <div className="admin-repeater-list">
                      {toPairs(editing[field.key]).map((pair, index) => (
                        <div
                          className="admin-repeater-row"
                          key={`${field.key}-${index}`}
                        >
                          <span className="admin-repeater-index">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <label>
                            <span>Value</span>
                            <input
                              className="admin-input"
                              value={pair[0]}
                              placeholder="13+"
                              onChange={(event) =>
                                updatePair(field, index, 0, event.target.value)
                              }
                            />
                          </label>
                          <label>
                            <span>Label</span>
                            <input
                              className="admin-input"
                              value={pair[1]}
                              placeholder="Connected workflows"
                              onChange={(event) =>
                                updatePair(field, index, 1, event.target.value)
                              }
                            />
                          </label>
                          <button
                            type="button"
                            className="admin-icon-button is-danger"
                            aria-label={`Remove stat ${index + 1}`}
                            onClick={() => removePair(field, index)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {!toPairs(editing[field.key]).length && (
                        <div className="admin-repeater-empty">
                          No stats added yet.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <label
                    className={`admin-field ${field.multiline ? "admin-field-wide" : ""}`}
                    key={field.key}
                  >
                    <span>{field.label}</span>
                    {field.multiline ? (
                      <textarea
                        className="admin-input admin-textarea admin-textarea-tall"
                        value={String(editing[field.key] || "")}
                        onChange={(event) => setField(field, event.target.value)}
                      />
                    ) : (
                      <input
                        className="admin-input"
                        type={field.kind === "number" ? "number" : "text"}
                        value={
                          field.kind === "list"
                            ? (
                                (editing[field.key] as string[]) || []
                              ).join(", ")
                            : String(editing[field.key] ?? "")
                        }
                        onChange={(event) => setField(field, event.target.value)}
                      />
                    )}
                  </label>
                )
              )}

              <div className="admin-field">
                <span>Publication Status</span>
                <div className="flex items-center gap-1.5 pt-1">
                  {(["draft", "published", "archived"] as const).map((st) => (
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
              <button
                className="admin-button"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="admin-button admin-button-primary"
                onClick={save}
              >
                <Save size={15} />
                Save record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Cyber-Tactical Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmDeleteTarget !== null}
        onClose={() => !isDeleting && setConfirmDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={
          confirmDeleteTarget?.type === "batch"
            ? `Delete ${confirmDeleteTarget.count} Records`
            : `Delete ${collection.slice(0, -1)}`
        }
        itemName={
          confirmDeleteTarget?.type === "single"
            ? confirmDeleteTarget.label
            : undefined
        }
        itemCount={
          confirmDeleteTarget?.type === "batch"
            ? confirmDeleteTarget.count
            : undefined
        }
        description={
          confirmDeleteTarget?.type === "batch"
            ? `Are you sure you want to permanently delete all ${confirmDeleteTarget.count} selected ${collection} records from Supabase?`
            : `Are you sure you want to delete this ${collection.slice(0, -1)} record? This action cannot be undone.`
        }
      />
    </div>
  );
}
