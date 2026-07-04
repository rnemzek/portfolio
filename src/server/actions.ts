"use server";

import { db } from "./db";
import { githubCache, projects } from "./schema";
import type { DashboardPayload, ProjectProfile, UptimeSummary } from "~/types/api";

export async function getDashboard(): Promise<DashboardPayload> {
  const [allProjects, allCache] = await Promise.all([
    db.select().from(projects).orderBy(projects.displayOrder),
    db.select().from(githubCache),
  ]);

  const cacheMap = new Map(allCache.map((r) => [r.repoName, r]));

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
      // Degrade gracefully
    }
  }

  return { projects: projectProfiles, uptime };
}
