import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Activity, ArrowDown, ArrowLeft, ArrowRight, Check, Layers3, Radio, Sparkles } from "lucide-react";
import { projectDetails, projects as defaultProjects } from "@/lib/content";
import { getPublicCollections } from "@/lib/site-content";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { PixelCard } from "@/components/PixelCard";

export async function generateStaticParams() {
  return defaultProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await getPublicCollections();
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.summary, alternates: { canonical: `/projects/${slug}` } } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { projects } = await getPublicCollections();
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const project = projects[projectIndex];
  const fallbackDetail = projectDetails[slug as keyof typeof projectDetails];
  const projectDetail = fallbackDetail ? { ...fallbackDetail, problem: project.problem || fallbackDetail.problem, solution: project.solution || fallbackDetail.solution, nodes: project.nodes?.length ? project.nodes : fallbackDetail.nodes, capabilities: project.capabilities?.length ? project.capabilities : fallbackDetail.capabilities, implementation: project.implementation || fallbackDetail.implementation, stats: project.stats?.length ? project.stats : fallbackDetail.stats } : project.problem && project.solution && project.nodes?.length && project.capabilities?.length && project.implementation && project.stats?.length ? { problem:project.problem,solution:project.solution,nodes:project.nodes,capabilities:project.capabilities,implementation:project.implementation,stats:project.stats } : undefined;
  if (!project || !projectDetail) notFound();
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return <main className="case-page">
    <header className="case-nav" style={{ backdropFilter: "none", WebkitBackdropFilter: "none" }}>
      <div className="os-nav-texture" aria-hidden="true" />
      <div className="shell case-nav-inner">
        <Link href="/#projects" className="case-back"><ArrowLeft size={15} /> All systems</Link>
        <Link href="/" className="case-brand" aria-label="Mehedi portfolio home">mehedi<span>.</span></Link>
        <div className="case-nav-index">CASE STUDY / {project.number}</div>
      </div>
    </header>

    <section className="case-hero">
      <div className="case-grid-bg" aria-hidden="true" />
      <div className="shell case-hero-layout">
        <div className="case-hero-copy">
          <div className="case-kicker"><span><Radio size={11} /> DEPLOYMENT {project.number}</span>{project.client}</div>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <a href="#case-story" className="case-scroll">Explore the system <ArrowDown size={14} /></a>
        </div>
        <aside className="case-hero-system" aria-label="System overview">
          <div className="case-system-head"><span><i /> SYSTEM MAP</span><strong>ONLINE</strong></div>
          <div className="case-system-list">{projectDetail.nodes.map((node, index) => <div key={node}><span>{String(index + 1).padStart(2, "0")}</span><strong>{node}</strong><i /></div>)}</div>
          <div className="case-system-foot"><Activity size={14} /><span>Architecture designed for observable operation</span></div>
        </aside>
      </div>
      <div className="shell case-stat-strip">{projectDetail.stats.map(([value, label], index) => <div key={label}><small>0{index + 1}</small><strong>{value}</strong><span>{label}</span></div>)}</div>
    </section>

    <section className="case-story" id="case-story">
      <div className="shell">
        <div className="case-section-intro"><span>01 / CONTEXT</span><h2>From business friction<br />to a working system.</h2></div>
        <div className="case-story-grid">
          <PixelCard as="article" variant="glass" gridSize={10} className="case-story-card case-problem">
            <div><span>BEFORE</span><i>01</i></div>
            <h3>The operational problem</h3>
            <p>{projectDetail.problem}</p>
          </PixelCard>
          <div className="case-story-arrow" aria-hidden="true"><ArrowRight size={20} /></div>
          <PixelCard as="article" variant="glass" gridSize={10} className="case-story-card case-solution">
            <div><span>AFTER</span><i>02</i></div>
            <h3>The system response</h3>
            <p>{projectDetail.solution}</p>
          </PixelCard>
        </div>
      </div>
    </section>

    <section className="case-architecture-section">
      <div className="shell">
        <div className="case-section-intro case-section-intro-row"><div><span>02 / ARCHITECTURE</span><h2>Open the system.<br /><em>Inspect every layer.</em></h2></div><p>Select a component to see how responsibility stays clear across the wider automation.</p></div>
        <ArchitectureDiagram nodes={projectDetail.nodes} />
      </div>
    </section>

    <section className="case-build">
      <div className="shell case-build-layout">
        <div className="case-build-copy">
          <span>03 / IMPLEMENTATION</span>
          <h2>Built to operate,<br />not just demonstrate.</h2>
          <p>{projectDetail.implementation}</p>
          <div className="case-build-principle"><Layers3 size={18} /><div><strong>Modular by design</strong><span>Components can be maintained, replaced and scaled without rebuilding the entire system.</span></div></div>
        </div>
        <aside className="case-capabilities">
          <div className="case-capabilities-head"><Sparkles size={17} /><span>SYSTEM CAPABILITIES</span><i>{String(projectDetail.capabilities.length).padStart(2, "0")}</i></div>
          <div className="case-capabilities-list">{projectDetail.capabilities.map((capability, index) => <div key={capability}><span>{String(index + 1).padStart(2, "0")}</span><strong>{capability}</strong><Check size={16} /></div>)}</div>
        </aside>
      </div>
    </section>

    <section className="case-cta">
      <div className="shell case-cta-layout">
        <div><span>HAVE A SYSTEM IN MIND?</span><h2>Let’s turn the messy process<br />into something that runs.</h2><PixelCard as="a" href="/#contact" variant="primaryButton" gridSize={6} className="case-cta-primary">Start a project <ArrowRight size={16} /></PixelCard></div>
        <PixelCard as="a" href={`/projects/${nextProject.slug}`} variant="glass" gridSize={9} className="case-next"><small>NEXT CASE STUDY / {nextProject.number}</small><strong>{nextProject.title}</strong><ArrowRight size={20} /></PixelCard>
      </div>
    </section>
  </main>;
}
