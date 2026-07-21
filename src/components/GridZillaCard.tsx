import { For, createSignal } from "solid-js";
import { TechDrawer, type DrawerContent } from "~/components/TechDrawer";

const TECH_STACK = ["React", "Vite", "Node.js", "Express", "SQLite", "Leaflet"];

const GRIDZILLA_CONTENT: DrawerContent = {
  logo: "/gridzilla-icon.svg",
  title: "GridZilla ēvolvere",
  ariaLabel: "GridZilla ēvolvere tech deep-dive",
  overview: {
    lead: "GridZilla ēvolvere — High-Performance EV Charging Registry & Spatial Engine",
    summary:
      "A privacy-first, offline-capable EV infrastructure registry and grid intelligence platform " +
      "rendering 83,000+ national station records via HTML5 canvas rasterization.",
    features: [
      {
        name: "Dual-Coordinate Precision",
        detail:
          "Dual-coordinate schema (afdc_* vs. geocoded_*) enforcing hierarchical precision ranking (NATIVE_GPS > ROOFTOP_INTERPOLATED > ZIP_CENTROID).",
      },
      {
        name: "Canvas Marker Rasterization",
        detail:
          "Sub-second rendering of 83k+ stations with zero DOM bloat using Leaflet Canvas renderer capped at active viewport thresholds.",
      },
      {
        name: "Sticky Popup Telemetry",
        detail:
          "Native Leaflet popups displaying network operator, connector types (Tesla, J1772, CCS), max power kW, and station access hours.",
      },
    ],
  },
  architecture: {
    lead:
      "End-to-end system architecture — an AFDC-sourced registry synced through a geocoding pipeline into SQLite, served by an Express API, and rendered client-side with Leaflet Canvas.",
    diagram: `graph TD
    A[AFDC Registry developer.nlr.gov] --> B[Sync Engine afdcIngest.js]
    B --> C[Geocode Engine geocodeEngine.js]
    C --> D[(SQLite stations.db)]
    D --> E[Express REST API /api/v1]
    E --> F[React + Vite Frontend]
    F --> G[HTML5 Canvas Leaflet Renderer]`,
    diagramId: "gz-arch-diagram",
  },
  stack: {
    lead: "Core dependency taxonomy — the four pillars under the hood.",
    dependencies: [
      {
        name: "React & Vite",
        role: "Frontend framework",
        detail: "Modern reactive frontend bundled with lightning-fast Vite tooling.",
      },
      {
        name: "Node.js & Express",
        role: "API server",
        detail: "REST/Bounding-box spatial API serving query filtered endpoints.",
      },
      {
        name: "SQLite (stations.db)",
        role: "Storage engine",
        detail: "Embedded database with dual-coordinate tracking and custom spatial index optimization.",
      },
      {
        name: "Leaflet Canvas",
        role: "Rendering engine",
        detail: "High-density map rendering engine rasterizing stations directly to HTML5 canvas.",
      },
    ],
  },
  install: {
    lead: "Install GridZilla ēvolvere on your home screen — no App Store required.",
    steps: [
      {
        step: "Open grid.nemzilla.net in Safari on your iPhone or iPad.",
        hint: "Safari is required — Add to Home Screen is a Safari feature.",
      },
      {
        step: "Tap the Share button (the square with an arrow) in the toolbar.",
        hint: "Bottom bar on iPhone, top-right on iPad.",
      },
      { step: "Scroll down and tap “Add to Home Screen”." },
      {
        step: "Tap “Add” — GridZilla appears on your home screen like a native app.",
        hint: "Launches full-screen with its own icon, no browser chrome.",
      },
    ],
  },
};

export function GridZillaCard() {
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
            src="/gridzilla-icon.svg"
            alt=""
            width="34"
            height="34"
            class="sz-logo"
            aria-hidden="true"
          />
          {/* Stretched link: ::after covers the card, so the whole surface navigates */}
          <a
            href="https://grid.nemzilla.net"
            target="_blank"
            rel="noopener noreferrer"
            class="sz-name"
          >
            GridZilla ēvolvere
          </a>
          <span class="status-badge online">
            <span class="sz-pulse" aria-hidden="true" /> Live
          </span>
        </div>
        <ul class="sz-stack" aria-label="GridZilla tech stack">
          <For each={TECH_STACK}>{(tech) => <li class="sz-pill">{tech}</li>}</For>
        </ul>
        <p class="sz-tagline">
          High-performance EV charging registry, spatial locator, and real-time grid intelligence
          platform with dual-coordinate spatial precision.
        </p>
        <div class="sz-footer">
          <button
            class="sz-deepdive"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
          >
            Tech deep-dive
          </button>
          <a
            href="https://grid.nemzilla.net"
            target="_blank"
            rel="noopener noreferrer"
            class="sz-cta-link"
          >
            Launch grid.nemzilla.net ↗
          </a>
        </div>
      </div>
      <TechDrawer open={drawerOpen()} onClose={() => setDrawerOpen(false)} content={GRIDZILLA_CONTENT} />
    </div>
  );
}
