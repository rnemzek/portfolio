import { Hono } from "hono";

export const uptimeRouter = new Hono()
  .get("/summary", async (c) => {
    const apiUrl = process.env.UPTIME_API_URL;
    const apiKey = process.env.UPTIME_API_KEY;

    if (!apiUrl) {
      return c.json({ success: false, error: "UPTIME_API_URL not configured" }, 503);
    }

    const res = await fetch(apiUrl, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });

    if (!res.ok) {
      return c.json({ success: false, error: `Upstream error ${res.status}` }, 502);
    }

    const data = await res.json();
    return c.json({ success: true, data });
  });
