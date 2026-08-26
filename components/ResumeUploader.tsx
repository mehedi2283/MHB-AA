"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  FileCheck,
  Sparkles,
  ArrowDownToLine,
  FileCode,
} from "lucide-react";

interface ResumeStatus {
  exists: boolean;
  filename: string | null;
  size: number;
  updatedAt: string | null;
  url: string | null;
  downloadUrl: string | null;
}

export function ResumeUploader() {
  const [status, setStatus] = useState<ResumeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadStatus() {
    try {
      const res = await fetch("/api/admin/resume");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function uploadFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setMsg({ type: "error", text: "Please select a valid PDF file (.pdf)." });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setMsg({ type: "error", text: "File size exceeds 15MB limit." });
      return;
    }

    setUploading(true);
    setMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload resume to Supabase.");

      setMsg({ type: "success", text: "Resume uploaded successfully to Supabase! Live auto-download buttons are now active." });
      await loadStatus();
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to remove the current resume file?")) return;

    setDeleting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/admin/resume", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete resume.");

      setMsg({ type: "success", text: "Resume removed from Supabase." });
      await loadStatus();
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Delete failed." });
    } finally {
      setDeleting(false);
    }
  }

  function formatSize(bytes: number) {
    if (!bytes) return "0 KB";
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  }

  return (
    <section className="admin-panel p-6 border border-[#c8ff3d]/30 bg-[#090d09] rounded space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded bg-[#141f12] border border-[#c8ff3d]/40 grid place-items-center text-[#c8ff3d] shadow-[0_0_15px_rgba(200,255,61,0.15)]">
            <FileText size={20} />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-[#c8ff3d] uppercase flex items-center gap-1.5">
              <span>00 / RESUME SPECIFICATION</span>
              <span className="text-white/20">·</span>
              <span className="text-[#a4ada0]">SUPABASE STORAGE</span>
            </div>
            <h2 className="text-base font-extrabold text-white tracking-wide mt-0.5">
              Resume & CV Auto-Download Manager
            </h2>
            <p className="text-xs text-[#a4ada0] mt-0.5">
              Upload your official PDF resume. Visitors can download it with 1-click from the Hero and Navigation bar.
            </p>
          </div>
        </div>

        {status?.exists ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#111c11] border border-[#c8ff3d]/50 text-[#c8ff3d] text-xs font-mono font-bold shadow-[0_0_12px_rgba(200,255,61,0.12)]">
            <span className="size-2 rounded-full bg-[#c8ff3d] animate-pulse" />
            <span>LIVE & DOWNLOADABLE</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] text-[#a4ada0] text-xs font-mono">
            <span>NO RESUME ATTACHED</span>
          </div>
        )}
      </div>

      {/* Alert Notice */}
      {msg && (
        <div
          className={`p-3.5 rounded text-xs font-mono flex items-center gap-2.5 border ${
            msg.type === "success"
              ? "bg-[#111c11] border-[#c8ff3d]/40 text-[#c8ff3d]"
              : "bg-rose-950/40 border-rose-500/40 text-rose-300"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Main Interactive Grid */}
      <div className="grid lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Side: Current Active File Badge / State */}
        <div className="lg:col-span-7 bg-[#101610] border border-white/[0.08] rounded p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#838e7f] uppercase block">
              Active Portfolio Resume
            </span>

            {status?.exists ? (
              <div className="flex items-center gap-3.5 p-3.5 rounded bg-[#141d14] border border-white/[0.06]">
                <div className="size-11 rounded bg-[#1b291b] border border-[#c8ff3d]/30 grid place-items-center text-[#c8ff3d] shrink-0">
                  <FileCheck size={22} />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="text-sm font-mono font-bold text-white truncate">
                    {status.filename || "Mehedi_Hasan_Resume.pdf"}
                  </div>
                  <div className="text-[11px] font-mono text-[#838e7f] flex flex-wrap items-center gap-2">
                    <span>Size: <strong className="text-white">{formatSize(status.size)}</strong></span>
                    <span>·</span>
                    <span>
                      Updated:{" "}
                      <strong className="text-white">
                        {status.updatedAt ? new Date(status.updatedAt).toLocaleDateString() : "Active"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded bg-white/[0.02] border border-dashed border-white/[0.12] text-center space-y-1.5">
                <p className="text-xs font-mono font-bold text-white">No custom resume uploaded yet.</p>
                <p className="text-[11px] font-mono text-[#838e7f]">
                  Drop your PDF resume on the right to activate instant auto-downloads on your website.
                </p>
              </div>
            )}
          </div>

          {/* Action Row */}
          {status?.exists && (
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <a
                href="/api/resume/download"
                download="Mehedi_Hasan_Resume.pdf"
                className="px-3.5 py-1.5 rounded bg-[#142214] hover:bg-[#1a2e1a] text-[#c8ff3d] hover:text-white border border-[#c8ff3d]/40 hover:border-[#c8ff3d] text-xs font-mono font-bold transition flex items-center gap-2 shadow-[0_0_12px_rgba(200,255,61,0.1)]"
              >
                <Download size={13} />
                <span>Test Live Download</span>
              </a>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 rounded bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 border border-rose-500/20 hover:border-rose-500/40 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {deleting ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={13} />}
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Luxury Dropzone & Upload Button */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`lg:col-span-5 rounded border-2 border-dashed p-6 flex flex-col items-center justify-center text-center gap-3 transition cursor-pointer ${
            dragOver
              ? "border-[#c8ff3d] bg-[#c8ff3d]/10 scale-[1.01]"
              : "border-white/[0.14] hover:border-[#c8ff3d]/50 bg-[#101510]/80 hover:bg-[#141b14]"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="application/pdf,.pdf"
            className="hidden"
          />

          <div className="size-12 rounded-full bg-[#182318] border border-[#c8ff3d]/40 grid place-items-center text-[#c8ff3d] shadow-[0_0_20px_rgba(200,255,61,0.15)]">
            {uploading ? (
              <LoaderCircle size={22} className="animate-spin text-[#c8ff3d]" />
            ) : (
              <Upload size={22} />
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-white block">
              {uploading
                ? "Uploading to Supabase..."
                : status?.exists
                ? "Click or Drag to Replace Resume"
                : "Click or Drag Resume PDF here"}
            </span>
            <span className="text-[10.5px] font-mono text-[#838e7f] block">
              Supports standard .PDF format (Max 15MB)
            </span>
          </div>

          <button
            type="button"
            disabled={uploading}
            className="mt-1 px-4 py-2 rounded bg-[#c8ff3d] hover:bg-[#d8ff60] text-black font-mono font-bold text-xs transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,255,61,0.25)] pointer-events-none"
          >
            <ArrowDownToLine size={13} />
            <span>{status?.exists ? "Choose New PDF" : "Browse Files"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
