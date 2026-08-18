import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/lib/site-content";
import { PixelCard } from "./PixelCard";

const architecture = [["GGLeap", "n8n", "Lifecycle"], ["Apollo", "AI", "Instantly"], ["Knowledge", "8 Agents", "VPS"]];
const cardVariants: Array<"amber" | "acid" | "mixed"> = ["amber", "acid", "mixed"];

export function ProjectCards({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="deployment-list">
      {projects.map((project, index) => (
        <PixelCard
          key={project.slug}
          as="a"
          href={`/projects/${project.slug}`}
          variant="glass"
          gridSize={10}
          className="deployment-card group"
        >
          <div className="deployment-index">DEPLOYMENT / {project.number}</div>
          <div className="deployment-copy">
            <div className="deployment-client">
              <span />
              {project.client}
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="deployment-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="deployment-map" aria-hidden="true">
            {(architecture[index] || project.tags.slice(0, 3)).map((node, nodeIndex) => (
              <div className="deployment-node" key={node}>
                <i>{nodeIndex + 1}</i>
                {node}
              </div>
            ))}
          </div>
          <div className="deployment-open">
            View case study <ArrowUpRight size={16} />
          </div>
        </PixelCard>
      ))}
    </div>
  );
}

