import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const githubCache = pgTable('github_cache', {
  repoName: varchar('repo_name', { length: 255 }).primaryKey(),
  stars: integer('stars').default(0).notNull(),
  forks: integer('forks').default(0).notNull(),
  openIssues: integer('open_issues').default(0).notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

