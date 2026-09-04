import {
  PixelArrowDownRight,
  PixelArrowRight,
  PixelCornerDownRight,
  PixelRadio,
  PixelShield,
  PixelSparkles,
} from "@/components/PixelIcons";
import { CircleDot, Play, ArrowUp, ArrowDownToLine } from "lucide-react";
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
import { TelemetryHUD } from "@/components/TelemetryHUD";
import { CommandPalette } from "@/components/CommandPalette";
import { AgentSandbox } from "@/components/AgentSandbox";
import { BeforeAfterComparison } from "@/components/BeforeAfterComparison";
import { RoiCalculator } from "@/components/RoiCalculator";
import { BlueprintGenerator } from "@/components/BlueprintGenerator";
import { getPublicCollections, getSiteContent } from "@/lib/site-content";

const lines = (value: string) =>
  value.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < value.split("\n").length - 1 && <br />}
    </span>
  ));
export const revalidate = 60;
export default async function Home() {
  const [content, collections] = await Promise.all([getSiteContent(), getPublicCollections()]);
  const { projects, services, technologies, processSteps } = collections;
  return (
    <main className="os-page">
      <Navigation />

      <section id="home" className="os-hero">
        <div className="os-noise" aria-hidden="true" />
        <div className="shell os-hero-grid">
          <div className="os-hero-copy">
            <div className="os-kicker">
              <span className="os-live-dot" />
              {content.hero.kicker} <i>{content.hero.availability}</i>
            </div>
            <h1>
              {content.hero.title}
              <br />
              <span>{content.hero.accentTitle}</span>
            </h1>
            <p>{content.hero.description}</p>
            <div className="os-hero-actions">
              <PixelCard as="a" href="#projects" variant="primaryButton" gridSize={6} className="os-action-primary">
                {content.hero.primaryCta} <PixelArrowDownRight size={17} />
              </PixelCard>
              <PixelCard as="a" href="#playground" variant="glass" gridSize={6} className="os-action-ghost inline-flex items-center gap-2">
                <Play size={13} className="fill-current text-[#c8ff3d]" /> {content.hero.secondaryCta}
              </PixelCard>
              <PixelCard
                as="a"
                href="/api/resume/download"
                download="Mehedi_Hasan_Resume.pdf"
                variant="glass"
                gridSize={6}
                className="os-action-ghost inline-flex items-center gap-2 border border-[#c8ff3d]/30 hover:border-[#c8ff3d] hover:text-white transition"
                aria-label="Download Resume / CV"
              >
                <ArrowDownToLine size={13} className="text-[#c8ff3d]" />
                <span>Resume / CV</span>
              </PixelCard>
            </div>
            <AutomationCommand />
          </div>
          <AutomationCore markers={content.globeMarkers} arcs={content.globeArcs} />
        </div>
        <TelemetryHUD location={content.hero.location} specialties={content.hero.specialties} />
      </section>

      <MarqueeStrip />

      <section id="about" className="section os-about">
        <div className="shell">
          <div className="os-section-head">
            <span>{content.about.eyebrow}</span>
            <h2>{lines(content.about.heading)}</h2>
            <p>{content.about.intro}</p>
          </div>
          <div className="os-profile-grid">
            <PixelCard as="article" variant="glass" gridSize={9} className="os-profile-card os-profile-main">
              <div className="os-card-label">PROFILE.LOG</div>
              <h3>{lines(content.about.profileHeading)}</h3>
              <p>{content.about.profileBody}</p>
              <div className="mt-4 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="os-signature">{content.about.signature}</div>
                <a
                  href="/api/resume/download"
                  download="Mehedi_Hasan_Resume.pdf"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#c8ff3d] hover:text-[#d8ff60] transition px-2.5 py-1 rounded bg-[#141f12] border border-[#c8ff3d]/30 hover:border-[#c8ff3d]"
                  aria-label="Download Full CV (PDF)"
                >
                  <ArrowDownToLine size={13} />
                  <span>Download Full CV (PDF)</span>
                </a>
              </div>
            </PixelCard>
            <PixelCard as="article" variant="glass" gridSize={9} className="os-profile-card">
              <div className="os-card-label">I THINK IN</div>
              {["Inputs", "Decisions", "Connections", "Failure paths", "Outcomes"].map((item, index) => (
                <div className="os-thinking-row" key={item}>
                  <span>0{index + 1}</span>
                  {item}
                  <PixelCornerDownRight size={15} />
                </div>
              ))}
            </PixelCard>
            <PixelCard as="article" variant="glass" gridSize={9} className="os-profile-card os-profile-quote">
              <PixelSparkles size={22} />
              <blockquote>“{content.about.quote}”</blockquote>
              <small>{content.about.principle}</small>
            </PixelCard>
          </div>
        </div>
      </section>

      <section id="projects" className="section os-projects">
        <div className="shell">
          <div className="os-section-head os-section-head-row">
            <div>
              <span>{content.projects.eyebrow}</span>
              <h2>{lines(content.projects.heading)}</h2>
            </div>
            <p>{content.projects.intro}</p>
          </div>
          <ProjectCards projects={projects} />
        </div>
      </section>

      <section id="playground" className="section os-playground">
        <div className="shell">
          <div className="os-playground-head">
            <div>
              <span className="os-terminal-dot" /> {content.playground.label}
            </div>
            <h2>
              {content.playground.heading}
              <br />
              <em>{content.playground.accentHeading}</em>
            </h2>
            <p>{content.playground.description}</p>
          </div>
          <WorkflowVisualizer workflowNodes={content.workflowNodes} />
          <AgentSandbox />
        </div>
      </section>

      <section id="services" className="section os-services">
        <div className="shell">
          <div className="os-section-head os-section-head-row">
            <div>
              <span>{content.capabilities.eyebrow}</span>
              <h2>{lines(content.capabilities.heading)}</h2>
            </div>
            <div className="os-head-note">
              <PixelRadio size={17} />
              {lines(content.capabilities.note)}
            </div>
          </div>
          <ServiceGrid services={services} />
        </div>
      </section>

      <section className="os-metrics">
        <div className="shell os-metric-grid">
          {content.metrics.map(({ value, label }, index) => (
            <div className="os-metric" key={label}>
              <small>0{index + 1}</small>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="shell os-estimate-note">Portfolio indicators · editable estimates where noted in the case studies</p>
      </section>

      <BeforeAfterComparison />
      <RoiCalculator />

      <section id="technology" className="section os-technology">
        <div className="shell">
          <div className="os-section-head os-section-head-row">
            <div>
              <span>{content.technology.eyebrow}</span>
              <h2>{lines(content.technology.heading)}</h2>
            </div>
            <p>{content.technology.intro}</p>
          </div>
          <TechSignal technologies={technologies} />
        </div>
      </section>

      <BlueprintGenerator />

      <section id="process" className="section os-process">
        <div className="shell os-process-layout">
          <div className="os-process-intro">
            <span>{content.process.eyebrow}</span>
            <h2>{content.process.heading}</h2>
            <p>{content.process.intro}</p>
            <PixelCard as="a" href="#contact" variant="primaryButton" gridSize={6} className="inline-flex items-center gap-2">
              {content.process.cta} <PixelArrowRight size={15} />
            </PixelCard>
          </div>
          <ol className="os-process-list">
            {processSteps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step}</h3>
                <CircleDot size={17} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="section os-contact">
        <div className="shell os-contact-layout">
          <div className="os-contact-copy">
            <div className="os-kicker">
              <span className="os-live-dot" />
              {content.contact.kicker}
            </div>
            <h2>{lines(content.contact.heading)}</h2>
            <p>{content.contact.intro}</p>
            <div className="os-contact-trust">
              <PixelShield size={18} />
              {content.contact.privacy}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="os-footer">
        <div className="shell">
          <div className="os-footer-mark">
            M<span>/AI</span>
          </div>
          <div>{content.footer.identity}</div>
          <div>
            © {new Date().getFullYear()} {content.footer.copyright}
          </div>
          <a href="#home">BACK TO TOP ↑</a>
        </div>
      </footer>
      <BackToTop />
      <AIAssistant />
      <CommandPalette />
    </main>
  );
}
