"use client";

import React, { useEffect, useState } from "react";
import {
  Bot,
  Calendar,
  ChevronRight,
  Eye,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { PixelBot, PixelChat, PixelCheck } from "./PixelIcons";
import { PixelLoader } from "./PixelLoader";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  async function deleteConversation(id: string) {
    if (!confirm("Are you sure you want to delete this conversation log?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/aiConversations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c._id !== id));
        if (selectedChat?._id === id) setSelectedChat(null);
      }
    } catch (err) {
      alert("Failed to delete conversation");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = conversations.filter((c) => {
    const query = search.toLowerCase();
    const label = (c.userLabel || c.sessionId || "").toLowerCase();
    const lastMsg = (c.lastUserMessage || "").toLowerCase();
    const model = (c.model || "").toLowerCase();
    const provider = (c.provider || "").toLowerCase();
    return label.includes(query) || lastMsg.includes(query) || model.includes(query) || provider.includes(query);
  });

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

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4ada0]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, query, model…"
              className="pl-8 pr-3 py-1.5 text-xs bg-[#111710] border border-[#ffffff18] rounded focus:border-[#c8ff3d] outline-none text-[#e8eee2] w-56"
            />
          </div>
          <button
            onClick={loadConversations}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#a4ada0] hover:text-[#ffffff] bg-[#111710] border border-[#ffffff18] rounded hover:border-[#c8ff3d] transition"
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

      {/* Main Table */}
      <div className="border border-[#ffffff18] bg-[#0d110d] rounded overflow-hidden">
        {loading ? (
          <PixelLoader label="RETRIEVING AI CONVERSATIONS FROM SUPABASE..." />
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

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-[#141b14] transition cursor-pointer group"
                      onClick={() => setSelectedChat(item)}
                    >
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

                      <td className="py-3 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedChat(item)}
                            className="p-1.5 hover:bg-[#ffffff15] rounded text-[#c8ff3d] transition"
                            title="Inspect Conversation"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => deleteConversation(item._id)}
                            disabled={deletingId === item._id}
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
      {selectedChat && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-end bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl h-full max-h-[90vh] bg-[#0b0e0b] border border-[#c8ff3d44] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Modal Header */}
            <header className="p-4 border-b border-[#ffffff15] bg-[#0f140f] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#c8ff3d20] border border-[#c8ff3d55] flex items-center justify-center text-[#c8ff3d]">
                  <PixelBot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#ffffff]">
                    {selectedChat.userLabel || `Visitor #${(selectedChat.sessionId || selectedChat._id).slice(0, 6)}`}
                  </h3>
                  <p className="text-[10px] font-mono text-[#a4ada0]">
                    Session: {selectedChat.sessionId || selectedChat._id} · Model: {selectedChat.model || "Gemini"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChat(null)}
                className="p-1.5 text-[#a4ada0] hover:text-[#ffffff] hover:bg-[#ffffff15] rounded transition"
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
                        · {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                onClick={() => deleteConversation(selectedChat._id)}
                className="px-3 py-1.5 bg-rose-950/50 border border-rose-800 text-rose-300 hover:bg-rose-900 rounded font-bold transition flex items-center gap-1.5"
              >
                <Trash2 size={12} />
                Delete Log
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
