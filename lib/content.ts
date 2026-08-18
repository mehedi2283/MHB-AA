export const services = [
  ["AI Voice Agents","Natural, responsive voice systems for qualification, support and booking.",["Vapi","Retell AI","Twilio"]],
  ["AI Chatbots","Knowledge-grounded assistants that answer, route and convert.",["OpenAI","Claude","Gemini"]],
  ["Multi-Agent Systems","Coordinated specialist agents with shared context and clear responsibilities.",["n8n","Claude","Supabase"]],
  ["Workflow Automation","Reliable, observable workflows connecting the tools your team already uses.",["n8n","Make","Zapier"]],
  ["CRM & Lead Systems","Lead capture, enrichment, scoring, routing, follow-up and reporting.",["GoHighLevel","Apollo","Instantly"]],
  ["SaaS MVP Development","Production-ready portals and platforms built around your automation engine.",["Next.js","MongoDB","Supabase"]],
  ["API Integrations","Secure API and webhook connections with retries and failure handling.",["REST APIs","Webhooks","Node.js"]],
  ["Dashboards & Analytics","Focused operational views that make automated systems measurable.",["Next.js","PostgreSQL","Sheets"]]
] as const;

export const projects = [
  { slug:"explore-gaming-pub", number:"01", client:"Explore Gaming Pub · Romania", title:"Full Member Lifecycle Automation", summary:"A complete automation backbone spanning onboarding, loyalty tiers, win-back campaigns and live reporting across 13+ n8n workflows.", tags:["n8n","GGLeap API","SendGrid","JWT"], color:"#4f8cff" },
  { slug:"gazi-ai", number:"02", client:"Gazi AI", title:"AI-Powered Cold Outreach SaaS", summary:"A client-facing outreach platform combining lead sourcing, enrichment, AI-personalized sequencing, campaign tracking and database operations.", tags:["Next.js","n8n","Apollo","Supabase"], color:"#9a72ff" },
  { slug:"skincare-ai-ecosystem", number:"03", client:"UK Skincare Brand", title:"Multi-Agent AI Business Ecosystem", summary:"Eight coordinated AI agents with shared business knowledge, task-specific responsibilities and self-hosted production infrastructure.", tags:["Hermes AI","Claude","n8n","VPS"], color:"#55d6be" }
];

export const projectDetails = {
  "explore-gaming-pub": { problem:"Member operations spanned onboarding, activity, loyalty tiers and campaigns without one connected lifecycle.", solution:"A modular backbone of 13+ n8n workflows connected member events to tier logic, engagement sequences and live reporting.", nodes:["GGLeap","JWT Gateway","n8n Workflows","SendGrid","Reporting"], capabilities:["Member onboarding","Diamond, Gold and Premium logic","Win-back and birthday campaigns","Activity tracking","Live reporting dashboards"], implementation:"Authentication and token sharing were centralized, while workflow responsibilities stayed isolated. Webhooks carried customer activity into lifecycle logic and reporting views.", stats:[["13+","connected workflows"],["03","loyalty tiers"],["01","lifecycle backbone"]] },
  "gazi-ai": { problem:"Outreach teams needed sourcing, enrichment, personalized content and campaign visibility to behave like one product.", solution:"A SaaS-style platform paired a client-facing Next.js dashboard with an n8n orchestration layer and Supabase data model.", nodes:["Apollo","Enrichment","AI Personalization","Instantly","Client Dashboard"], capabilities:["Lead sourcing and enrichment","AI-personalized emails","Automated campaign sequences","Lead and campaign tracking","Database management"], implementation:"APIs and webhooks synchronize prospect records, generated content and campaign events while the interface gives clients a focused operational view.", stats:[["05","system stages"],["AI","personalized outreach"],["01","client workspace"]] },
  "skincare-ai-ecosystem": { problem:"A growing skincare business needed different business functions supported without relying on one general-purpose chatbot.", solution:"Eight coordinated agents were designed with task-specific responsibilities, shared business knowledge and centralized data.", nodes:["Business Knowledge","Agent Router","8 Specialist Agents","n8n","Supabase","VPS"], capabilities:["Eight coordinated agents","Shared business knowledge","Task-specific responsibilities","Centralized data storage","Self-hosted production deployment"], implementation:"Hermes AI, Claude API and n8n were orchestrated around a Supabase knowledge and data layer, then deployed to self-hosted VPS infrastructure.", stats:[["08","specialist agents"],["01","shared knowledge layer"],["VPS","self-hosted runtime"]] },
} satisfies Record<string,{problem:string;solution:string;nodes:string[];capabilities:string[];implementation:string;stats:[string,string][]}>;

export const processSteps = ["Discovery & business analysis","Automation opportunity mapping","Technical architecture","Prototype / proof of concept","Development","Integration","Testing & error handling","Deployment","Documentation & training","Support & optimization"];
export const technologies = ["n8n","GoHighLevel","Make","Zapier","OpenAI","Claude","Gemini","Twilio","Vapi","Retell AI","Instantly","Apollo","Supabase","MongoDB","Airtable","Stripe","SendGrid","Next.js","Node.js","REST APIs","Webhooks","Google Sheets","PostgreSQL","VPS"];
export const workflowNodes = [
  {name:"Lead Source", desc:"Captures prospects from forms, ads, directories or outbound lists.", tools:"Apollo · Forms · Webhooks", benefit:"No lead falls through the cracks."},
  {name:"AI Qualification", desc:"Scores intent, fit and urgency using defined business rules.", tools:"OpenAI · Claude · Gemini", benefit:"Your team focuses on high-fit opportunities."},
  {name:"CRM", desc:"Creates and enriches a clean, centralized contact record.", tools:"GoHighLevel · HubSpot · Supabase", benefit:"One reliable source of customer truth."},
  {name:"Appointment", desc:"Routes qualified prospects into the right booking flow.", tools:"Cal.com · Calendly · GHL", benefit:"Fewer scheduling delays and drop-offs."},
  {name:"Follow-Up", desc:"Runs personalized, timed sequences across the right channels.", tools:"SendGrid · Twilio · Instantly", benefit:"Consistent follow-up without manual chasing."},
  {name:"Dashboard", desc:"Surfaces outcomes, bottlenecks, failures and next actions.", tools:"Next.js · Sheets · PostgreSQL", benefit:"Decisions are grounded in live data."}
];
