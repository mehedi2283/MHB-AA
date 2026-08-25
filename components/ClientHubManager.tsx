"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileImage,
  Filter,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  Upload,
  User,
  Wrench,
  X,
  Clock,
  DollarSign,
  Layers,
  ChevronRight,
  RefreshCw,
  Target,
  Calendar,
  FileCheck,
  Zap,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronDown,
  Check,
  Save,
  Globe,
} from "lucide-react";
import { PixelLoader } from "./PixelLoader";

export type ClientRecord = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  stage: "lead" | "contacted" | "audit_scheduled" | "proposal_sent" | "active_client" | "completed";
  dealValue?: string;
  websiteUrl?: string;
  projectName?: string;
  projectDescription?: string;
  techStack?: string[];
  screenshots?: { url: string; caption?: string }[];
  outreachHistory?: { sentAt: string; subject: string; to: string; status: string }[];
  lastContactedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

const STAGES = [
  { key: "lead", label: "Lead", icon: Target, color: "#939b8d", bg: "#151a15", border: "#2f382e" },
  { key: "contacted", label: "Contacted", icon: Mail, color: "#72a4ff", bg: "#0e1826", border: "#1f3350" },
  { key: "audit_scheduled", label: "Audit Scheduled", icon: Calendar, color: "#facc15", bg: "#231f0a", border: "#493e11" },
  { key: "proposal_sent", label: "Proposal Sent", icon: FileCheck, color: "#c084fc", bg: "#1f1228", border: "#442359" },
  { key: "active_client", label: "Active Client", icon: Zap, color: "#c8ff3d", bg: "#141c10", border: "#2a3d21" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "#34d399", bg: "#0c1f16", border: "#16452f" },
] as const;

const POPULAR_STACKS = [
  "n8n",
  "GoHighLevel",
  "OpenAI / LLMs",
  "Make.com",
  "Supabase",
  "Next.js",
  "PostgreSQL",
  "Anthropic / Claude",
  "FastAPI",
  "Python",
  "Stripe",
  "Airtable",
  "Telegram Bot",
  "WhatsApp API",
  "Voice AI / Vapi",
  "LangChain",
];

const OUTREACH_TEMPLATES = [
  {
    id: "automation_pitch",
    name: "⚡ AI Agents & Workflow Automation Pitch",
    subject: "Automating {{company}}'s workflows & operational bottlenecks",
    body: `<p>Hi {{name}},</p>
<p>I came across <strong>{{company}}</strong> and wanted to reach out regarding your systems architecture. I specialize in engineering end-to-end automation pipelines and custom AI agents (using <strong>{{techStack}}</strong>) that eliminate repetitive manual operations and scale client workflows seamlessly.</p>
<p>Recently, I built high-throughput automation infrastructures that connected CRMs, lead routing, dynamic AI data extraction, and real-time client notifications—saving over 20+ hours of team bandwidth every week.</p>
<p>I’d love to share a quick 2-minute Loom demo or walk through where automation could give <strong>{{company}}</strong> an unfair operational advantage.</p>
<p>Would you be open to a brief 15-minute discovery chat this week?</p>`,
  },
  {
    id: "ghl_pipeline",
    name: "🔄 GoHighLevel & CRM Automated Pipeline",
    subject: "Custom GHL + AI Automation Architecture for {{company}}",
    body: `<p>Hi {{name}},</p>
<p>Hope you're having a productive week.</p>
<p>I noticed you’re expanding <strong>{{company}}</strong>'s client pipeline. I design custom automated backbones combining <strong>GoHighLevel</strong>, <strong>n8n</strong>, and <strong>AI decision engines</strong> for instant lead triage, multi-channel booking sequences, and automated client onboarding.</p>
<p>If you're currently dealing with manual lead follow-ups or fragmented webhook connections, I can set up a rock-solid, zero-maintenance pipeline that handles everything on autopilot.</p>
<p>Let me know if you'd like me to review your current architecture or share a few live workflows I've deployed for similar businesses.</p>`,
  },
  {
    id: "complimentary_audit",
    name: "🔍 Complimentary Systems & Workflow Audit",
    subject: "Complimentary Automation Audit for {{projectName}}",
    body: `<p>Hi {{name}},</p>
<p>I'm reaching out because I saw what you're building with <strong>{{projectName}}</strong> at <strong>{{company}}</strong>.</p>
<p>I’m offering a complimentary 15-minute Systems & Automation Audit where I map out your key bottlenecks across <strong>{{techStack}}</strong> and deliver a 1-page blueprint outlining where AI agents and custom webhooks can speed up execution by 3x–5x.</p>
<p>No strings attached—just actionable architecture recommendations tailored specifically to your roadmap.</p>
<p>Would you be interested in taking a look?</p>`,
  },
  {
    id: "saas_mvp",
    name: "🚀 Custom Full-Stack SaaS / AI MVP Build",
    subject: "Accelerating {{projectName}} MVP Architecture",
    body: `<p>Hi {{name}},</p>
<p>I build production-grade AI applications and SaaS platforms powered by <strong>{{techStack}}</strong>.</p>
<p>Whether you need a rapid, scalable prototype or a resilient backend with auth, payments, vector embeddings, and real-time database sync, I can build and deploy the entire system in weeks rather than months.</p>
<p>Let’s connect on a brief call to go over your specifications for <strong>{{projectName}}</strong>.</p>`,
  },
  {
    id: "custom",
    name: "✍️ Blank / Custom Pitch",
    subject: "Regarding {{projectName}} & AI Automation",
    body: `<p>Hi {{name}},</p>
<p>I'd love to connect regarding <strong>{{company}}</strong> and discuss potential collaboration on <strong>{{projectName}}</strong>.</p>
<p>Best regards,<br>Mehedi</p>`,
  },
];

function CustomSortDropdown({
  value,
  onChange,
}: {
  value: "newest" | "oldest" | "name_asc" | "deal_high";
  onChange: (val: "newest" | "oldest" | "name_asc" | "deal_high") => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { key: "newest" | "oldest" | "name_asc" | "deal_high"; label: string }[] = [
    { key: "newest", label: "Newest Added" },
    { key: "oldest", label: "Oldest Added" },
    { key: "deal_high", label: "Highest Value" },
    { key: "name_asc", label: "Name (A-Z)" },
  ];

  const currentOption = options.find(o => o.key === value) || options[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#121812] hover:bg-[#182218] border border-white/[0.12] hover:border-[#c8ff3d44] text-xs font-mono text-white px-3 py-2 rounded transition select-none cursor-pointer"
      >
        <ArrowUpDown size={13} className="text-[#838e7f]" />
        <span>{currentOption.label}</span>
        <ChevronDown size={13} className={`text-[#838e7f] transition-transform duration-200 ${open ? "rotate-180 text-[#c8ff3d]" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-[#0d140d] border border-white/[0.15] rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[9px] font-mono text-[#838e7f] uppercase tracking-wider px-2 py-1 border-b border-white/[0.06] mb-1">
            SORT PIPELINE
          </div>
          {options.map(opt => {
            const isSelected = opt.key === value;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono transition text-left ${
                  isSelected
                    ? "bg-[#1f2e1d] text-[#c8ff3d] font-bold"
                    : "text-[#a4ada0] hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={13} className="text-[#c8ff3d]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CustomStageDropdown({
  currentStage,
  onChange,
}: {
  currentStage: ClientRecord["stage"];
  onChange: (newStage: ClientRecord["stage"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentConfig = STAGES.find(s => s.key === currentStage) || STAGES[0];
  const CurrentIcon = currentConfig.icon;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          color: currentConfig.color,
          backgroundColor: currentConfig.bg,
          borderColor: currentConfig.border,
        }}
        className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded border hover:brightness-125 transition cursor-pointer"
      >
        <CurrentIcon size={12} />
        <span>{currentConfig.label}</span>
        <ChevronDown size={11} className={`opacity-60 transition-transform ${open ? "rotate-180 opacity-100" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-48 bg-[#0d140d] border border-white/[0.15] rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[9px] font-mono text-[#838e7f] uppercase tracking-wider px-2 py-1 border-b border-white/[0.06] mb-1">
            MOVE STAGE
          </div>
          {STAGES.map(s => {
            const isSelected = s.key === currentStage;
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  onChange(s.key);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono transition text-left ${
                  isSelected
                    ? "bg-[#1f2e1d] text-[#c8ff3d] font-bold"
                    : "text-[#a4ada0] hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={13} style={{ color: s.color }} />
                  <span>{s.label}</span>
                </div>
                {isSelected && <Check size={12} className="text-[#c8ff3d]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ClientHubManager() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name_asc" | "deal_high">("newest");
  const [editingClient, setEditingClient] = useState<Partial<ClientRecord> | null>(null);
  const [outreachTarget, setOutreachTarget] = useState<ClientRecord | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSavingClient, setIsSavingClient] = useState(false);

  // Outreach state
  const [selectedTemplate, setSelectedTemplate] = useState(OUTREACH_TEMPLATES[0].id);
  const [outreachSubject, setOutreachSubject] = useState("");
  const [outreachBody, setOutreachBody] = useState("");
  const [isSendingOutreach, setIsSendingOutreach] = useState(false);
  const [activeOutreachTab, setActiveOutreachTab] = useState<"edit" | "preview">("edit");

  // File upload state for screenshots
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newScreenshotUrl, setNewScreenshotUrl] = useState("");
  const [newScreenshotCaption, setNewScreenshotCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients");
      if (!res.ok) throw new Error("Failed to load clients");
      const data = await res.json();
      setClients(data);
    } catch (err: any) {
      setNotice({ type: "error", message: err.message || "Could not fetch clients from Supabase." });
    } finally {
      setLoading(false);
    }
  }

  // Quick stats calculation
  const totalClients = clients.length;
  const totalOutreachSent = clients.reduce((acc, c) => acc + (c.outreachHistory?.length || 0), 0);
  const activeClientsCount = clients.filter(c => c.stage === "active_client").length;
  const leadsCount = clients.filter(c => c.stage === "lead" || c.stage === "contacted").length;

  // Filter and sort clients
  const filteredClients = [...clients]
    .filter(client => {
      const matchesStage = selectedStage === "all" || client.stage === selectedStage;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStage;

      const matchesSearch =
        client.name?.toLowerCase().includes(q) ||
        client.company?.toLowerCase().includes(q) ||
        client.email?.toLowerCase().includes(q) ||
        client.phone?.toLowerCase().includes(q) ||
        client.projectName?.toLowerCase().includes(q) ||
        client.projectDescription?.toLowerCase().includes(q) ||
        client.techStack?.some(t => t.toLowerCase().includes(q));

      return matchesStage && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name_asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortBy === "deal_high") {
        const valA = parseFloat((a.dealValue || "").replace(/[^0-9.]/g, "")) || 0;
        const valB = parseFloat((b.dealValue || "").replace(/[^0-9.]/g, "")) || 0;
        return valB - valA;
      }
      // default: newest
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  // Open outreach modal pre-filled
  function handleOpenOutreach(client: ClientRecord) {
    setOutreachTarget(client);
    applyTemplate(OUTREACH_TEMPLATES[0].id, client);
    setActiveOutreachTab("edit");
  }

  function applyTemplate(templateId: string, client: ClientRecord) {
    setSelectedTemplate(templateId);
    const tmpl = OUTREACH_TEMPLATES.find(t => t.id === templateId) || OUTREACH_TEMPLATES[0];
    const techStr = client.techStack && client.techStack.length > 0 ? client.techStack.join(", ") : "n8n, AI Agents & GoHighLevel";

    const subjectParsed = tmpl.subject
      .replace(/\{\{name\}\}/g, client.name || "there")
      .replace(/\{\{company\}\}/g, client.company || "your business")
      .replace(/\{\{projectName\}\}/g, client.projectName || "your project")
      .replace(/\{\{techStack\}\}/g, techStr);

    const bodyParsed = tmpl.body
      .replace(/\{\{name\}\}/g, client.name || "there")
      .replace(/\{\{company\}\}/g, client.company || "your company")
      .replace(/\{\{projectName\}\}/g, client.projectName || "your project")
      .replace(/\{\{techStack\}\}/g, techStr);

    setOutreachSubject(subjectParsed);
    setOutreachBody(bodyParsed);
  }

  async function handleSendOutreach() {
    if (!outreachTarget || !outreachTarget.email) {
      setNotice({ type: "error", message: "Client does not have a valid email address." });
      return;
    }

    setIsSendingOutreach(true);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/outreach/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientId: outreachTarget._id,
          to: outreachTarget.email,
          clientName: outreachTarget.name,
          company: outreachTarget.company,
          projectName: outreachTarget.projectName,
          techStack: outreachTarget.techStack,
          subject: outreachSubject,
          customBodyHtml: outreachBody,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email.");

      setNotice({ type: "success", message: `⚡ Cold outreach successfully sent to ${outreachTarget.email}!` });
      setOutreachTarget(null);
      await loadClients();
    } catch (err: any) {
      setNotice({ type: "error", message: err.message || "Error sending cold email." });
    } finally {
      setIsSendingOutreach(false);
    }
  }

  // Handle client saving (create or update)
  async function handleSaveClient(e: React.FormEvent) {
    e.preventDefault();
    if (!editingClient) return;

    setIsSavingClient(true);
    try {
      const isNew = !editingClient._id;
      const url = isNew ? "/api/admin/clients" : `/api/admin/clients/${editingClient._id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editingClient),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save client.");
      }
      setNotice({ type: "success", message: isNew ? "✓ New client created successfully!" : "✓ Client record updated successfully!" });
      setEditingClient(null);
      await loadClients();
    } catch (err: any) {
      setNotice({ type: "error", message: err.message || "Failed to save client." });
    } finally {
      setIsSavingClient(false);
    }
  }

  async function handleDeleteClient(id: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete client record "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete client.");
      setNotice({ type: "success", message: `Client "${name}" removed.` });
      await loadClients();
    } catch (err: any) {
      setNotice({ type: "error", message: err.message || "Failed to delete client." });
    }
  }

  async function handleQuickStageChange(client: ClientRecord, newStage: ClientRecord["stage"]) {
    try {
      await fetch(`/api/admin/clients/${client._id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...client, stage: newStage }),
      });
      await loadClients();
    } catch {
      setNotice({ type: "error", message: "Failed to update pipeline stage." });
    }
  }

  // Screenshot upload to Supabase Storage
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editingClient) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const existingScreenshots = editingClient.screenshots || [];
      setEditingClient({
        ...editingClient,
        screenshots: [...existingScreenshots, { url: data.url, caption: file.name }],
      });
    } catch (err: any) {
      setNotice({ type: "error", message: err.message || "Image upload failed." });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleAddManualScreenshot() {
    if (!newScreenshotUrl.trim() || !editingClient) return;
    const existingScreenshots = editingClient.screenshots || [];
    setEditingClient({
      ...editingClient,
      screenshots: [...existingScreenshots, { url: newScreenshotUrl.trim(), caption: newScreenshotCaption.trim() }],
    });
    setNewScreenshotUrl("");
    setNewScreenshotCaption("");
  }

  function handleRemoveScreenshot(index: number) {
    if (!editingClient) return;
    const existing = [...(editingClient.screenshots || [])];
    existing.splice(index, 1);
    setEditingClient({ ...editingClient, screenshots: existing });
  }

  function toggleTechStack(tech: string) {
    if (!editingClient) return;
    const current = editingClient.techStack || [];
    if (current.includes(tech)) {
      setEditingClient({ ...editingClient, techStack: current.filter(t => t !== tech) });
    } else {
      setEditingClient({ ...editingClient, techStack: [...current, tech] });
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div
          className={`p-3.5 rounded border font-mono text-xs flex items-center justify-between animate-in fade-in duration-200 ${
            notice.type === "success"
              ? "bg-[#141e12] border-[#c8ff3d] text-[#c8ff3d]"
              : "bg-[#251212] border-[#ff5555] text-[#ff8888]"
          }`}
        >
          <span>{notice.message}</span>
          <button onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100 p-1">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#c8ff3d] uppercase tracking-widest">
            <Layers size={14} />
            <span>OPERATIONS / CRM</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-white mt-1 uppercase tracking-wider flex items-center gap-3">
            CLIENT HUB & COLD OUTREACH
          </h1>
          <p className="text-xs text-[#a4ada0] mt-1 font-mono">
            Manage your high-ticket client pipeline, store project stacks & deliverables, and dispatch direct Gmail cold outreach.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadClients}
            className="admin-button admin-button-quiet text-xs py-2 px-3 flex items-center gap-1.5"
            title="Refresh database"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Sync</span>
          </button>

          <button
            onClick={() =>
              setEditingClient({
                name: "",
                email: "",
                phone: "",
                company: "",
                stage: "lead",
                dealValue: "$3,000",
                projectName: "",
                projectDescription: "",
                techStack: ["n8n", "GoHighLevel", "OpenAI / LLMs"],
                screenshots: [],
              })
            }
            className="admin-button admin-button-primary text-xs py-2 px-4 flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Add Client / Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0b100b] border border-white/[0.08] p-4 rounded">
          <div className="text-[10px] font-mono text-[#838e7f] uppercase tracking-wider">Total Clients & Leads</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{totalClients}</div>
        </div>
        <div className="bg-[#0b100b] border border-white/[0.08] p-4 rounded">
          <div className="text-[10px] font-mono text-[#838e7f] uppercase tracking-wider">Active In-Flight</div>
          <div className="text-2xl font-bold font-mono text-[#c8ff3d] mt-1">{activeClientsCount}</div>
        </div>
        <div className="bg-[#0b100b] border border-white/[0.08] p-4 rounded">
          <div className="text-[10px] font-mono text-[#838e7f] uppercase tracking-wider">Pipeline Leads</div>
          <div className="text-2xl font-bold font-mono text-[#72a4ff] mt-1">{leadsCount}</div>
        </div>
        <div className="bg-[#0b100b] border border-white/[0.08] p-4 rounded">
          <div className="text-[10px] font-mono text-[#838e7f] uppercase tracking-wider">Outreach Sent</div>
          <div className="text-2xl font-bold font-mono text-[#facc15] mt-1 flex items-center gap-1.5">
            <Send size={16} />
            <span>{totalOutreachSent}</span>
          </div>
        </div>
      </div>

      {/* 1. Interactive Pipeline Stage Navigation Tabs */}
      <div className="bg-[#0b100b] border border-white/[0.08] p-2.5 rounded">
        <div className="flex flex-wrap items-center gap-2 w-full">
          <button
            onClick={() => setSelectedStage("all")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedStage === "all"
                ? "bg-[#c8ff3d] text-black shadow-[0_0_20px_rgba(200,255,61,0.25)] scale-[1.02]"
                : "bg-[#141b14] text-[#a4ada0] hover:text-white hover:bg-[#1a241a] border border-white/[0.06]"
            }`}
          >
            <Layers size={14} />
            <span>ALL CLIENTS</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                selectedStage === "all" ? "bg-black/20 text-black font-bold" : "bg-white/[0.08] text-white/80"
              }`}
            >
              {clients.length}
            </span>
          </button>

          {STAGES.map(st => {
            const count = clients.filter(c => c.stage === st.key).length;
            const isSelected = selectedStage === st.key;
            const Icon = st.icon;

            return (
              <button
                key={st.key}
                onClick={() => setSelectedStage(st.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-[#192418] text-[#c8ff3d] border border-[#c8ff3d] shadow-[0_0_15px_rgba(200,255,61,0.2)] font-bold scale-[1.02]"
                    : "bg-[#141b14] text-[#a4ada0] hover:text-white hover:bg-[#1a241a] border border-white/[0.06]"
                }`}
              >
                <Icon size={14} style={{ color: isSelected ? "#c8ff3d" : st.color }} />
                <span>{st.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    isSelected ? "bg-[#c8ff3d]/20 text-[#c8ff3d] font-bold" : "bg-white/[0.08] text-white/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Unified Search, Sort & View Control Toolbar */}
      <div className="bg-[#0b100b] border border-white/[0.08] p-3.5 rounded flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search with Clear Button */}
        <div className="relative w-full md:max-w-md flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#838e7f]" />
          <input
            type="text"
            placeholder="Search by client, company, tech stack (e.g. n8n), email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#121812] border border-white/[0.12] focus:border-[#c8ff3d] rounded pl-10 pr-9 py-2 text-xs text-white placeholder:text-[#5f685c] focus:outline-none font-mono transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#838e7f] hover:text-white p-1"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Right Action Tools: Filter Reset, Sort & View Mode Switcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Active Filter Counter / Reset */}
          {(searchQuery || selectedStage !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStage("all");
              }}
              className="text-[11px] font-mono text-[#ff8888] hover:text-[#ffaaaa] flex items-center gap-1 bg-[#281313] px-2.5 py-1.5 rounded border border-[#ff555544] transition cursor-pointer"
            >
              <X size={12} />
              <span>Reset Filters</span>
            </button>
          )}

          {/* Custom Sort Dropdown */}
          <CustomSortDropdown value={sortBy} onChange={setSortBy} />

          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center bg-[#121812] border border-white/[0.1] rounded p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition cursor-pointer ${
                viewMode === "grid" ? "bg-[#c8ff3d] text-black font-bold" : "text-[#838e7f] hover:text-white"
              }`}
              title="Grid Card View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition cursor-pointer ${
                viewMode === "list" ? "bg-[#c8ff3d] text-black font-bold" : "text-[#838e7f] hover:text-white"
              }`}
              title="Compact Table View"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Client Data View (Grid or List Table) */}
      {loading ? (
        <PixelLoader variant="skeleton-cards" label="QUERYING CLIENT HUB IN SUPABASE..." />
      ) : filteredClients.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-white/[0.08] rounded bg-[#090d09]">
          <div className="size-14 rounded bg-[#141b14] border border-[#c8ff3d33] grid place-items-center mx-auto text-[#c8ff3d]">
            <Building2 size={26} />
          </div>
          <h3 className="text-sm font-bold font-mono text-white mt-4 uppercase tracking-wider">
            No Client Records Found
          </h3>
          <p className="text-xs text-[#838e7f] mt-1 max-w-sm mx-auto font-mono">
            {searchQuery || selectedStage !== "all"
              ? "No clients match your filter criteria."
              : "Add your first client to track project architecture, deliverables, and send cold emails."}
          </p>
          <button
            onClick={() =>
              setEditingClient({
                name: "",
                email: "",
                phone: "",
                company: "",
                stage: "lead",
                dealValue: "$3,000",
                projectName: "",
                projectDescription: "",
                techStack: ["n8n", "GoHighLevel", "OpenAI / LLMs"],
                screenshots: [],
              })
            }
            className="admin-button admin-button-primary text-xs py-2 px-4 mt-5 inline-flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Create First Client</span>
          </button>
        </div>
      ) : viewMode === "list" ? (
        /* COMPACT CRM TABLE VIEW */
        <div className="bg-[#0b100b] border border-white/[0.08] rounded overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0e140e] text-[#838e7f] text-[10px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Client & Company</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Deal Value</th>
                  <th className="py-3.5 px-4">Project & Tech Stack</th>
                  <th className="py-3.5 px-4">Outreach</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredClients.map(client => {
                  const stageConfig = STAGES.find(s => s.key === client.stage) || STAGES[0];
                  const hasOutreach = client.outreachHistory && client.outreachHistory.length > 0;

                  return (
                    <tr key={client._id} className="hover:bg-[#121912] transition-colors">
                      {/* Client Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{client.name}</div>
                        <div className="text-xs text-[#a4ada0] flex items-center gap-2 mt-0.5">
                          {client.company && <span>{client.company}</span>}
                          {client.email && (
                            <a href={`mailto:${client.email}`} className="text-[#72a4ff] hover:underline">
                              {client.email}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Stage Dropdown */}
                      <td className="py-3.5 px-4">
                        <CustomStageDropdown
                          currentStage={client.stage}
                          onChange={newStage => handleQuickStageChange(client, newStage)}
                        />
                      </td>

                      {/* Deal Value */}
                      <td className="py-3.5 px-4 text-[#facc15] font-bold">
                        {client.dealValue || "—"}
                      </td>

                      {/* Project & Tech Stack */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-white font-medium truncate">
                          {client.projectName || "Custom Automation"}
                        </div>
                        {client.techStack && client.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {client.techStack.slice(0, 3).map((tech, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.5 bg-[#172216] text-[#c8ff3d] rounded">
                                {tech}
                              </span>
                            ))}
                            {client.techStack.length > 3 && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-white/70 rounded">
                                +{client.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Outreach Status */}
                      <td className="py-3.5 px-4">
                        {hasOutreach ? (
                          <span className="text-[#c8ff3d] text-[11px] flex items-center gap-1 font-bold">
                            <Send size={11} />
                            <span>{client.outreachHistory?.length} sent</span>
                          </span>
                        ) : (
                          <span className="text-[#5f685c] text-[11px]">None</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenOutreach(client)}
                            className="text-[11px] font-mono font-bold bg-[#1a2517] hover:bg-[#c8ff3d] text-[#c8ff3d] hover:text-black border border-[#c8ff3d] px-2.5 py-1 rounded transition flex items-center gap-1"
                          >
                            <Send size={11} />
                            <span>Cold Email</span>
                          </button>
                          <button
                            onClick={() => setEditingClient(client)}
                            className="admin-button admin-button-quiet text-[11px] py-1 px-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client._id, client.name)}
                            className="admin-icon-button is-danger p-1"
                            title="Delete client"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredClients.map(client => {
            const stageConfig = STAGES.find(s => s.key === client.stage) || STAGES[0];
            const hasOutreach = client.outreachHistory && client.outreachHistory.length > 0;

            return (
              <div
                key={client._id}
                className="bg-[#0b100b] border border-white/[0.08] hover:border-[#c8ff3d44] transition-all rounded p-5 flex flex-col justify-between space-y-4 relative group shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                {/* Card Top: Client Info & Stage Dropdown */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold font-mono text-white hover:text-[#c8ff3d] transition">
                          {client.name}
                        </h2>
                        {client.company && (
                          <span className="text-xs text-[#a4ada0] font-mono bg-[#141b14] px-2 py-0.5 rounded border border-white/[0.06]">
                            {client.company}
                          </span>
                        )}
                      </div>

                      {/* Contact Channels */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-[#838e7f]">
                        {client.email && (
                          <a
                            href={`mailto:${client.email}`}
                            className="flex items-center gap-1 hover:text-[#c8ff3d] transition text-[11px]"
                          >
                            <Mail size={12} className="text-[#c8ff3d]" />
                            <span>{client.email}</span>
                          </a>
                        )}
                        {client.phone && (
                          <a
                            href={`tel:${client.phone}`}
                            className="flex items-center gap-1 hover:text-[#c8ff3d] transition text-[11px]"
                          >
                            <Phone size={12} className="text-[#72a4ff]" />
                            <span>{client.phone}</span>
                          </a>
                        )}
                        {client.dealValue && (
                          <span className="flex items-center gap-0.5 text-[#facc15] font-bold text-[11px]">
                            <DollarSign size={12} />
                            <span>{client.dealValue}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Custom Pipeline Stage Select Dropdown */}
                    <CustomStageDropdown
                      currentStage={client.stage}
                      onChange={newStage => handleQuickStageChange(client, newStage)}
                    />
                  </div>

                  {/* Project Details Box */}
                  <div className="bg-[#101610] border border-white/[0.06] rounded p-3.5 mt-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                        <Wrench size={13} className="text-[#c8ff3d]" />
                        <span>{client.projectName || "Custom Automation Project"}</span>
                      </div>
                      {client.websiteUrl && (
                        <a
                          href={client.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-[#c8ff3d] hover:underline flex items-center gap-1"
                        >
                          <span>Live Site</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>

                    {client.projectDescription && (
                      <p className="text-xs text-[#a4ada0] font-mono line-clamp-2 leading-relaxed">
                        {client.projectDescription}
                      </p>
                    )}

                    {/* Tech Stack Badges */}
                    {client.techStack && client.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {client.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 bg-[#172216] border border-[#2b3d29] text-[#c8ff3d] rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Screenshots Thumbnail Gallery */}
                  {client.screenshots && client.screenshots.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[10px] font-mono text-[#838e7f] mb-1.5 flex items-center gap-1">
                        <FileImage size={12} />
                        <span>DELIVERABLES / SCREENSHOTS ({client.screenshots.length}):</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {client.screenshots.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPreviewImage(s.url)}
                            className="relative size-14 rounded overflow-hidden border border-white/[0.12] hover:border-[#c8ff3d] transition group/img flex-shrink-0 bg-black cursor-pointer"
                            title={s.caption || `Screenshot ${idx + 1}`}
                          >
                            <img src={s.url} alt={s.caption || "Screenshot"} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                              <Eye size={14} className="text-[#c8ff3d]" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between gap-2">
                  <div className="text-[10px] font-mono text-[#838e7f] flex items-center gap-1">
                    <Clock size={11} />
                    <span>
                      {hasOutreach
                        ? `Outreach: ${client.outreachHistory?.length} sent`
                        : "No outreach sent yet"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenOutreach(client)}
                      className="text-xs font-mono font-bold bg-[#1a2517] hover:bg-[#c8ff3d] text-[#c8ff3d] hover:text-black border border-[#c8ff3d] px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,255,61,0.15)] cursor-pointer"
                    >
                      <Send size={12} />
                      <span>Cold Email</span>
                    </button>

                    <button
                      onClick={() => setEditingClient(client)}
                      className="admin-button admin-button-quiet text-xs py-1.5 px-2.5"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteClient(client._id, client.name)}
                      className="admin-icon-button is-danger p-1.5"
                      title="Delete client"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODALS & POPUPS */}

      {/* ADD / EDIT CLIENT & PROJECT BLUEPRINT MODAL */}
      {editingClient && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-4xl max-h-[92vh] bg-[#0a0e0a] border border-[#c8ff3d]/30 rounded shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(200,255,61,0.06)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0d130d] border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded bg-[#c8ff3d18] border border-[#c8ff3d44] text-[#c8ff3d] grid place-items-center flex-shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#c8ff3d] uppercase">
                      SUPABASE CRM SPECIFICATION
                    </span>
                    <span className="size-1.5 rounded-full bg-[#c8ff3d] animate-pulse" />
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                    {editingClient._id ? `Edit Client: ${editingClient.name}` : "Create New Client Profile"}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="size-8 rounded bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#838e7f] hover:text-white grid place-items-center transition cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleSaveClient} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-none">
                {/* 01: Client & Contact Identifiers */}
                <div className="bg-[#0f150f] border border-white/[0.06] rounded p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#c8ff3d]" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        01 · Client & Contact Information
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#838e7f]">* Required fields</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                        Client Full Name <span className="text-[#c8ff3d]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingClient.name || ""}
                        onChange={e => setEditingClient({ ...editingClient, name: e.target.value })}
                        placeholder="e.g. Vance Miller"
                        className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                        Email Address <span className="text-[#c8ff3d]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={editingClient.email || ""}
                        onChange={e => setEditingClient({ ...editingClient, email: e.target.value })}
                        placeholder="e.g. vance@vancecold.com"
                        className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={editingClient.phone || ""}
                        onChange={e => setEditingClient({ ...editingClient, phone: e.target.value })}
                        placeholder="e.g. +1 (415) 890-1234"
                        className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={editingClient.company || ""}
                        onChange={e => setEditingClient({ ...editingClient, company: e.target.value })}
                        placeholder="e.g. Vance Logistics LLC"
                        className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* 02: Commercials & Pipeline Stage */}
                <div className="bg-[#0f150f] border border-white/[0.06] rounded p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-[#facc15]" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        02 · Commercials & Pipeline Status
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                        Pipeline Stage
                      </label>
                      <div className="pt-0.5">
                        <CustomStageDropdown
                          currentStage={editingClient.stage || "lead"}
                          onChange={newStage => setEditingClient({ ...editingClient, stage: newStage })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                        Deal Value / Retainer Budget
                      </label>
                      <input
                        type="text"
                        value={editingClient.dealValue || ""}
                        onChange={e => setEditingClient({ ...editingClient, dealValue: e.target.value })}
                        placeholder="e.g. $4,500 / $1,500/mo"
                        className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* 03: Project Scope & Architecture */}
                <div className="bg-[#0f150f] border border-white/[0.06] rounded p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Wrench size={14} className="text-[#c8ff3d]" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        03 · Project Scope & Technical Blueprint
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                        Project Name / Automation Title
                      </label>
                      <input
                        type="text"
                        value={editingClient.projectName || ""}
                        onChange={e => setEditingClient({ ...editingClient, projectName: e.target.value })}
                        placeholder="e.g. Cold Email AI Engine & CRM Sync"
                        className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                        Website / Prototype / Portal URL
                      </label>
                      <input
                        type="url"
                        value={editingClient.websiteUrl || ""}
                        onChange={e => setEditingClient({ ...editingClient, websiteUrl: e.target.value })}
                        placeholder="https://clientbrand.com"
                        className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                      Project Description & Client Brief
                    </label>
                    <textarea
                      rows={3}
                      value={editingClient.projectDescription || ""}
                      onChange={e => setEditingClient({ ...editingClient, projectDescription: e.target.value })}
                      placeholder="Describe workflow architecture, automated triggers, endpoints, integrations, deliverables..."
                      className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans leading-relaxed resize-y"
                    />
                  </div>

                  {/* Tech Stack Chips Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-mono font-semibold text-[#a4ada0]">
                        Tech Stack & Tool Ecosystem
                      </label>
                      <span className="text-[10px] font-mono text-[#838e7f]">
                        {(editingClient.techStack || []).length} selected
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_STACKS.map(tech => {
                        const active = (editingClient.techStack || []).includes(tech);
                        return (
                          <button
                            type="button"
                            key={tech}
                            onClick={() => toggleTechStack(tech)}
                            className={`text-[11px] font-mono px-2.5 py-1 rounded transition border cursor-pointer flex items-center gap-1.5 ${
                              active
                                ? "bg-[#c8ff3d1c] border-[#c8ff3d] text-[#c8ff3d] font-bold shadow-[0_0_12px_rgba(200,255,61,0.15)]"
                                : "bg-[#0b0f0b] text-[#838e7f] border-white/[0.08] hover:border-white/25 hover:text-white"
                            }`}
                          >
                            <span className={`text-[10px] ${active ? "text-[#c8ff3d]" : "text-[#556052]"}`}>
                              {active ? "✓" : "+"}
                            </span>
                            <span>{tech}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 04: Deliverable Screenshots & Media */}
                <div className="bg-[#0f150f] border border-white/[0.06] rounded p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-2">
                      <FileImage size={14} className="text-[#c8ff3d]" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        04 · Deliverable Screenshots & Media Assets
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#838e7f]">
                      {(editingClient.screenshots || []).length} attached
                    </span>
                  </div>

                  {/* Uploaders */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* File Upload Button */}
                    <div className="sm:col-span-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full min-h-[42px] px-4 py-2.5 bg-[#141e14] hover:bg-[#1a281a] border border-[#c8ff3d44] hover:border-[#c8ff3d] text-[#c8ff3d] rounded text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(200,255,61,0.08)]"
                      >
                        {uploadingImage ? (
                          <PixelLoader label="UPLOADING..." />
                        ) : (
                          <>
                            <Upload size={14} />
                            <span>Upload to Storage</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Direct URL Input */}
                    <div className="sm:col-span-8 flex gap-2">
                      <input
                        type="url"
                        value={newScreenshotUrl}
                        onChange={e => setNewScreenshotUrl(e.target.value)}
                        placeholder="Or paste direct image URL (https://...)"
                        className="flex-1 bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3 py-2 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                      />
                      <input
                        type="text"
                        value={newScreenshotCaption}
                        onChange={e => setNewScreenshotCaption(e.target.value)}
                        placeholder="Caption"
                        className="w-28 bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3 py-2 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                      />
                      <button
                        type="button"
                        onClick={handleAddManualScreenshot}
                        className="px-3.5 py-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white rounded text-xs font-mono font-bold transition cursor-pointer whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Thumbnails Grid */}
                  {editingClient.screenshots && editingClient.screenshots.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {editingClient.screenshots.map((s, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded overflow-hidden border border-white/[0.12] hover:border-[#c8ff3d] transition bg-[#080c08] flex flex-col"
                        >
                          <div className="relative w-full h-24 bg-black/50">
                            <img src={s.url} alt={s.caption || ""} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                              <button
                                type="button"
                                onClick={() => setPreviewImage(s.url)}
                                className="size-7 rounded bg-[#c8ff3d] text-black grid place-items-center hover:scale-110 transition cursor-pointer"
                                title="View Full Size"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveScreenshot(idx)}
                                className="size-7 rounded bg-red-600 text-white grid place-items-center hover:scale-110 transition cursor-pointer"
                                title="Delete Image"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          {s.caption && (
                            <div className="p-1.5 text-[10px] font-mono text-[#838e7f] truncate bg-[#0d120d] border-t border-white/[0.06]">
                              {s.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#0d130d] border-t border-white/[0.08] flex items-center justify-between flex-shrink-0">
                <div className="text-[11px] font-mono text-[#838e7f] flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#c8ff3d] animate-ping" />
                  <span>Realtime database sync on save</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingClient(null)}
                    className="px-4 py-2 rounded text-xs font-mono text-[#838e7f] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingClient}
                    className="px-5 py-2 rounded text-xs font-mono font-bold bg-[#c8ff3d] hover:bg-[#d8ff60] text-black transition flex items-center gap-2 shadow-[0_0_20px_rgba(200,255,61,0.25)] cursor-pointer disabled:opacity-50"
                  >
                    {isSavingClient ? (
                      <PixelLoader label="SAVING..." />
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Save to Database</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COLD OUTREACH EMAIL COMPOSER MODAL */}
      {outreachTarget && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-3xl max-h-[92vh] bg-[#0a0e0a] border border-[#c8ff3d]/30 rounded shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(200,255,61,0.06)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0d130d] border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded bg-[#c8ff3d18] border border-[#c8ff3d44] text-[#c8ff3d] grid place-items-center flex-shrink-0">
                  <Send size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#c8ff3d] uppercase">
                      GMAIL OUTREACH ENGINE
                    </span>
                    <span className="size-1.5 rounded-full bg-[#c8ff3d] animate-pulse" />
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                    Cold Pitch to: <span className="text-[#c8ff3d]">{outreachTarget.name}</span>
                    {outreachTarget.company && <span className="text-[#838e7f] font-normal"> ({outreachTarget.company})</span>}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOutreachTarget(null)}
                className="size-8 rounded bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#838e7f] hover:text-white grid place-items-center transition cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-none">
              {/* Template Picker */}
              <div>
                <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-2">
                  Select Proven Cold Pitch Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OUTREACH_TEMPLATES.map(tmpl => (
                    <button
                      type="button"
                      key={tmpl.id}
                      onClick={() => applyTemplate(tmpl.id, outreachTarget)}
                      className={`p-3 rounded border text-left transition font-mono cursor-pointer ${
                        selectedTemplate === tmpl.id
                          ? "bg-[#1b2618] border-[#c8ff3d] text-white shadow-[0_0_15px_rgba(200,255,61,0.2)]"
                          : "bg-[#0f140f] border-white/[0.08] text-[#838e7f] hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{tmpl.name}</span>
                        {selectedTemplate === tmpl.id && <Check size={13} className="text-[#c8ff3d]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabs: Edit vs Live Email Preview */}
              <div className="flex border-b border-white/[0.08] gap-4">
                <button
                  type="button"
                  onClick={() => setActiveOutreachTab("edit")}
                  className={`pb-2.5 text-xs font-bold font-mono transition border-b-2 cursor-pointer ${
                    activeOutreachTab === "edit"
                      ? "border-[#c8ff3d] text-[#c8ff3d]"
                      : "border-transparent text-[#838e7f] hover:text-white"
                  }`}
                >
                  1. Compose & Edit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOutreachTab("preview")}
                  className={`pb-2.5 text-xs font-bold font-mono transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    activeOutreachTab === "preview"
                      ? "border-[#c8ff3d] text-[#c8ff3d]"
                      : "border-transparent text-[#838e7f] hover:text-white"
                  }`}
                >
                  <Eye size={13} />
                  <span>2. Branded Preview</span>
                </button>
              </div>

              {activeOutreachTab === "edit" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      required
                      value={outreachSubject}
                      onChange={e => setOutreachSubject(e.target.value)}
                      className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-[#a4ada0] mb-1.5">
                      Email Message Body (HTML supported)
                    </label>
                    <textarea
                      rows={10}
                      value={outreachBody}
                      onChange={e => setOutreachBody(e.target.value)}
                      className="w-full bg-[#080c08] border border-white/[0.12] focus:border-[#c8ff3d] rounded px-3.5 py-2.5 text-xs text-white placeholder:text-[#505a4e] outline-none transition font-mono leading-relaxed resize-y"
                    />
                  </div>
                </div>
              ) : (
                /* Live Preview Container */
                <div className="bg-[#070907] border border-[#233020] rounded p-5 text-white max-h-96 overflow-y-auto scrollbar-none">
                  <div className="border-b border-[#1a2419] pb-3 mb-4 text-xs font-mono text-[#838e7f] space-y-1">
                    <div>To: <span className="text-[#c8ff3d]">{outreachTarget.email}</span></div>
                    <div>Subject: <span className="text-white font-bold">{outreachSubject}</span></div>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: outreachBody }}
                    className="text-xs space-y-3 text-[#d0dad0] leading-relaxed"
                  />
                  {outreachTarget.techStack && outreachTarget.techStack.length > 0 && (
                    <div className="mt-4 p-3 bg-[#0d120d] border border-[#233020] rounded">
                      <div className="text-[10px] font-mono text-[#c8ff3d] mb-1 font-bold">FEATURED STACK:</div>
                      <div className="flex flex-wrap gap-1">
                        {outreachTarget.techStack.map((t, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-[#141c14] border border-[#293826] text-[#c8ff3d] rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-5 text-center">
                    <span className="inline-block bg-[#c8ff3d] text-black font-bold font-mono px-4 py-2 rounded text-xs">
                      ⚡ SCHEDULE A 15-MIN DISCOVERY CALL →
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Outreach Modal Footer */}
            <div className="px-6 py-4 bg-[#0d130d] border-t border-white/[0.08] flex items-center justify-between flex-shrink-0">
              <div className="text-[11px] font-mono text-[#838e7f]">
                Sends directly from your connected Gmail address via Google OAuth.
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded text-xs font-mono text-[#838e7f] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                  onClick={() => setOutreachTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSendingOutreach}
                  onClick={handleSendOutreach}
                  className="px-5 py-2 rounded text-xs font-mono font-bold bg-[#c8ff3d] hover:bg-[#d8ff60] text-black transition flex items-center gap-2 shadow-[0_0_20px_rgba(200,255,61,0.25)] cursor-pointer disabled:opacity-50"
                >
                  {isSendingOutreach ? (
                    <PixelLoader label="DISPATCHING EMAIL..." />
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send Cold Outreach</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[9999999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] p-2 bg-[#0c120c] border border-[#c8ff3d] rounded shadow-[0_0_50px_rgba(200,255,61,0.3)]">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded border border-white/20 hover:border-[#c8ff3d] transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
