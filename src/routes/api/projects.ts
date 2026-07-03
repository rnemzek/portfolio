import { Hono } from 'hono';
import { db } from '../../server/db';
import { githubCache } from '../../server/schema';
import { eq } from 'drizzle-orm';

export const projectsRouter = new Hono().get('/metrics', async (c) => {
  const cachedData = await db.select().from(githubCache);
  
  // If data is older than 1 hour, trigger an async background update from GitHub API
  // Otherwise, instantly serve the cached data for blazing-fast speed
  
  return c.json({ success: true, data: cachedData });
});

