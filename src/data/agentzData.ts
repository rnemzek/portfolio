import type { DrawerContent } from "~/components/TechDrawer";

/**
 * UOW-15: AgentZ Studio (nemzilla-studio) — the Agent Trust Control Plane
 * concept. Unlike StreamZilla/GridZilla, this project is concept/in-development
 * (no public deploy yet), so the 4th tab is `roadmap` rather than `install` —
 * see TechDrawer.tsx's polymorphic-tab support.
 */
export const AGENTZ_CONTENT: DrawerContent = {
  logo: "/agentz-logo.svg",
  title: "AgentZ Studio",
  ariaLabel: "AgentZ Studio tech deep-dive",
  overview: {
    lead: "AgentZ Studio — Conversational Multi-Agent Orchestration & Governance Sandbox",
    summary:
      "A conversational AI Product Owner interviews the visitor, then hands off to a simulated " +
      "multi-agent swarm (Planner → Architect → Lead Dev → Reviewer, plus pluggable domain " +
      "micro-agents) that synthesizes a real, runnable micro-app live in the browser — every step " +
      "audited through a SHA-256 Merkle hash-chained ledger and gated by a governance policy engine.",
    features: [
      {
        name: "Real AI PO, simulated swarm",
        detail:
          "The discovery interview is a genuine Claude Haiku 4.5 call with structured outputs and live tool use (recipe, sports-schedule, and grocery-price lookups); the downstream build pipeline is a deterministic, fully-inspectable simulation — real intelligence at the front door, transparent theater in the pipeline.",
      },
      {
        name: "Cryptographic audit ledger",
        detail:
          "Every agent step, policy check, and generated payload is chained via SHA-256 (Hash_N = SHA256(Hash_N-1 + Timestamp + Payload)) and independently re-verified client-side via the Web Crypto API, not just a server-reported flag.",
      },
      {
        name: "Governance & HITL policy engine",
        detail:
          "A system ceiling (absolute order limits, auto-approve bands, forbidden-operation list) clamps user-defined thresholds server-side, with a human-in-the-loop approval flow for anything above the auto-approve line.",
      },
    ],
  },
  architecture: {
    lead: "Agent Trust Control Plane — the governance shell wrapping every agent action, from intent to audited outcome.",
    diagram: `graph TD
    A[Visitor Intent] --> B[Control Plane]
    B --> C[Policy Evaluator]
    C -->|allowed| D[Execution Sandbox]
    C -->|denied / clamped| F[Governance Alert]
    D --> E[Audit Gate]
    E -->|SHA-256 chain| G[(Merkle Audit Ledger)]
    E --> H[Live SSE Telemetry]`,
    diagramId: "agentz-arch-diagram",
  },
  stack: {
    lead: "Core dependency taxonomy — the four pillars under the hood.",
    dependencies: [
      {
        name: "SolidJS",
        role: "Frontend framework",
        detail:
          "Fine-grained reactivity with zero virtual-DOM overhead, driving live-updating swarm telemetry and floating glassmorphism panels without re-render churn.",
      },
      {
        name: "Hono + streamSSE",
        role: "Real-time server",
        detail:
          "Type-safe server framework streaming agent_step / token_stream / policy_check events over Server-Sent Events to every connected spectator.",
      },
      {
        name: "Anthropic Claude (Haiku 4.5)",
        role: "Intelligence layer",
        detail:
          "Structured-output discovery interviews with live tool use and adaptive, session-scoped preference calibration extracted from visitor critique.",
      },
      {
        name: "SHA-256 Merkle ledger",
        role: "Governance & audit",
        detail:
          "In-memory, non-blocking audit queue chained by SHA-256 and re-verified client-side via the Web Crypto API — tamper-evidence, not just a server-reported badge.",
      },
    ],
  },
  roadmap: {
    lead: "Where AgentZ Studio is headed next — concept-stage items beyond the current build.",
    items: [
      {
        phase: "Conversational swarm engine",
        detail:
          "AI PO discovery interview, pluggable domain micro-agents, Merkle-chained audit ledger, and live governance policy enforcement.",
        status: "done",
      },
      {
        phase: "Floating Command Center & replay inspector",
        detail:
          "Detachable glassmorphism panels, a draggable swarm-replay scrubber, and a click-to-pin step inspector showing sender → receiver, agent output, and per-step latency.",
        status: "done",
      },
      {
        phase: "Adaptive PO memory",
        detail:
          "Session-scoped behavior calibration — visitor critique is extracted into persistent rules injected back into the PO's own system prompt on later turns.",
        status: "in-progress",
      },
      {
        phase: "Multi-tenant trust control plane",
        detail:
          "Promote the governance policy engine into a standalone, embeddable service other agent platforms can call for HITL approval and audit-chain verification.",
        status: "planned",
      },
    ],
  },
};
