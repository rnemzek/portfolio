import { For } from "solid-js";

const TECH_STACK = ["React", "Vite", "Node.js", "Express", "SQLite", "Leaflet"];

export function GridZillaCard() {
  return (
    <div class="project-card gz-card">
      <div class="card-header">
        <img
          src="/gridzilla-icon.svg"
          alt=""
          width="28"
          height="28"
          class="card-icon"
          aria-hidden="true"
        />
        {/* Stretched link: card root is a div, so this anchor's ::after covers
            the whole surface while the GitHub link floats above it */}
        <a
          href="https://grid.nemzilla.net"
          target="_blank"
          rel="noopener noreferrer"
          class="card-name gz-name"
        >
          GridZilla ēvolvere
        </a>
        <span class="status-badge online">Live</span>
      </div>

      <ul class="card-pills" aria-label="GridZilla tech stack">
        <For each={TECH_STACK}>{(tech) => <li class="card-pill">{tech}</li>}</For>
      </ul>

      <p class="card-description">
        High-performance EV charging registry, spatial locator, and real-time grid
        intelligence platform with dual-coordinate spatial precision.
      </p>

      <a
        href="https://github.com/rnemzek/evolvere"
        target="_blank"
        rel="noopener noreferrer"
        class="gz-github"
      >
        View source →
      </a>

      <span class="card-arrow" aria-hidden="true">→</span>
    </div>
  );
}
