export interface RepoMetrics {
  repoName: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdated: string;
}

export interface ProjectProfile {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  repoName: string | null;
  featured: boolean;
  displayOrder: number;
  metrics: RepoMetrics | null;
}

export interface UptimeSummary {
  status: string;
  uptimePercent?: number;
  lastChecked?: string;
}

export interface DashboardPayload {
  projects: ProjectProfile[];
  uptime: UptimeSummary | null;
}
