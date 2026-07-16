import { Hono } from "hono";
import { projectsRouter } from "./routes/projects";
import { uptimeRouter } from "./routes/uptime";
import { metricsRouter } from "./routes/metrics";
import { SECURITY_HEADERS } from "./security";

export const app = new Hono().basePath("/api")
  .use(async (c, next) => {
    await next();
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      c.header(name, value);
    }
  })
  .route("/projects", projectsRouter)
  .route("/uptime", uptimeRouter)
  .route("/metrics", metricsRouter);

export type AppType = typeof app;
