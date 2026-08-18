import { supabaseConfigured, supabaseAdmin } from "@/lib/supabase";
import { listDocuments } from "@/lib/supabase-data";
import { processSteps, projects, services, technologies, workflowNodes } from "@/lib/content";

export type ServiceItem = { title: string; description: string; tools: string[]; order: number; visible: boolean };
export type ProjectItem = (typeof projects)[number] & { order?: number; visible?: boolean; problem?: string; solution?: string; nodes?: string[]; capabilities?: string[]; implementation?: string; stats?: [string,string][] };
export type WorkflowItem = { name: string; desc: string; tools: string; benefit: string };
export type SiteContent = {
  hero: { kicker: string; availability: string; title: string; accentTitle: string; description: string; primaryCta: string; secondaryCta: string; location: string; specialties: string };
  about: { eyebrow: string; heading: string; intro: string; profileHeading: string; profileBody: string; signature: string; quote: string; principle: string };
  projects: { eyebrow: string; heading: string; intro: string };
  playground: { label: string; heading: string; accentHeading: string; description: string };
  capabilities: { eyebrow: string; heading: string; note: string };
  technology: { eyebrow: string; heading: string; intro: string };
  process: { eyebrow: string; heading: string; intro: string; cta: string };
  contact: { kicker: string; heading: string; intro: string; privacy: string };
  footer: { identity: string; copyright: string };
  metrics: { value: string; label: string }[];
  workflowNodes: WorkflowItem[];
};

export const defaultSiteContent: SiteContent = {
  hero: { kicker: "MEHEDI / AI AUTOMATION DEVELOPER", availability: "AVAILABLE", title: "Systems that run.", accentTitle: "Work that flows.", description: "I design AI agents, automation workflows and digital products that turn fragmented operations into reliable systems your business can actually use.", primaryCta: "Explore selected work", secondaryCta: "Test the workflow", location: "BASED IN BANGLADESH · AVAILABLE WORLDWIDE", specialties: "AI AGENTS · AUTOMATION · SAAS" },
  about: { eyebrow: "01 / IDENTITY", heading: "Not an agency.\nOne builder, end to end.", intro: "I translate business friction into systems that are useful, observable and maintainable—from the first architecture sketch to production deployment.", profileHeading: "From workflow builder\nto systems architect.", profileBody: "Over 2+ years I’ve moved from connecting individual tools to designing coordinated AI agents, customer lifecycle engines and client-facing platforms.", signature: "MEHEDI × INDEPENDENT BUILDER", quote: "The best automation feels less like software—and more like the business finally breathing.", principle: "MY BUILDING PRINCIPLE" },
  projects: { eyebrow: "02 / SELECTED WORK", heading: "Systems I’ve\nput into motion.", intro: "Three projects. Three different operating models. Each one designed around the real business—not a generic template." },
  playground: { label: "LIVE PLAYGROUND", heading: "Open the system.", accentHeading: "Trace the logic.", description: "Click through a lead-to-booking workflow to see how I connect tools, intelligence and outcomes." },
  capabilities: { eyebrow: "03 / CAPABILITIES", heading: "What I can\nbuild with you.", note: "Available for freelance, contract\nand selected full-time roles." },
  technology: { eyebrow: "04 / TOOL SIGNAL", heading: "Technology is\na design decision.", intro: "I choose tools for reliability, fit and ownership—not because they happen to be trending." },
  process: { eyebrow: "05 / EXECUTION", heading: "How ideas become dependable systems.", intro: "Clear stages, visible decisions, fewer surprises.", cta: "Bring me a messy process" },
  contact: { kicker: "READY FOR A NEW SYSTEM", heading: "Let’s remove the work\nthat shouldn’t be manual.", intro: "Project, contract, collaboration or role—tell me what is slowing the business down. I’ll personally review it.", privacy: "Your details stay private and are only used to reply." },
  footer: { identity: "MEHEDI · AI AUTOMATION DEVELOPER", copyright: "MEHEDI / AI" },
  metrics: [{ value: "50+", label: "workflows engineered" }, { value: "20+", label: "projects delivered" }, { value: "15+", label: "platforms connected" }, { value: "08", label: "agents in one ecosystem" }],
  workflowNodes: workflowNodes.map(item => ({ ...item })),
};

function deepMerge<T>(base: T, patch: Partial<T>): T {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return (patch ?? base) as T;
  const output = { ...(base as object) } as Record<string, unknown>;
  for (const [key, value] of Object.entries(patch)) output[key] = value && typeof value === "object" && !Array.isArray(value) ? deepMerge(output[key], value) : value;
  return output as T;
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!supabaseConfigured()) return defaultSiteContent;
  try { const { data, error } = await supabaseAdmin().from("site_content").select("content").eq("id", "main").maybeSingle(); if (error) throw error; return data?.content ? deepMerge(defaultSiteContent, data.content as Partial<SiteContent>) : defaultSiteContent; }
  catch { return defaultSiteContent; }
}

export async function getPublicCollections(): Promise<{ projects: ProjectItem[]; services: ServiceItem[]; technologies: string[]; processSteps: string[] }> {
  if (!supabaseConfigured()) return { projects: projects.map((item, order) => ({ ...item, order, visible: true })), services: services.map(([title, description, tools], order) => ({ title, description, tools: [...tools], order, visible: true })), technologies: [...technologies], processSteps: [...processSteps] };
  try {
    const [projectRows, serviceRows, techRows, processRows] = await Promise.all(["projects", "services", "technologies", "process"].map(listDocuments));
    const visible = <T extends Record<string, unknown>>(rows: Record<string, unknown>[]) => rows.filter(item => item.visible !== false && item.status !== "draft") as T[];
    const cmsProjects = visible<ProjectItem>(projectRows);
    const cmsServices = visible<ServiceItem>(serviceRows);
    const cmsTech = visible<{ name: string }>(techRows);
    const cmsProcess = visible<{ title: string }>(processRows);
    return { projects: cmsProjects.length ? cmsProjects : projects.map((item, order) => ({ ...item, order, visible: true })), services: cmsServices.length ? cmsServices : services.map(([title, description, tools], order) => ({ title, description, tools: [...tools], order, visible: true })), technologies: cmsTech.length ? cmsTech.map(item => item.name) : [...technologies], processSteps: cmsProcess.length ? cmsProcess.map(item => item.title) : [...processSteps] };
  } catch { return { projects: projects.map((item, order) => ({ ...item, order, visible: true })), services: services.map(([title, description, tools], order) => ({ title, description, tools: [...tools], order, visible: true })), technologies: [...technologies], processSteps: [...processSteps] }; }
}
