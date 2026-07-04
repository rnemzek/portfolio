import type { ProjectProfile } from "~/types/api";

interface Props {
  project: ProjectProfile;
}

export function ProjectCard(props: Props) {
  const { project } = props;

  return (
    <a
      href={project.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      class="project-card"
    >
      <div class="card-header">
        <span class="card-name">{project.name}</span>
        {project.metrics && (
          <span class="status-badge online">Live</span>
        )}
      </div>

      {project.description && (
        <p class="card-description">{project.description}</p>
      )}

      {project.metrics && (
        <div class="card-metrics">
          <span class="metric">⭐ {project.metrics.stars}</span>
          <span class="metric">⑂ {project.metrics.forks}</span>
          <span class="metric">⚠ {project.metrics.openIssues}</span>
        </div>
      )}

      <span class="card-arrow">→</span>
    </a>
  );
}
