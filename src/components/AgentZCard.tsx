import { For, createSignal } from "solid-js";
import { TechDrawer } from "~/components/TechDrawer";
import { AGENTZ_CONTENT } from "~/data/agentzData";

const TECH_STACK = ["SolidJS", "Hono", "SSE", "Anthropic Claude", "Merkle Ledger"];

export function AgentZCard() {
  const [drawerOpen, setDrawerOpen] = createSignal(false);

  // Pointer-tracking glow: feed cursor position into CSS custom properties
  const handleMove = (e: MouseEvent & { currentTarget: HTMLDivElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div id="agentz-card" class="streamzilla-card" onMouseMove={handleMove}>
      <div class="sz-glow" aria-hidden="true" />
      <div class="sz-content">
        <div class="sz-header">
          <img
            src="/agentz-icon.svg"
            alt=""
            width="34"
            height="34"
            class="sz-logo"
            aria-hidden="true"
          />
          {/* No live deploy yet (nemzilla.net is under construction — see the
              hero's disabled pill in index.tsx), so unlike GridZilla/StreamZilla
              this is plain text, not a stretched-link anchor. */}
          <span class="sz-name">AgentZ Studio</span>
          <span class="status-badge dev">⚡ IN DEVELOPMENT</span>
        </div>
        <ul class="sz-stack" aria-label="AgentZ Studio tech stack">
          <For each={TECH_STACK}>{(tech) => <li class="sz-pill">{tech}</li>}</For>
        </ul>
        <p class="sz-tagline">
          A conversational AI Product Owner, a simulated multi-agent build swarm, and a SHA-256
          audited governance policy engine — an Agent Trust Control Plane for orchestration you can
          actually verify.
        </p>
        <div class="sz-footer">
          <button
            class="sz-deepdive"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
          >
            Tech deep-dive
          </button>
          <span class="sz-cta" aria-hidden="true">
            nemzilla.net — coming soon
          </span>
        </div>
      </div>
      <TechDrawer open={drawerOpen()} onClose={() => setDrawerOpen(false)} content={AGENTZ_CONTENT} />
    </div>
  );
}
