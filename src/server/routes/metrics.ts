import { Hono } from "hono";
import { db } from "../db";
import { githubCache, projects } from "../schema";
import type { DashboardPayload, ProjectProfile, UptimeSummary } from "~/types/api";
import { isCacheStale, revalidateRepoStats } from "../services/github";
import { getStreamingStatus } from "../services/streaming";

export const metricsRouter = new Hono()
  .get("/dashboard", async (c) => {
    const [allProjects, allCache] = await Promise.all([
      db.select().from(projects).orderBy(projects.displayOrder),
      db.select().from(githubCache),
    ]);

    const cacheMap = new Map(allCache.map((r) => [r.repoName, r]));

    // Stale-while-revalidate: serve whatever is cached immediately; kick off
    // background refreshes for missing or expired entries (deduped and
    // rate-limit-aware inside the service).
    for (const p of allProjects) {
      if (!p.repoName) continue;
      const cached = cacheMap.get(p.repoName);
      if (!cached || isCacheStale(cached.lastUpdated)) revalidateRepoStats(p.repoName);
    }

    const projectProfiles: ProjectProfile[] = allProjects.map((p) => {
      const cached = p.repoName ? cacheMap.get(p.repoName) : null;
      return {
        ...p,
        description: p.description ?? null,
        url: p.url ?? null,
        repoName: p.repoName ?? null,
        metrics: cached
          ? { ...cached, lastUpdated: cached.lastUpdated.toISOString() }
          : null,
      };
    });

    // StreamZilla origin probe — memoized in the service, degrades to offline
    const streaming = await getStreamingStatus().catch(() => null);

    // Attempt uptime fetch — degrade gracefully on failure
    let uptime: UptimeSummary | null = null;
    const uptimeUrl = process.env.UPTIME_API_URL;
    if (uptimeUrl) {
      try {
        const res = await fetch(uptimeUrl, {
          headers: process.env.UPTIME_API_KEY
            ? { Authorization: `Bearer ${process.env.UPTIME_API_KEY}` }
            : {},
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) uptime = (await res.json()) as UptimeSummary;
      } catch {
        // Non-fatal — uptime panel just shows unavailable
      }
    }

    const payload: DashboardPayload = { projects: projectProfiles, uptime, streaming };
    return c.json({ success: true, data: payload });
  });
