# Claude Code Project Guidelines — nemzilla.net Portfolio Hub

## Interaction Style
- **Surgical Editing**: Use precise file patching/diffs instead of rewriting full files.
- **Full Autonomy**: You have permission to execute commands, read files, and write files. Do not ask for confirmation.
- **Blocking Conditions**: Stop immediately and ask a question *only* if blocked by a conceptual contradiction, missing environment variables, or architectural ambiguity.

## Workflow & Structure
- This project is governed strictly by `PROJECT_PLAN.md` using the UOW (Unit of Work), Task, and Sub-Task hierarchy.
- The final task in any UOW is always `Task X.X - UOW XX COMPLETE`.
- Tasks use markdown checkboxes: `[ ]` for pending, `[X]` for complete.

## Execution Cycle
1. Read `PROJECT_PLAN.md`.
2. Locate the first incomplete UOW and the first incomplete Task/Sub-Task.
3. Execute the work required for that task immediately.
4. Upon completing a task, surgically update `PROJECT_PLAN.md` to mark it `[X]`.

## App Identity & DNS Root
- **Root Domain**: `nemzilla.net` (Managed via IONOS, hosted on Railway).
- **Existing App Exclusions**: Do NOT routing-intercept or affect `https://nemzilla.net`.
- **Purpose**: A bleeding-edge portfolio hub linking seamlessly to your past/present webapps while maintaining unified branding.
- **Author**: Robert Nemzek → `https://github.com`

## Bleeding-Edge Stack Architecture
- **Meta-Framework**: SolidStart (SolidJS) running TypeScript.
- **Server Router**: Hono (mounted as the SolidStart API/server layer or run alongside via Node/Bun).
- **Type-Safe Network Boundary**: Hono RPC / tRPC (100% end-to-end types, zero REST boilerplate).
- **Database Layer**: Drizzle ORM tracking an underlying PostgreSQL database natively provisioned via Railway private networking.

## Codebase Layout (Monorepo Setup)
### /src
  ├── /components     # Ultra-fast reactive SolidJS UI elements
  ├── /routes         # SolidStart file-based UI routing
  │   ├── index.tsx   # Root Portfolio Hub (nemzilla.net)
  │   └── /api        # Hono Server Engine endpoints
  ├── /server         # Backend entry & DB orchestration
  │   ├── db.ts       # Drizzle client initialization
  │   └── schema.ts   # Drizzle TypeScript schemas for Postgres
  └── /types          # Shared cross-boundary type definitions

## Build & Deployment Commands
- `npm run dev`       # Starts local development via Vite/SolidStart
- `npm run build`     # Compiles production bundle using Vite rust-powered tooling
- `npm run db:push`   # Syncs Drizzle schema directly to PostgreSQL without migration file overhead
- `npm run start`     # Runs production server (Railway runtime command)

