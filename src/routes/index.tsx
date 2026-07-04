import { createAsync } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { ProjectCard } from "~/components/ProjectCard";
import type { DashboardPayload } from "~/types/api";
import { getDashboard } from "~/server/actions";

export default function Home() {
  const dashboard = createAsync(() => getDashboard());

  return (
    <main class="portfolio-root">
      <div class="bg-grid" aria-hidden="true" />

      <header class="hero">
        <div class="hero-inner">
          <div class="avatar-ring">
            <span class="avatar-initials">RN</span>
          </div>
          <div class="hero-text">
            <h1 class="hero-name">Robert Nemzek</h1>
            <p class="hero-tagline">Full-stack engineer · SolidJS · Go · PostgreSQL</p>
            <div class="hero-links">
              <a href="https://github.com/rnemzek" target="_blank" rel="noopener noreferrer" class="hero-link">
                GitHub
              </a>
              <a href="https://nemzilla.net" target="_blank" rel="noopener noreferrer" class="hero-link accent">
                nemzilla.net ↗
              </a>
            </div>
          </div>
        </div>
      </header>

      <Suspense fallback={<div class="loading">Loading projects…</div>}>
        <Show when={dashboard()}>
          {(data) => (
            <section class="projects-section">
              <h2 class="section-title">Projects</h2>
              <div class="projects-grid">
                <For each={data().projects}>
                  {(project) => <ProjectCard project={project} />}
                </For>
              </div>

              <Show when={data().uptime}>
                {(uptime) => (
                  <div class="uptime-banner">
                    <span class="uptime-dot" />
                    <span>All systems {uptime().status ?? "operational"}</span>
                    <Show when={uptime().uptimePercent !== undefined}>
                      <span class="uptime-pct">{uptime().uptimePercent?.toFixed(2)}% uptime</span>
                    </Show>
                  </div>
                )}
              </Show>
            </section>
          )}
        </Show>
      </Suspense>
    </main>
  );
}
