import { db } from "../db";
import { githubCache } from "../schema";

const GITHUB_API = "https://api.github.com";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

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

  const res = await fetch(`${GITHUB_API}/repos/${username}/${repoName}`, { headers });
  if (!res.ok) throw new Error(`GitHub API error ${res.status} for ${repoName}`);

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
