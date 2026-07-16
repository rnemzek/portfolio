import { Show } from "solid-js";
import type { StreamingStatus } from "~/types/api";

interface Props {
  status: StreamingStatus | null;
}

export function StreamZillaCard(props: Props) {
  // Pointer-tracking glow: feed cursor position into CSS custom properties
  const handleMove = (e: MouseEvent & { currentTarget: HTMLAnchorElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <a
      href="https://streaming.nemzilla.net"
      target="_blank"
      rel="noopener noreferrer"
      class="streamzilla-card"
      onMouseMove={handleMove}
    >
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
          <span class="sz-name">StreamZilla</span>
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
          Personal streaming platform — movies, shows &amp; live channels, built mobile-first
          for iPhone, iPad &amp; Apple TV with offline downloads on the go.
        </p>
        <div class="sz-footer">
          <Show when={props.status?.online && props.status?.latencyMs != null}>
            <span class="sz-latency">{props.status?.latencyMs} ms</span>
          </Show>
          <span class="sz-cta">Launch streaming.nemzilla.net →</span>
        </div>
      </div>
    </a>
  );
}
