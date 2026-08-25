"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight, Bot, BriefcaseBusiness, FileText, Footprints, Globe, Inbox,
  LayoutDashboard, LogOut, Menu, MessagesSquare, PanelsTopLeft, Send, Settings, UserPlus,
  Users, Wrench, X,
} from "lucide-react";

const groups = [
  { label: "Workspace", links: [["/admin", LayoutDashboard, "Overview"], ["/admin/content/site", PanelsTopLeft, "Full website"]] },
  { label: "Collections", links: [["/admin/content/globe", Globe, "3D Globe & Clients"], ["/admin/content/projects", FileText, "Projects"], ["/admin/content/services", BriefcaseBusiness, "Services"], ["/admin/content/technologies", Wrench, "Technology"], ["/admin/content/process", Footprints, "Process"]] },
  { label: "Operations", links: [["/admin/clients", Send, "Clients & Outreach"], ["/admin/conversations", MessagesSquare, "AI Conversations"], ["/admin/leads", Users, "Leads"], ["/admin/inquiries", Inbox, "Inquiries"], ["/admin/ai", Bot, "AI Settings"]] },
  { label: "Access", links: [["/admin/register", UserPlus, "Add admin"], ["/admin/settings", Settings, "Settings"]] },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (path === "/admin/login" || path === "/admin/register") return <>{children}</>;
  const isActive = (href: string) => path === href || (href !== "/admin" && path.startsWith(href));
  const navigation = <>{groups.map(group => <div className="admin-nav-group" key={group.label}>
    <div className="admin-nav-label">{group.label}</div>
    {group.links.map(([href, Icon, label]) => <Link className={`admin-nav-link ${isActive(href) ? "is-active" : ""}`} href={href} key={href} onClick={() => setMenuOpen(false)}>
      <Icon size={15} strokeWidth={1.7} /><span>{label}</span><i aria-hidden="true" />
    </Link>)}
  </div>)}</>;

  return <div className="admin-root">
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand"><span className="admin-brand-mark">M</span><span><strong>MEHEDI</strong><small>CONTROL ROOM</small></span></Link>
      <nav className="admin-navigation">{navigation}</nav>
      <div className="admin-sidebar-foot">
        <a href="/" className="admin-site-link">View portfolio <ArrowUpRight size={13} /></a>
        <div className="admin-system-state"><span />Supabase connected</div>
        <button onClick={logout} className="admin-logout"><LogOut size={14} /> Log out</button>
      </div>
    </aside>
    <header className="admin-mobile-bar">
      <Link href="/admin" className="admin-brand"><span className="admin-brand-mark">M</span><span><strong>MEHEDI</strong><small>CONTROL ROOM</small></span></Link>
      <button className="admin-menu-button" onClick={() => setMenuOpen(value => !value)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
    </header>
    {menuOpen && <nav className="admin-mobile-menu">{navigation}<button onClick={logout} className="admin-logout"><LogOut size={14} /> Log out</button></nav>}
    <main className="admin-main"><div className="admin-main-inner">{children}</div></main>
  </div>;
}
