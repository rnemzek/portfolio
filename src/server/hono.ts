import { Hono } from "hono";
import { projectsRouter } from "./routes/projects";
import { uptimeRouter } from "./routes/uptime";
import { metricsRouter } from "./routes/metrics";

export const app = new Hono().basePath("/api")
  .route("/projects", projectsRouter)
  .route("/uptime", uptimeRouter)
  .route("/metrics", metricsRouter);

export type AppType = typeof app;
