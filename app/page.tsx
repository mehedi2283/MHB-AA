import { ArrowDownRight, ArrowRight, CircleDot, CornerDownRight, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { AutomationCore } from "@/components/AutomationCore";
import { AutomationCommand } from "@/components/AutomationCommand";
import { WorkflowVisualizer } from "@/components/WorkflowVisualizer";
import { ServiceGrid } from "@/components/ServiceGrid";
import { ProjectCards } from "@/components/ProjectCards";
import { TechSignal } from "@/components/TechSignal";
import { ContactForm } from "@/components/ContactForm";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { AIAssistant } from "@/components/AIAssistant";
import { BackToTop } from "@/components/BackToTop";
import { PixelCard } from "@/components/PixelCard";
import { getPublicCollections, getSiteContent } from "@/lib/site-content";

const lines = (value: string) => value.split("\n").map((line, index) => <span key={`${line}-${index}`}>{line}{index < value.split("\n").length - 1 && <br />}</span>);
export const revalidate = 60;
export default async function Home() {
  const [content, collections] = await Promise.all([getSiteContent(), getPublicCollections()]);
  const { projects, services, technologies, processSteps } = collections;
  return <main className="os-page">
    <Navigation />

    <section id="home" className="os-hero">
      <div className="os-noise" aria-hidden="true" />
      <div className="shell os-hero-grid">
        <div className="os-hero-copy">
          <div className="os-kicker"><span className="os-live-dot" />{content.hero.kicker} <i>{content.hero.availability}</i></div>
          <h1>{content.hero.title}<br /><span>{content.hero.accentTitle}</span></h1>
          <p>{content.hero.description}</p>
          <div className="os-hero-actions">
            <PixelCard as="a" href="#projects" variant="primaryButton" gridSize={6} className="os-action-primary">
              {content.hero.primaryCta} <ArrowDownRight size={17} />
            </PixelCard>
            <PixelCard as="a" href="#playground" variant="glass" gridSize={6} className="os-action-ghost">
              <span className="os-play">▶</span> {content.hero.secondaryCta}
            </PixelCard>
          </div>
          <AutomationCommand />
        </div>
        <AutomationCore />
      </div>
      <div className="shell os-status-strip">
        <span>{content.hero.location}</span>
        <span>{content.hero.specialties}</span>
        <span className="os-status-right"><Radio size={12} />SYSTEMS ONLINE</span>
      </div>
    </section>

    <MarqueeStrip />

    <section id="about" className="section os-about"><div className="shell">
      <div className="os-section-head"><span>{content.about.eyebrow}</span><h2>{lines(content.about.heading)}</h2><p>{content.about.intro}</p></div>
      <div className="os-profile-grid">
        <PixelCard as="article" variant="glass" gridSize={9} className="os-profile-card os-profile-main"><div className="os-card-label">PROFILE.LOG</div><h3>{lines(content.about.profileHeading)}</h3><p>{content.about.profileBody}</p><div className="os-signature">{content.about.signature}</div></PixelCard>
        <PixelCard as="article" variant="glass" gridSize={9} className="os-profile-card"><div className="os-card-label">I THINK IN</div>{["Inputs", "Decisions", "Connections", "Failure paths", "Outcomes"].map((item, index) => <div className="os-thinking-row" key={item}><span>0{index + 1}</span>{item}<CornerDownRight size={15} /></div>)}</PixelCard>
        <PixelCard as="article" variant="glass" gridSize={9} className="os-profile-card os-profile-quote"><Sparkles size={22} /><blockquote>“{content.about.quote}”</blockquote><small>{content.about.principle}</small></PixelCard>
      </div>
    </div></section>

    <section id="projects" className="section os-projects"><div className="shell"><div className="os-section-head os-section-head-row"><div><span>{content.projects.eyebrow}</span><h2>{lines(content.projects.heading)}</h2></div><p>{content.projects.intro}</p></div><ProjectCards projects={projects} /></div></section>

    <section id="playground" className="section os-playground"><div className="shell"><div className="os-playground-head"><div><span className="os-terminal-dot" /> {content.playground.label}</div><h2>{content.playground.heading}<br /><em>{content.playground.accentHeading}</em></h2><p>{content.playground.description}</p></div><WorkflowVisualizer workflowNodes={content.workflowNodes} /></div></section>

    <section id="services" className="section os-services"><div className="shell"><div className="os-section-head os-section-head-row"><div><span>{content.capabilities.eyebrow}</span><h2>{lines(content.capabilities.heading)}</h2></div><div className="os-head-note"><Radio size={17} />{lines(content.capabilities.note)}</div></div><ServiceGrid services={services} /></div></section>

    <section className="os-metrics"><div className="shell os-metric-grid">{content.metrics.map(({value, label}, index) => <div className="os-metric" key={label}><small>0{index + 1}</small><strong>{value}</strong><span>{label}</span></div>)}</div><p className="shell os-estimate-note">Portfolio indicators · editable estimates where noted in the case studies</p></section>

    <section id="technology" className="section os-technology"><div className="shell"><div className="os-section-head os-section-head-row"><div><span>{content.technology.eyebrow}</span><h2>{lines(content.technology.heading)}</h2></div><p>{content.technology.intro}</p></div><TechSignal technologies={technologies} /></div></section>

    <section id="process" className="section os-process"><div className="shell os-process-layout"><div className="os-process-intro"><span>{content.process.eyebrow}</span><h2>{content.process.heading}</h2><p>{content.process.intro}</p><PixelCard as="a" href="#contact" variant="primaryButton" gridSize={6} className="inline-flex items-center gap-2">{content.process.cta} <ArrowRight size={15} /></PixelCard></div><ol className="os-process-list">{processSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step}</h3><CircleDot size={17} /></li>)}</ol></div></section>


    <section id="contact" className="section os-contact"><div className="shell os-contact-layout"><div className="os-contact-copy"><div className="os-kicker"><span className="os-live-dot" />{content.contact.kicker}</div><h2>{lines(content.contact.heading)}</h2><p>{content.contact.intro}</p><div className="os-contact-trust"><ShieldCheck size={18} />{content.contact.privacy}</div></div><ContactForm /></div></section>

    <footer className="os-footer"><div className="shell"><div className="os-footer-mark">M<span>/AI</span></div><div>{content.footer.identity}</div><div>© {new Date().getFullYear()} {content.footer.copyright}</div><a href="#home">BACK TO TOP ↑</a></div></footer>
    <BackToTop />
    <AIAssistant />
  </main>;
}
