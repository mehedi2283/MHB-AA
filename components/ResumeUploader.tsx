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
  ExternalLink,
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

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setMsg({ type: "error", text: "Please select a valid PDF file (.pdf)." });
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
      if (!res.ok) throw new Error(data.error || "Failed to upload resume.");

      setMsg({ type: "success", text: "Resume uploaded successfully! Website download button is now live." });
      await loadStatus();
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to remove the current resume file?")) return;

    setDeleting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/admin/resume", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete resume.");

      setMsg({ type: "success", text: "Resume removed." });
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
    <div className="bg-[#0b100b] border border-white/[0.08] rounded p-6 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded bg-[#141e14] border border-[#c8ff3d]/30 grid place-items-center text-[#c8ff3d]">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              Resume & CV Management
              <span className="text-[10px] bg-[#141f12] text-[#c8ff3d] px-2 py-0.5 rounded border border-[#c8ff3d]/30">
                Auto-Download
              </span>
            </h2>
            <p className="text-[11px] font-mono text-[#838e7f]">
              Upload your PDF resume. Visitors can download it with 1-click across the Hero and Navigation bar.
            </p>
          </div>
        </div>

        {status?.exists && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#121c12] border border-[#c8ff3d]/40 text-[#c8ff3d] text-[11px] font-mono font-bold">
            <span className="size-2 rounded-full bg-[#c8ff3d] animate-pulse" />
            <span>Active on Website</span>
          </div>
        )}
      </div>

      {/* Alert Notification */}
      {msg && (
        <div
          className={`p-3.5 rounded text-xs font-mono flex items-center gap-2.5 border ${
            msg.type === "success"
              ? "bg-[#101b10] border-[#c8ff3d]/40 text-[#c8ff3d]"
              : "bg-rose-950/40 border-rose-500/40 text-rose-300"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Current File Status / Upload Area */}
      <div className="grid md:grid-cols-12 gap-5 items-center">
        {status?.exists ? (
          <div className="md:col-span-8 bg-[#101610] border border-white/[0.08] rounded p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded bg-[#182418] border border-[#c8ff3d]/30 grid place-items-center text-[#c8ff3d] shrink-0">
                <FileCheck size={20} />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-xs font-mono font-bold text-white truncate">
                  {status.filename || "Mehedi_Hasan_Resume.pdf"}
                </p>
                <p className="text-[10.5px] font-mono text-[#838e7f]">
                  Size: <span className="text-[#a4ada0]">{formatSize(status.size)}</span> · Updated:{" "}
                  <span className="text-[#a4ada0]">
                    {status.updatedAt ? new Date(status.updatedAt).toLocaleDateString() : "Recently"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/api/resume/download"
                download="Mehedi_Hasan_Resume.pdf"
                className="px-3 py-1.5 rounded bg-[#142014] hover:bg-[#1a2b1a] text-[#c8ff3d] border border-[#c8ff3d]/40 hover:border-[#c8ff3d] text-xs font-mono font-bold transition flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Test Download</span>
              </a>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 rounded hover:bg-rose-950/40 text-[#838e7f] hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
                title="Remove Resume"
              >
                {deleting ? <LoaderCircle size={14} className="animate-spin text-rose-400" /> : <Trash2 size={14} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="md:col-span-8 bg-[#101610] border border-dashed border-white/[0.14] rounded p-5 text-center space-y-2">
            <p className="text-xs font-mono font-semibold text-[#a4ada0]">
              No resume uploaded yet.
            </p>
            <p className="text-[11px] font-mono text-[#5f685c]">
              Upload your PDF file below to activate the instant download button on your live portfolio.
            </p>
          </div>
        )}

        {/* Upload Button */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="application/pdf,.pdf"
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded bg-[#c8ff3d] hover:bg-[#d8ff60] text-black font-mono font-bold text-xs transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,255,61,0.2)] cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                <span>Uploading PDF...</span>
              </>
            ) : (
              <>
                <Upload size={15} />
                <span>{status?.exists ? "Replace Resume (PDF)" : "Upload Resume (PDF)"}</span>
              </>
            )}
          </button>
          <span className="text-[10px] font-mono text-center text-[#5f685c]">
            Max file size: 15MB (.pdf format)
          </span>
        </div>
      </div>
    </div>
  );
}
