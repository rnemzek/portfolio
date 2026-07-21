import { For, Show, createEffect, createSignal, on, onCleanup } from "solid-js";
import { Portal, isServer } from "solid-js/web";

export interface DrawerFeature {
  name: string;
  detail: string;
  leagues?: string[];
}

export interface DrawerDependency {
  name: string;
  role: string;
  detail: string;
}

export interface DrawerInstallStep {
  step: string;
  hint?: string;
  href?: string;
}

export interface DrawerContent {
  logo: string;
  title: string;
  ariaLabel: string;
  overview: {
    lead: string;
    summary: string;
    features: DrawerFeature[];
  };
  architecture: {
    lead: string;
    diagram: string;
    diagramId: string;
  };
  stack: {
    lead: string;
    dependencies: DrawerDependency[];
  };
  install: {
    lead: string;
    steps: DrawerInstallStep[];
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  content: DrawerContent;
}

type TabId = "overview" | "architecture" | "stack" | "install";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "stack", label: "Stack" },
  { id: "install", label: "Install" },
];

export function TechDrawer(props: Props) {
  const [mounted, setMounted] = createSignal(false);
  const [visible, setVisible] = createSignal(false);
  const [tab, setTab] = createSignal<TabId>("overview");
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
      const { svg } = await mermaid.render(props.content.architecture.diagramId, props.content.architecture.diagram);
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
          aria-label={props.content.ariaLabel}
        >
          <header class="drawer-header">
            <img src={props.content.logo} alt="" width="28" height="28" class="drawer-logo" aria-hidden="true" />
            <div class="drawer-title-group">
              <h2 class="drawer-title">{props.content.title}</h2>
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
              id="panel-overview"
              role="tabpanel"
              aria-labelledby="tab-overview"
              hidden={tab() !== "overview"}
            >
              <p class="drawer-lead">{props.content.overview.lead}</p>
              <p class="drawer-summary">{props.content.overview.summary}</p>
              <ul class="dep-list">
                <For each={props.content.overview.features}>
                  {(feature) => (
                    <li class="dep-item">
                      <div class="dep-head">
                        <span class="dep-name">{feature.name}</span>
                      </div>
                      <p class="dep-detail">{feature.detail}</p>
                      <Show when={feature.leagues}>
                        <div class="league-row">
                          <For each={feature.leagues}>
                            {(league) => <span class="league-badge">{league}</span>}
                          </For>
                        </div>
                      </Show>
                    </li>
                  )}
                </For>
              </ul>
            </section>

            <section
              id="panel-architecture"
              role="tabpanel"
              aria-labelledby="tab-architecture"
              hidden={tab() !== "architecture"}
            >
              <p class="drawer-lead">{props.content.architecture.lead}</p>
              <Show
                when={diagramSvg()}
                fallback={
                  <Show
                    when={diagramFailed()}
                    fallback={<p class="drawer-loading">Rendering diagram…</p>}
                  >
                    <pre class="diagram-fallback">{props.content.architecture.diagram}</pre>
                  </Show>
                }
              >
                {(svg) => <div class="mermaid-host" innerHTML={svg()} />}
              </Show>
            </section>

            <section id="panel-stack" role="tabpanel" aria-labelledby="tab-stack" hidden={tab() !== "stack"}>
              <p class="drawer-lead">{props.content.stack.lead}</p>
              <ul class="dep-list">
                <For each={props.content.stack.dependencies}>
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
              <p class="drawer-lead">{props.content.install.lead}</p>
              <ol class="install-steps">
                <For each={props.content.install.steps}>
                  {(s) => (
                    <li class="install-step">
                      <Show when={s.href} fallback={<p class="step-text">{s.step}</p>}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer" class="step-text step-link">
                          {s.step}
                        </a>
                      </Show>
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
