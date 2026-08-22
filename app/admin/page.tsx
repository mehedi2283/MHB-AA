/* eslint-disable @next/next/no-html-link-for-pages */
import { listDocuments } from "@/lib/supabase-data";
import {
  Activity,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  Eye,
  Inbox,
  MessageSquare,
  Users,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  let stats = [0, 0, 0, 0, 0, 0];
  let recentInquiries: Record<string, unknown>[] = [];
  let recentConversations: Record<string, unknown>[] = [];

  try {
    const [inquiries, leads, conversations, analytics, projects, posts] = await Promise.all([
      "inquiries",
      "leads",
      "aiConversations",
      "analyticsEvents",
      "projects",
      "posts",
    ].map(listDocuments));

    stats = [
      inquiries.length,
      leads.filter((item) => item.leadStatus === "qualified").length,
      conversations.length,
      analytics.filter((item) => item.event === "booking_click").length,
      projects.filter((item) => item.status === "published").length,
      posts.filter((item) => item.status === "published").length,
    ];

    recentInquiries = inquiries.slice(0, 5);
    recentConversations = conversations.slice(0, 5);
  } catch {}

  const cards = [
    ["Total inquiries", stats[0], Inbox, "/admin/inquiries"],
    ["Qualified leads", stats[1], Users, "/admin/leads"],
    ["AI conversations", stats[2], Bot, "/admin/conversations"],
    ["Booking clicks", stats[3], Activity, "/admin"],
    ["Published projects", stats[4], BriefcaseBusiness, "/admin/content/projects"],
    ["Published posts", stats[5], Eye, "/admin"],
  ] as const;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <div className="admin-kicker">Workspace / Overview</div>
          <h1>Good to see you, Mehedi.</h1>
          <p>A quiet view of the portfolio, content and incoming opportunities.</p>
        </div>
        <a href="/" className="admin-button">
          Open portfolio <ArrowUpRight size={14} />
        </a>
      </header>

      {/* KPI Metric Cards */}
      <div className="admin-metric-grid">
        {cards.map(([label, value, Icon, href], index) => (
          <Link href={href} className="admin-metric group no-underline" key={label}>
            <div className="admin-metric-top">
              <span>0{index + 1}</span>
              <Icon size={16} strokeWidth={1.5} className="group-hover:text-[#c8ff3d] transition" />
            </div>
            <strong>{value}</strong>
            <p>{label}</p>
          </Link>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="admin-overview-grid">
        {/* Recent Inquiries Table */}
        <section className="admin-panel admin-table-panel">
          <div className="admin-panel-heading">
            <div>
              <span>RECENT ACTIVITY</span>
              <h2>Inquiries</h2>
            </div>
            <Link href="/admin/inquiries">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Project</th>
                  <th>Budget</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.length ? (
                  recentInquiries.map((r, i) => (
                    <tr key={i}>
                      <td>{String(r.name || "")}</td>
                      <td>{String(r.projectType || "")}</td>
                      <td>{String(r.budget || "")}</td>
                      <td>
                        <span className="admin-status">{String(r.submissionStatus || "new")}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="admin-empty-cell">
                      Nothing waiting for review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Health */}
        <aside className="admin-panel admin-health">
          <div className="admin-panel-heading">
            <div>
              <span>SYSTEM</span>
              <h2>Health</h2>
            </div>
            <i />
          </div>
          <dl>
            <div>
              <dt>Database</dt>
              <dd>Connected</dd>
            </div>
            <div>
              <dt>CMS documents</dt>
              <dd>{stats[4]} live projects</dd>
            </div>
            <div>
              <dt>AI Logged Users</dt>
              <dd>{stats[2]} user sessions</dd>
            </div>
          </dl>
          <p>Supabase is online and the public API is locked behind the server.</p>
        </aside>
      </div>

      {/* Dedicated AI Conversations by User Table on Dashboard */}
      <section className="admin-panel admin-table-panel mt-6">
        <div className="admin-panel-heading">
          <div>
            <span>LIVE AI LOGS</span>
            <h2>AI Conversations by User</h2>
          </div>
          <Link href="/admin/conversations" className="text-[#c8ff3d] hover:underline flex items-center gap-1 text-xs">
            Open full AI logs <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Visitor</th>
                <th>Latest User Question</th>
                <th>Turns</th>
                <th>Model</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {recentConversations.length ? (
                recentConversations.map((c, i) => {
                  const msgs = (c.messages as Record<string, unknown>[]) || [];
                  const lastUser =
                    String(c.lastUserMessage || "") ||
                    String([...msgs].reverse().find((m) => m?.role === "user")?.content || "") ||
                    "Session initialized";
                  const turns = Number(c.turnCount || msgs.length || 0);
                  const dateStr = String(c.lastActiveAt || c.updatedAt || c.createdAt || "");

                  return (
                    <tr key={i}>
                      <td>
                        <span className="font-bold text-[#ffffff]">
                          {String(c.userLabel || `Visitor #${String(c.sessionId || c._id || "").slice(0, 6)}`)}
                        </span>
                      </td>
                      <td className="max-w-md truncate text-[#a4ada0]">
                        <span className="text-[#c8ff3d] mr-1">↳</span>
                        {lastUser}
                      </td>
                      <td>
                        <span className="text-[#c8ff3d] font-mono font-bold text-xs">{turns} turns</span>
                      </td>
                      <td className="font-mono text-xs text-[#a4ada0]">{String(c.model || "Gemini")}</td>
                      <td className="font-mono text-xs text-[#717b6d]">
                        {dateStr ? new Date(dateStr).toLocaleString() : "Recent"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="admin-empty-cell">
                    No AI conversations logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
