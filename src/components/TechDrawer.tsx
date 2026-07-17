import { For, Show, createEffect, createSignal, on, onCleanup } from "solid-js";
import { Portal, isServer } from "solid-js/web";

interface Props {
  open: boolean;
  onClose: () => void;
}

type TabId = "architecture" | "stack" | "install";

const TABS: { id: TabId; label: string }[] = [
  { id: "architecture", label: "Architecture" },
  { id: "stack", label: "Stack" },
  { id: "install", label: "Install" },
];

// StreamZilla system architecture — rendered client-side by mermaid,
// lazy-loaded only when the drawer first opens (keeps first-load bundle lean).
const ARCH_DIAGRAM = `flowchart TD
  A["📱 iPhone · iPad · Apple TV"] -->|"Capacitor iOS shell"| B["StreamZilla App"]
  B -->|"HTTPS · JSON"| C["Express 5 API"]
  C --> D[("Better-SQLite3\nmedia library")]
  C -->|"HLS segments"| E["Streaming engine"]
  C -->|"metadata · discovery"| F["Anthropic AI\n(Claude API)"]
  B -->|"offline downloads"| G[("On-device storage")]`;

const DEPENDENCIES = [
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
];

const INSTALL_STEPS = [
  { step: "Open streaming.nemzilla.net in Safari on your iPhone or iPad.", hint: "Safari is required — Add to Home Screen is a Safari feature." },
  { step: "Tap the Share button (the square with an arrow) in the toolbar.", hint: "Bottom bar on iPhone, top-right on iPad." },
  { step: "Scroll down and tap “Add to Home Screen”.", hint: "" },
  { step: "Tap “Add” — StreamZilla appears on your home screen like a native app.", hint: "Launches full-screen with its own icon, no browser chrome." },
];

export function TechDrawer(props: Props) {
  const [mounted, setMounted] = createSignal(false);
  const [visible, setVisible] = createSignal(false);
  const [tab, setTab] = createSignal<TabId>("architecture");
  const [diagramSvg, setDiagramSvg] = createSignal<string>();
  const [diagramFailed, setDiagramFailed] = createSignal(false);
  let closeBtn: HTMLButtonElement | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  const renderDiagram = async () => {
    if (isServer || diagramSvg() || diagramFailed()) return;
    try {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        darkMode: true,
        themeVariables: {
          background: "transparent",
          primaryColor: "#14141f",
          primaryTextColor: "#e2e8f0",
          primaryBorderColor: "#7c3aed",
          lineColor: "#7183a0",
          fontFamily: "Inter, system-ui, sans-serif",
        },
      });
      const { svg } = await mermaid.render("sz-arch-diagram", ARCH_DIAGRAM);
      setDiagramSvg(svg);
    } catch {
      setDiagramFailed(true);
    }
  };

  createEffect(
    on(
      () => props.open,
      (open) => {
        if (isServer) return;
        if (open) {
          clearTimeout(closeTimer);
          setMounted(true);
          document.body.style.overflow = "hidden";
          requestAnimationFrame(() => {
            setVisible(true);
            closeBtn?.focus();
          });
          void renderDiagram();
        } else if (mounted()) {
          setVisible(false);
          document.body.style.overflow = "";
          closeTimer = setTimeout(() => setMounted(false), 350);
        }
      },
      { defer: true },
    ),
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && props.open) props.onClose();
  };
  if (!isServer) {
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(closeTimer);
      document.body.style.overflow = "";
    });
  }

  return (
    <Show when={mounted()}>
      <Portal>
        <div
          class="drawer-backdrop"
          classList={{ open: visible() }}
          onClick={() => props.onClose()}
          aria-hidden="true"
        />
        <aside
          class="tech-drawer"
          classList={{ open: visible() }}
          role="dialog"
          aria-modal="true"
          aria-label="StreamZilla tech deep-dive"
        >
          <header class="drawer-header">
            <img src="/streamzilla-icon.png" alt="" width="28" height="28" class="drawer-logo" aria-hidden="true" />
            <div class="drawer-title-group">
              <h2 class="drawer-title">StreamZilla</h2>
              <p class="drawer-subtitle">Tech deep-dive</p>
            </div>
            <button ref={closeBtn} class="drawer-close" onClick={() => props.onClose()} aria-label="Close panel">
              ✕
            </button>
          </header>

          <div class="drawer-tabs" role="tablist" aria-label="Deep-dive sections">
            <For each={TABS}>
              {(t) => (
                <button
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab() === t.id}
                  aria-controls={`panel-${t.id}`}
                  class="drawer-tab"
                  classList={{ active: tab() === t.id }}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              )}
            </For>
          </div>

          <div class="drawer-body">
            <section
              id="panel-architecture"
              role="tabpanel"
              aria-labelledby="tab-architecture"
              hidden={tab() !== "architecture"}
            >
              <p class="drawer-lead">
                End-to-end system architecture — a Capacitor-wrapped app talking to an Express 5 core
                with SQLite-speed storage and Claude-powered discovery.
              </p>
              <Show
                when={diagramSvg()}
                fallback={
                  <Show
                    when={diagramFailed()}
                    fallback={<p class="drawer-loading">Rendering diagram…</p>}
                  >
                    <pre class="diagram-fallback">{ARCH_DIAGRAM}</pre>
                  </Show>
                }
              >
                {(svg) => <div class="mermaid-host" innerHTML={svg()} />}
              </Show>
            </section>

            <section id="panel-stack" role="tabpanel" aria-labelledby="tab-stack" hidden={tab() !== "stack"}>
              <p class="drawer-lead">Core dependency taxonomy — the four pillars under the hood.</p>
              <ul class="dep-list">
                <For each={DEPENDENCIES}>
                  {(dep) => (
                    <li class="dep-item">
                      <div class="dep-head">
                        <span class="dep-name">{dep.name}</span>
                        <span class="dep-role">{dep.role}</span>
                      </div>
                      <p class="dep-detail">{dep.detail}</p>
                    </li>
                  )}
                </For>
              </ul>
            </section>

            <section id="panel-install" role="tabpanel" aria-labelledby="tab-install" hidden={tab() !== "install"}>
              <p class="drawer-lead">
                Install StreamZilla on your home screen — no App Store required.
              </p>
              <ol class="install-steps">
                <For each={INSTALL_STEPS}>
                  {(s) => (
                    <li class="install-step">
                      <p class="step-text">{s.step}</p>
                      <Show when={s.hint}>
                        <p class="step-hint">{s.hint}</p>
                      </Show>
                    </li>
                  )}
                </For>
              </ol>
            </section>
          </div>
        </aside>
      </Portal>
    </Show>
  );
}
