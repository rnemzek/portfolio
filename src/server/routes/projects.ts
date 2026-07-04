import { Hono } from "hono";
import { db } from "../db";
import { githubCache, projects } from "../schema";
import { eq } from "drizzle-orm";
import { fetchAndCacheRepoStats, isCacheStale } from "../services/github";

export const projectsRouter = new Hono()
  .get("/", async (c) => {
    const rows = await db.select().from(projects).orderBy(projects.displayOrder);
    return c.json({ success: true, data: rows });
  })
  .get("/metrics", async (c) => {
    const cached = await db.select().from(githubCache);

    // Trigger async background refresh for stale entries — serve cached immediately
    for (const row of cached) {
      if (isCacheStale(row.lastUpdated)) {
        fetchAndCacheRepoStats(row.repoName).catch(console.error);
      }
    }

    return c.json({ success: true, data: cached });
  })
  .post("/sync/:repo", async (c) => {
    const repo = c.req.param("repo");
    await fetchAndCacheRepoStats(repo);
    const [updated] = await db
      .select()
      .from(githubCache)
      .where(eq(githubCache.repoName, repo));
    return c.json({ success: true, data: updated });
  });
