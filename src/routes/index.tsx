import { createAsync, query, revalidate } from "@solidjs/router";
import { ErrorBoundary, For, Show, Suspense } from "solid-js";
import { ProjectCard } from "~/components/ProjectCard";
import { StreamZillaCard } from "~/components/StreamZillaCard";
import type { DashboardPayload } from "~/types/api";
import { rpc } from "~/lib/rpc";

const getDashboard = query(async (): Promise<DashboardPayload> => {
  const res = await rpc.api.metrics.dashboard.$get();
  if (!res.ok) throw new Error(`Dashboard RPC failed with status ${res.status}`);
  const body = await res.json();
  return body.data;
}, "dashboard");

export default function Home() {
  const dashboard = createAsync(() => getDashboard());

  return (
    <main class="portfolio-root">
      <div class="bg-grid" aria-hidden="true" />

      <header class="hero">
        <div class="hero-inner">
          <div class="avatar-ring">
            <img
              src="/profile-icon.png?v=2"
              alt="Robert Nemzek — RN monogram"
              width="72"
              height="72"
              class="avatar-img"
            />
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
            <a
              href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Frobert.nemzilla.net"
              target="_blank"
              rel="noopener noreferrer"
              class="perf-chip"
            >
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="currentColor">
                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm3.72 6.03-4.25 4.25a.75.75 0 0 1-1.06 0L4.28 8.15a.75.75 0 1 1 1.06-1.06l1.6 1.6 3.72-3.72a.75.75 0 0 1 1.06 1.06Z" />
              </svg>
              Lighthouse 100 — performance verified
            </a>
          </div>
        </div>
      </header>

      <ErrorBoundary
        fallback={(_err, reset) => (
          <section class="projects-section">
            <div class="error-panel" role="alert">
              <p class="error-title">Projects are temporarily unavailable.</p>
              <p class="error-detail">The data service didn't respond — cached content will return shortly.</p>
              <button
                class="retry-btn"
                onClick={async () => {
                  await revalidate(getDashboard.key);
                  reset();
                }}
              >
                Retry
              </button>
            </div>
          </section>
        )}
      >
        <Suspense fallback={<div class="loading">Loading projects…</div>}>
          <Show when={dashboard()}>
            {(data) => (
              <section class="projects-section">
                <h2 class="section-title">Featured</h2>
                <StreamZillaCard status={data().streaming} />

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
      </ErrorBoundary>
    </main>
  );
}
