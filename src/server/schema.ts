import { pgTable, varchar, integer, timestamp, text, boolean } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }),
  repoName: varchar("repo_name", { length: 255 }),
  featured: boolean("featured").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const githubCache = pgTable("github_cache", {
  repoName: varchar("repo_name", { length: 255 }).primaryKey(),
  stars: integer("stars").default(0).notNull(),
  forks: integer("forks").default(0).notNull(),
  openIssues: integer("open_issues").default(0).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});
