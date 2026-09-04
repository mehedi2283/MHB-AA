"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckSquare,
  Eye,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { PixelBot, PixelChat } from "./PixelIcons";
import { SkeletonTable } from "./SkeletonLoader";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

type ConversationDoc = {
  _id: string;
  sessionId?: string;
  userLabel?: string;
  messages?: ChatMessage[];
  turnCount?: number;
  lastUserMessage?: string;
  lastAssistantMessage?: string;
  provider?: string;
  model?: string;
  ip?: string;
  startedAt?: string;
  lastActiveAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function AIConversationsViewer() {
  const [conversations, setConversations] = useState<ConversationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<ConversationDoc | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<{
    type: "single" | "batch";
    id?: string;
    label?: string;
    count?: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function loadConversations() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/aiConversations");
      if (!res.ok) throw new Error("Failed to load conversations");
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading conversations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  const filtered = conversations.filter((c) => {
    const query = search.toLowerCase();
    const label = (c.userLabel || c.sessionId || "").toLowerCase();
    const lastMsg = (c.lastUserMessage || "").toLowerCase();
    const model = (c.model || "").toLowerCase();
    const provider = (c.provider || "").toLowerCase();
    return (
      label.includes(query) ||
      lastMsg.includes(query) ||
      model.includes(query) ||
      provider.includes(query)
    );
  });

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((item) => selectedIds.has(item._id));
  const someFilteredSelected = filtered.some((item) => selectedIds.has(item._id));

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
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((item) => next.delete(item._id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((item) => next.add(item._id));
        return next;
      });
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
        const id = confirmDeleteTarget.id;
        const res = await fetch(`/api/admin/aiConversations/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete conversation");
        setConversations((prev) => prev.filter((c) => c._id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        if (selectedChat?._id === id) setSelectedChat(null);
      } else if (confirmDeleteTarget.type === "batch") {
        const idsArray = Array.from(selectedIds);
        const res = await fetch("/api/admin/aiConversations", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: idsArray }),
        });
        if (!res.ok) throw new Error("Failed to batch delete conversations");
        const idSet = new Set(idsArray);
        setConversations((prev) => prev.filter((c) => !idSet.has(c._id)));
        if (selectedChat && idSet.has(selectedChat._id)) setSelectedChat(null);
        clearSelection();
      }
      setConfirmDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="admin-kicker">AI TELEMETRY / USER LOGS</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white flex items-center gap-3 mt-1">
            <PixelChat size={28} className="text-[#c8ff3d]" />
            AI Conversations by User
          </h1>
          <p className="text-sm text-[#a4ada0] mt-2 leading-relaxed">
            Browse real-time conversations, user queries, and AI answers grouped per visitor session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4ada0]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, query, model…"
              className="pl-8 pr-3 py-1.5 text-xs bg-[#111710] border border-[#ffffff18] rounded focus:border-[#c8ff3d] outline-none text-[#e8eee2] w-48 sm:w-56"
            />
          </div>

          <button
            type="button"
            onClick={toggleSelectAll}
            disabled={filtered.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border transition cursor-pointer disabled:opacity-40 ${
              allFilteredSelected
                ? "bg-[#182617] text-[#c8ff3d] border-[#c8ff3d]"
                : "text-[#a4ada0] hover:text-white bg-[#111710] border-[#ffffff18] hover:border-[#c8ff3d]"
            }`}
            title={allFilteredSelected ? "Deselect all records" : "Select all records"}
          >
            <CheckSquare size={13} />
            <span className="hidden sm:inline">
              {allFilteredSelected ? "Deselect All" : "Select All"}
            </span>
            <span className="sm:hidden">{allFilteredSelected ? "Deselect" : "Select"}</span>
          </button>

          <button
            onClick={loadConversations}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#a4ada0] hover:text-[#ffffff] bg-[#111710] border border-[#ffffff18] rounded hover:border-[#c8ff3d] transition cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 border border-[#ffffff15] bg-[#0d110d] rounded">
          <span className="text-[10px] text-[#a4ada0] font-bold block tracking-wider">TOTAL SESSIONS</span>
          <strong className="text-lg text-[#ffffff] font-mono">{conversations.length}</strong>
        </div>
        <div className="p-3 border border-[#ffffff15] bg-[#0d110d] rounded">
          <span className="text-[10px] text-[#a4ada0] font-bold block tracking-wider">TOTAL TURNS</span>
          <strong className="text-lg text-[#c8ff3d] font-mono">
            {conversations.reduce((acc, c) => acc + (c.messages?.length || c.turnCount || 0), 0)}
          </strong>
        </div>
        <div className="p-3 border border-[#ffffff15] bg-[#0d110d] rounded">
          <span className="text-[10px] text-[#a4ada0] font-bold block tracking-wider">ENGAGED USERS</span>
          <strong className="text-lg text-[#ffffff] font-mono">
            {conversations.filter((c) => (c.messages?.length || 0) > 2).length}
          </strong>
        </div>
        <div className="p-3 border border-[#ffffff15] bg-[#0d110d] rounded">
          <span className="text-[10px] text-[#a4ada0] font-bold block tracking-wider">PRIMARY ENGINE</span>
          <strong className="text-xs text-[#c8ff3d] font-mono block mt-1">Google Gemini</strong>
        </div>
      </div>

      {/* Batch Action Bar (smooth accordion height, slide & fade animation) */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            key="batch-action-bar-container"
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
                  {selectedIds.size} {selectedIds.size === 1 ? "log" : "logs"} selected
                </span>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-mono text-[#a4ada0] hover:text-white underline underline-offset-4 transition cursor-pointer"
                >
                  {allFilteredSelected
                    ? "Deselect all filtered"
                    : `Select all ${filtered.length} filtered`}
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

      {/* Main Table */}
      <div className="border border-[#ffffff18] bg-[#0d110d] rounded overflow-hidden">
        {loading ? (
          <div className="p-4">
            <SkeletonTable rows={6} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 text-xs font-mono">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[#a4ada0] text-xs font-mono">
            No AI conversations found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#ffffff15] bg-[#111710] text-[#a4ada0] font-mono text-[10px] tracking-wider uppercase">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
                      }}
                      onChange={toggleSelectAll}
                      aria-label="Select all conversations"
                      className="w-4 h-4 rounded bg-[#111710] border-[#ffffff33] text-[#c8ff3d] accent-[#c8ff3d] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">User / Session</th>
                  <th className="py-3 px-4">Latest Question</th>
                  <th className="py-3 px-4">Turns</th>
                  <th className="py-3 px-4">Model & Provider</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffffff0d]">
                {filtered.map((item) => {
                  const msgs = item.messages || [];
                  const lastUser =
                    item.lastUserMessage ||
                    [...msgs].reverse().find((m) => m.role === "user")?.content ||
                    "Session initialized";
                  const turns = msgs.length || item.turnCount || 0;
                  const dateStr = item.lastActiveAt || item.updatedAt || item.createdAt || "";
                  const isSelected = selectedIds.has(item._id);

                  return (
                    <tr
                      key={item._id}
                      className={`transition cursor-pointer group ${
                        isSelected
                          ? "bg-[#182617] border-l-2 border-l-[#c8ff3d]"
                          : "hover:bg-[#141b14]"
                      }`}
                      onClick={() => setSelectedChat(item)}
                    >
                      <td
                        className="py-3 px-3 w-10 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item._id)}
                          aria-label={`Select ${item.userLabel || item.sessionId}`}
                          className="w-4 h-4 rounded bg-[#111710] border-[#ffffff33] text-[#c8ff3d] accent-[#c8ff3d] cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#c8ff3d1a] border border-[#c8ff3d33] flex items-center justify-center text-[#c8ff3d]">
                            <User size={12} />
                          </div>
                          <div>
                            <span className="font-bold text-[#ffffff] block">
                              {item.userLabel || `Visitor #${(item.sessionId || item._id).slice(0, 6)}`}
                            </span>
                            <span className="text-[9px] font-mono text-[#a4ada0]">
                              {item.sessionId?.slice(0, 14)}…
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate text-[#e8eee2]">
                        <span className="text-[#a4ada0] font-mono mr-1.5">↳</span>
                        {lastUser}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[#c8ff3d]">
                        <span className="px-2 py-0.5 bg-[#c8ff3d15] border border-[#c8ff3d33] rounded text-[10px]">
                          {turns} {turns === 1 ? "turn" : "turns"}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-[#a4ada0] font-mono text-[10px]">
                        <span className="text-[#ffffff] font-bold">{item.model || "gemini-2.5-flash"}</span>
                        <span className="block text-[9px] text-[#717b6d]">
                          {item.provider || "google"}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[10px] text-[#a4ada0]">
                        {dateStr ? new Date(dateStr).toLocaleString() : "Recent"}
                      </td>

                      <td
                        className="py-3 px-4 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedChat(item)}
                            className="p-1.5 hover:bg-[#ffffff15] rounded text-[#c8ff3d] transition"
                            title="Inspect Conversation"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDeleteTarget({
                                type: "single",
                                id: item._id,
                                label:
                                  item.userLabel ||
                                  `Visitor #${(item.sessionId || item._id).slice(0, 6)}`,
                              })
                            }
                            className="p-1.5 hover:bg-rose-950/40 rounded text-rose-400 transition"
                            title="Delete Conversation"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Conversation Modal Drawer */}
      <AnimatePresence>
        {selectedChat && (
          <motion.div
            key="inspect-chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999990] flex items-center justify-end bg-black/70 backdrop-blur-sm p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedChat(null);
            }}
          >
            <motion.div
              key="inspect-chat-drawer"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-full max-w-xl h-full max-h-[90vh] bg-[#0b0e0b] border border-[#c8ff3d44] rounded shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <header className="p-4 border-b border-[#ffffff15] bg-[#0f140f] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#c8ff3d20] border border-[#c8ff3d55] flex items-center justify-center text-[#c8ff3d]">
                    <PixelBot size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#ffffff]">
                      {selectedChat.userLabel ||
                        `Visitor #${(selectedChat.sessionId || selectedChat._id).slice(0, 6)}`}
                    </h3>
                    <p className="text-[10px] font-mono text-[#a4ada0]">
                      Session: {selectedChat.sessionId || selectedChat._id} · Model:{" "}
                      {selectedChat.model || "Gemini"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChat(null)}
                  className="p-1.5 text-[#a4ada0] hover:text-[#ffffff] hover:bg-[#ffffff15] rounded transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </header>

              {/* Modal Messages List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#080a08]">
                {(selectedChat.messages || []).map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[9px] font-mono font-bold text-[#a4ada0] uppercase">
                        {msg.role === "user" ? "User / Visitor" : "AI Assistant"}
                      </span>
                      {msg.timestamp && (
                        <span className="text-[8px] font-mono text-[#5f685c]">
                          ·{" "}
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] p-3.5 rounded text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#162215] border border-[#c8ff3d44] text-[#c8ff3d] font-mono"
                          : "bg-[#111711] border border-[#ffffff15] text-[#e8eee2]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <footer className="p-3 border-t border-[#ffffff15] bg-[#0f140f] flex items-center justify-between text-xs text-[#a4ada0]">
                <span className="font-mono text-[10px]">
                  {(selectedChat.messages || []).length} total messages recorded
                </span>
                <button
                  onClick={() =>
                    setConfirmDeleteTarget({
                      type: "single",
                      id: selectedChat._id,
                      label:
                        selectedChat.userLabel ||
                        `Visitor #${(selectedChat.sessionId || selectedChat._id).slice(0, 6)}`,
                    })
                  }
                  className="px-3 py-1.5 bg-rose-950/50 border border-rose-800 text-rose-300 hover:bg-rose-900 rounded font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={12} />
                  Delete Log
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dedicated Cyber-Tactical Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmDeleteTarget !== null}
        onClose={() => !isDeleting && setConfirmDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={
          confirmDeleteTarget?.type === "batch"
            ? `Delete ${confirmDeleteTarget.count} Conversations`
            : "Delete Conversation Log"
        }
        itemName={
          confirmDeleteTarget?.type === "single" ? confirmDeleteTarget.label : undefined
        }
        itemCount={
          confirmDeleteTarget?.type === "batch" ? confirmDeleteTarget.count : undefined
        }
        description={
          confirmDeleteTarget?.type === "batch"
            ? `Are you sure you want to permanently delete all ${confirmDeleteTarget.count} selected conversation transcripts and session data?`
            : "Are you sure you want to permanently delete this conversation transcript and all recorded user messages?"
        }
      />
    </div>
  );
}
