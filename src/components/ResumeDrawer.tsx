import { For, Show, createEffect, createSignal, on, onCleanup } from "solid-js";
import { Portal, isServer } from "solid-js/web";
import { resumeData, resumeJson, resumeMarkdown, type ResumeProject } from "~/data/resumeData";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called with a project's `linkKey` when its pill is clicked in the Interactive tab. */
  onProjectSelect?: (linkKey: string) => void;
}

type TabId = "interactive" | "json" | "terminal" | "pdf";

const TABS: { id: TabId; label: string }[] = [
  { id: "interactive", label: "Interactive" },
  { id: "json", label: "Schema / JSON" },
  { id: "terminal", label: "Terminal" },
  { id: "pdf", label: "PDF" },
];

const PDF_HREF = "/robert-nemzek-resume.pdf";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Lightweight regex tokenizer — no external highlighter dependency is installed.
function highlightJson(json: string): string {
  const pattern = /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  return escapeHtml(json).replace(pattern, (match) => {
    let cls = "json-number";
    if (match.startsWith('"')) cls = /:\s*$/.test(match) ? "json-key" : "json-string";
    else if (match === "true" || match === "false") cls = "json-bool";
    else if (match === "null") cls = "json-null";
    return `<span class="${cls}">${match}</span>`;
  });
}

const HIGHLIGHTED_JSON = highlightJson(resumeJson);

const TERMINAL_FILES: Record<string, string> = {
  "resume.json": resumeJson,
  "resume.md": resumeMarkdown,
  "summary.txt": resumeData.summary,
};

const HELP_TEXT = [
  "Available commands:",
  "  help          show this message",
  "  ls            list available files",
  "  cat <file>    print a file (resume.json, resume.md, summary.txt)",
  "  summary       print the professional summary",
  "  skills        list technical skill groups",
  "  download      download the PDF resume",
  "  clear         clear the terminal",
].join("\n");

interface TermResult {
  text: string;
  action?: "clear" | "download";
}

function runTerminalCommand(raw: string): TermResult {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  switch (cmd) {
    case "help":
      return { text: HELP_TEXT };
    case "ls":
      return { text: Object.keys(TERMINAL_FILES).join("\n") };
    case "cat": {
      if (!args[0]) return { text: "usage: cat <file>" };
      const content = TERMINAL_FILES[args[0]];
      return { text: content ?? `cat: ${args[0]}: No such file` };
    }
    case "summary":
      return { text: resumeData.summary };
    case "skills":
      return { text: resumeData.skills.map((g) => `${g.category}: ${g.items.join(", ")}`).join("\n") };
    case "clear":
      return { text: "", action: "clear" };
    case "download":
      return { text: "Downloading robert-nemzek-resume.pdf …", action: "download" };
    default:
      return { text: `command not found: ${cmd} (type "help")` };
  }
}

export function ResumeDrawer(props: Props) {
  const [mounted, setMounted] = createSignal(false);
  const [visible, setVisible] = createSignal(false);
  const [tab, setTab] = createSignal<TabId>("interactive");
  const [toast, setToast] = createSignal<string | null>(null);
  const [termLines, setTermLines] = createSignal<{ kind: "in" | "out"; text: string }[]>([
    { kind: "out", text: 'Type "help" to see available commands.' },
  ]);
  const [termInput, setTermInput] = createSignal("");

  let closeBtn: HTMLButtonElement | undefined;
  let termInputRef: HTMLInputElement | undefined;
  let termBodyRef: HTMLDivElement | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${label} copied to clipboard`);
    } catch {
      setToast("Copy failed — clipboard unavailable");
    }
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 1800);
  };

  const triggerDownload = () => {
    if (isServer) return;
    const a = document.createElement("a");
    a.href = PDF_HREF;
    a.download = "robert-nemzek-resume.pdf";
    a.click();
  };

  const submitTerminal = (e: Event) => {
    e.preventDefault();
    const value = termInput();
    if (!value.trim()) return;
    const result = runTerminalCommand(value);
    if (result.action === "clear") {
      setTermLines([]);
    } else {
      setTermLines((prev) => [
        ...prev,
        { kind: "in", text: value },
        ...(result.text ? [{ kind: "out" as const, text: result.text }] : []),
      ]);
    }
    if (result.action === "download") triggerDownload();
    setTermInput("");
    queueMicrotask(() => termBodyRef?.scrollTo({ top: termBodyRef.scrollHeight }));
  };

  const handleProjectClick = (project: ResumeProject) => {
    if (!project.linkKey) return;
    props.onProjectSelect?.(project.linkKey);
    props.onClose();
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
        } else if (mounted()) {
          setVisible(false);
          document.body.style.overflow = "";
          closeTimer = setTimeout(() => setMounted(false), 350);
        }
      },
      { defer: true },
    ),
  );

  createEffect(
    on(tab, (t) => {
      if (isServer || !props.open) return;
      if (t === "terminal") requestAnimationFrame(() => termInputRef?.focus());
    }),
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && props.open) props.onClose();
  };
  if (!isServer) {
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(closeTimer);
      clearTimeout(toastTimer);
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
          class="tech-drawer resume-drawer"
          classList={{ open: visible() }}
          role="dialog"
          aria-modal="true"
          aria-label="Robert Nemzek — Resume Command Center"
        >
          <header class="drawer-header">
            <img
              src="/profile-icon.png?v=2"
              alt=""
              width="28"
              height="28"
              class="drawer-logo"
              aria-hidden="true"
            />
            <div class="drawer-title-group">
              <h2 class="drawer-title">Resume Command Center</h2>
              <p class="drawer-subtitle">Interactive · JSON · Terminal · PDF</p>
            </div>
            <button ref={closeBtn} class="drawer-close" onClick={() => props.onClose()} aria-label="Close panel">
              ✕
            </button>
          </header>

          <div class="drawer-tabs" role="tablist" aria-label="Resume view modes">
            <For each={TABS}>
              {(t) => (
                <button
                  role="tab"
                  id={`resume-tab-${t.id}`}
                  aria-selected={tab() === t.id}
                  aria-controls={`resume-panel-${t.id}`}
                  class="drawer-tab"
                  classList={{ active: tab() === t.id }}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              )}
            </For>
          </div>

          <div class="drawer-body resume-body">
            <section
              id="resume-panel-interactive"
              role="tabpanel"
              aria-labelledby="resume-tab-interactive"
              hidden={tab() !== "interactive"}
            >
              <div class="resume-header-block">
                <h3 class="resume-name">{resumeData.name}</h3>
                <p class="resume-role">{resumeData.title}</p>
                <div class="league-row">
                  <For each={resumeData.focusAreas}>{(f) => <span class="league-badge">{f}</span>}</For>
                </div>
                <div class="resume-contact-row">
                  <span>{resumeData.location}</span>
                  <a href={`mailto:${resumeData.email}`}>{resumeData.email}</a>
                  <span>{resumeData.phone}</span>
                  <a href={resumeData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                  <a href={resumeData.githubUrl} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </div>
              </div>
              <p class="drawer-summary">{resumeData.summary}</p>

              <h4 class="resume-section-title">Technical Skills</h4>
              <div class="resume-skills">
                <For each={resumeData.skills}>
                  {(group) => (
                    <div class="resume-skill-group">
                      <span class="dep-role">{group.category}</span>
                      <div class="league-row">
                        <For each={group.items}>{(item) => <span class="league-badge">{item}</span>}</For>
                      </div>
                    </div>
                  )}
                </For>
              </div>

              <h4 class="resume-section-title">Recent Projects</h4>
              <ul class="dep-list">
                <For each={resumeData.projects}>
                  {(project) => (
                    <li class="dep-item">
                      <div class="dep-head">
                        <Show
                          when={project.linkKey}
                          fallback={<span class="dep-name">{project.name}</span>}
                        >
                          <button
                            type="button"
                            class="dep-name resume-project-link"
                            onClick={() => handleProjectClick(project)}
                          >
                            {project.name} ↗
                          </button>
                        </Show>
                      </div>
                      <div class="league-row">
                        <For each={project.stack}>{(s) => <span class="league-badge">{s}</span>}</For>
                      </div>
                      <ul class="resume-bullets">
                        <For each={project.bullets}>{(b) => <li>{b}</li>}</For>
                      </ul>
                    </li>
                  )}
                </For>
              </ul>

              <h4 class="resume-section-title">Professional Experience</h4>
              <ul class="dep-list">
                <For each={resumeData.experience}>
                  {(job) => (
                    <li class="dep-item">
                      <div class="dep-head">
                        <span class="dep-name">
                          {job.company}
                          {job.location ? ` · ${job.location}` : ""}
                        </span>
                        <span class="dep-role">{job.dates}</span>
                      </div>
                      <p class="dep-detail resume-job-title">{job.title}</p>
                      <ul class="resume-bullets">
                        <For each={job.bullets}>{(b) => <li>{b}</li>}</For>
                      </ul>
                    </li>
                  )}
                </For>
              </ul>

              <h4 class="resume-section-title">Prior Roles</h4>
              <ul class="resume-bullets resume-prior-roles">
                <For each={resumeData.priorRoles}>
                  {(role) => (
                    <li>
                      <strong>{role.company}</strong> — {role.title}
                    </li>
                  )}
                </For>
              </ul>

              <h4 class="resume-section-title">Education</h4>
              <ul class="resume-bullets">
                <For each={resumeData.education}>
                  {(edu) => (
                    <li>
                      <strong>{edu.school}</strong> — {edu.field}
                    </li>
                  )}
                </For>
              </ul>
            </section>

            <section
              id="resume-panel-json"
              role="tabpanel"
              aria-labelledby="resume-tab-json"
              hidden={tab() !== "json"}
            >
              <div class="resume-toolbar">
                <button type="button" class="resume-action-btn" onClick={() => copy(resumeJson, "JSON")}>
                  Copy .json
                </button>
              </div>
              <pre class="resume-code">
                <code innerHTML={HIGHLIGHTED_JSON} />
              </pre>
            </section>

            <section
              id="resume-panel-terminal"
              role="tabpanel"
              aria-labelledby="resume-tab-terminal"
              hidden={tab() !== "terminal"}
            >
              <div class="resume-terminal">
                <div class="resume-term-body" ref={termBodyRef}>
                  <For each={termLines()}>
                    {(line) => (
                      <p classList={{ "resume-term-in": line.kind === "in", "resume-term-out": line.kind === "out" }}>
                        <Show when={line.kind === "in"}>
                          <span class="resume-term-prompt">$ </span>
                        </Show>
                        {line.text}
                      </p>
                    )}
                  </For>
                </div>
                <form class="resume-term-form" onSubmit={submitTerminal}>
                  <span class="resume-term-prompt">$</span>
                  <input
                    ref={termInputRef}
                    class="resume-term-input"
                    type="text"
                    autocomplete="off"
                    spellcheck={false}
                    aria-label="Resume terminal command input"
                    value={termInput()}
                    onInput={(e) => setTermInput(e.currentTarget.value)}
                  />
                </form>
              </div>
            </section>

            <section
              id="resume-panel-pdf"
              role="tabpanel"
              aria-labelledby="resume-tab-pdf"
              hidden={tab() !== "pdf"}
            >
              <div class="resume-toolbar">
                <a href={PDF_HREF} download="robert-nemzek-resume.pdf" class="resume-action-btn accent">
                  Download PDF ↗
                </a>
                <button
                  type="button"
                  class="resume-action-btn"
                  onClick={() => copy(resumeMarkdown, "Markdown")}
                >
                  Copy Markdown
                </button>
                <button type="button" class="resume-action-btn" onClick={() => copy(resumeJson, "JSON")}>
                  Copy JSON
                </button>
              </div>
              <iframe src={PDF_HREF} title="Robert Nemzek — résumé PDF" class="resume-pdf-frame" />
            </section>
          </div>

          <Show when={toast()}>
            {(msg) => (
              <div class="resume-toast" role="status">
                {msg()}
              </div>
            )}
          </Show>
        </aside>
      </Portal>
    </Show>
  );
}
