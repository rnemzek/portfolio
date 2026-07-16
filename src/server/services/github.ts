import { db } from "../db";
import { githubCache } from "../schema";

const GITHUB_API = "https://api.github.com";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_FALLBACK_BACKOFF_MS = 15 * 60 * 1000;

// SWR bookkeeping: dedupe concurrent refreshes per repo, and stop calling
// GitHub entirely while rate-limited — stale cache keeps serving the UI.
const inFlight = new Map<string, Promise<void>>();
let rateLimitedUntil = 0;

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

export async function fetchAndCacheRepoStats(repoName: string): Promise<void> {
  const token = process.env.GITHUB_PAT;
  const username = process.env.GITHUB_USERNAME ?? "rnemzek";
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // repoName may already be qualified ("owner/repo") or bare ("repo")
  const fullName = repoName.includes("/") ? repoName : `${username}/${repoName}`;
  const res = await fetch(`${GITHUB_API}/repos/${fullName}`, { headers });

  if (res.status === 403 || res.status === 429) {
    const resetEpoch = Number(res.headers.get("x-ratelimit-reset"));
    rateLimitedUntil = resetEpoch > 0 ? resetEpoch * 1000 : Date.now() + RATE_LIMIT_FALLBACK_BACKOFF_MS;
    throw new Error(
      `GitHub rate limited (${res.status}) for ${fullName}; backing off until ${new Date(rateLimitedUntil).toISOString()}`,
    );
  }
  if (!res.ok) throw new Error(`GitHub API error ${res.status} for ${fullName}`);

  const data: GitHubRepo = await res.json();

  await db
    .insert(githubCache)
    .values({
      repoName,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      lastUpdated: new Date(),
    })
    .onConflictDoUpdate({
      target: githubCache.repoName,
      set: {
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        lastUpdated: new Date(),
      },
    });
}

export function isCacheStale(lastUpdated: Date): boolean {
  return Date.now() - lastUpdated.getTime() > CACHE_TTL_MS;
}

/**
 * Fire-and-forget stale-while-revalidate refresh. Deduplicates concurrent
 * refreshes per repo and skips GitHub entirely during a rate-limit backoff
 * window, so request bursts can never exhaust the quota or break the UI —
 * readers always get the cached row that is already in Postgres.
 */
export function revalidateRepoStats(repoName: string): void {
  if (Date.now() < rateLimitedUntil || inFlight.has(repoName)) return;
  const task = fetchAndCacheRepoStats(repoName)
    .catch((err) => console.error("[github-swr] background refresh failed:", err))
    .finally(() => inFlight.delete(repoName));
  inFlight.set(repoName, task);
}
