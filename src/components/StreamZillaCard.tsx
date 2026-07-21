import { For, Show, createSignal } from "solid-js";
import type { StreamingStatus } from "~/types/api";
import { TechDrawer, type DrawerContent } from "~/components/TechDrawer";

interface Props {
  status: StreamingStatus | null;
}

const TECH_STACK = ["TypeScript", "Express 5", "Capacitor iOS", "Better-SQLite3", "Anthropic AI"];

const STREAMZILLA_CONTENT: DrawerContent = {
  logo: "/streamzilla-icon.png",
  title: "StreamZilla",
  ariaLabel: "StreamZilla tech deep-dive",
  overview: {
    lead: "Product synopsis — what makes StreamZilla more than a media server.",
    summary:
      "An AI-powered aggregate search engine providing multi-platform streaming discovery, deep " +
      "relational crew cross-referencing, live multi-league sports analytics, and Google News data " +
      "syndication. Engineered mobile-first with a high-fidelity graph interface, nested routing " +
      "frameworks, and dynamic availability lookup handlers.",
    features: [
      {
        name: "Relational graph mapping",
        detail:
          "Every title, person, and topic lives in a deep cross-linked graph — hop from a film to its cast, to related coverage, to anything else connected, in one tap.",
      },
      {
        name: "Google News syndication",
        detail:
          "Trending headlines are syndicated from Google News and woven into the library, so coverage about what you watch surfaces right beside it.",
      },
      {
        name: "Live sports telemetry",
        detail:
          "Real-time score and game-state blocks for the four major leagues, streaming live alongside your media.",
        leagues: ["NFL", "NHL", "MLB", "NBA"],
      },
    ],
  },
  architecture: {
    lead:
      "End-to-end system architecture — a Capacitor-wrapped app talking to an Express 5 core with SQLite-speed storage and Claude-powered discovery.",
    // StreamZilla system architecture — rendered client-side by mermaid,
    // lazy-loaded only when the drawer first opens (keeps first-load bundle lean).
    diagram: `flowchart TD
  A["📱 iPhone · iPad · Apple TV"] -->|"Capacitor iOS shell"| B["StreamZilla App"]
  B -->|"HTTPS · JSON"| C["Express 5 API"]
  C --> D[("Better-SQLite3\nmedia library")]
  C -->|"HLS segments"| E["Streaming engine"]
  C -->|"metadata · discovery"| F["Anthropic AI\n(Claude API)"]
  B -->|"offline downloads"| G[("On-device storage")]`,
    diagramId: "sz-arch-diagram",
  },
  stack: {
    lead: "Core dependency taxonomy — the four pillars under the hood.",
    dependencies: [
      {
        name: "Anthropic AI",
        role: "Intelligence layer",
        detail:
          "Claude-powered metadata enrichment and library discovery — natural-language search and smart recommendations across the catalog.",
      },
      {
        name: "Capacitor (iOS)",
        role: "Native shell",
        detail:
          "Wraps the web app in a native iOS runtime for iPhone, iPad & Apple TV — home-screen install, native media session and background audio.",
      },
      {
        name: "Express 5",
        role: "API server",
        detail:
          "Modern async-first Node backend serving the typed JSON API, auth, and HLS stream endpoints.",
      },
      {
        name: "Better-SQLite3",
        role: "Storage engine",
        detail:
          "Zero-latency synchronous SQLite bindings holding the media library index — no network round-trips, instant queries.",
      },
    ],
  },
  install: {
    lead: "Install StreamZilla on your home screen — no App Store required.",
    steps: [
      {
        step: "Open streaming.nemzilla.net in Safari on your iPhone or iPad.",
        hint: "Safari is required — Add to Home Screen is a Safari feature.",
      },
      {
        step: "Tap the Share button (the square with an arrow) in the toolbar.",
        hint: "Bottom bar on iPhone, top-right on iPad.",
      },
      { step: "Scroll down and tap “Add to Home Screen”." },
      {
        step: "Tap “Add” — StreamZilla appears on your home screen like a native app.",
        hint: "Launches full-screen with its own icon, no browser chrome.",
      },
    ],
  },
};

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
        <ul class="sz-stack" aria-label="StreamZilla tech stack">
          <For each={TECH_STACK}>{(tech) => <li class="sz-pill">{tech}</li>}</For>
        </ul>
        <p class="sz-tagline">
          A multi-source media aggregator — semantic search across your entire library,
          deep graph cross-linking between related titles, trending Google News, and
          live sports telemetry, all native on iPhone, iPad &amp; Apple TV.
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
      <TechDrawer open={drawerOpen()} onClose={() => setDrawerOpen(false)} content={STREAMZILLA_CONTENT} />
    </div>
  );
}
