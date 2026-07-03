# Project Plan: nemzilla.net Portfolio Hub

## UOW 01: Environment Initialization & Core Scaffolding
- [ ] Task 1.1 - Initialize a blank SolidStart project using TypeScript and Vite.
- [ ] Task 1.2 - Install Hono, Drizzle ORM, and pg/postgres driver dependencies.
- [ ] Task 1.3 - Generate `.env.sample` containing database connection keys, environment modes, and GITHUB_PAT token definitions.
- [ ] Task 1.4 - UOW 01 COMPLETE

## UOW 02: Database Schema & GitHub Cache Layer
- [ ] Task 2.1 - Build `/src/server/schema.ts` to map project metadata and the `github_cache` table.
- [ ] Task 2.2 - Configure Drizzle client in `/src/server/db.ts` utilizing connection parameters.
- [ ] Task 2.3 - Verify local type generation works flawlessly via Drizzle-kit commands.
- [ ] Task 2.4 - UOW 02 COMPLETE

## UOW 03: Unified Hono Routing & External Sync APIs
- [ ] Task 3.1 - Stand up a base Hono instance inside `/src/routes/api/` matching your architecture.
- [ ] Task 3.2 - Build an async service to fetch repo statistics from GitHub's REST API and commit them to the Drizzle cache.
- [ ] Task 3.3 - Expose a proxy route that reads uptime summaries from your existing SOC2 engine framework.
- [ ] Task 3.4 - Expose a type-safe RPC endpoint combining metrics and project profiles for the UI.
- [ ] Task 3.5 - UOW 03 COMPLETE

## UOW 04: Elegant SolidJS Component Layout
- [ ] Task 4.1 - Create the index view displaying your branding, background, and projects grid.
- [ ] Task 4.2 - Implement prominent custom cards that route directly to `https://nemzilla.net` showing dynamic status badges.
- [ ] Task 4.3 - Refine UI styles to provide immediate load times with zero Virtual-DOM lag.
- [ ] Task 4.4 - UOW 04 COMPLETE

