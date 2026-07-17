import { Show, createSignal } from "solid-js";
import type { StreamingStatus } from "~/types/api";
import { TechDrawer } from "~/components/TechDrawer";

interface Props {
  status: StreamingStatus | null;
}

export function StreamZillaCard(props: Props) {
  const [drawerOpen, setDrawerOpen] = createSignal(false);

  // Pointer-tracking glow: feed cursor position into CSS custom properties
  const handleMove = (e: MouseEvent & { currentTarget: HTMLDivElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div class="streamzilla-card" onMouseMove={handleMove}>
      <div class="sz-glow" aria-hidden="true" />
      <div class="sz-content">
        <div class="sz-header">
          <img
            src="/streamzilla-icon.png"
            alt=""
            width="34"
            height="34"
            class="sz-logo"
            aria-hidden="true"
          />
          {/* Stretched link: ::after covers the card, so the whole surface navigates */}
          <a
            href="https://streaming.nemzilla.net"
            target="_blank"
            rel="noopener noreferrer"
            class="sz-name"
          >
            StreamZilla
          </a>
          <Show
            when={props.status}
            fallback={<span class="status-badge checking">Status unknown</span>}
          >
            {(status) => (
              <Show
                when={status().online}
                fallback={<span class="status-badge offline">Offline</span>}
              >
                <span class="status-badge online">
                  <span class="sz-pulse" aria-hidden="true" /> Live
                </span>
              </Show>
            )}
          </Show>
        </div>
        <p class="sz-tagline">
          Your entire media library, anywhere — stream movies, shows &amp; live channels
          natively on iPhone, iPad &amp; Apple TV, with AI-powered discovery and true
          offline downloads for the moments in between.
        </p>
        <div class="sz-footer">
          <Show when={props.status?.online && props.status?.latencyMs != null}>
            <span class="sz-latency">{props.status?.latencyMs} ms</span>
          </Show>
          <button
            class="sz-deepdive"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
          >
            Tech deep-dive
          </button>
          <span class="sz-cta" aria-hidden="true">
            Launch streaming.nemzilla.net →
          </span>
        </div>
      </div>
      <TechDrawer open={drawerOpen()} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
