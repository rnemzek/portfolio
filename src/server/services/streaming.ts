import type { StreamingStatus } from "~/types/api";

const STREAMING_URL = process.env.STREAMING_URL ?? "https://streaming.nemzilla.net";
const PROBE_TTL_MS = 30_000;
const PROBE_TIMEOUT_MS = 1_500;

let cached: StreamingStatus | null = null;
let cachedAt = 0;

/**
 * Probes the StreamZilla origin with a short timeout and caches the result
 * in memory, so dashboard requests never block on a slow/offline upstream
 * for more than PROBE_TIMEOUT_MS, and at most once per PROBE_TTL_MS window.
 */
export async function getStreamingStatus(): Promise<StreamingStatus> {
  if (cached && Date.now() - cachedAt < PROBE_TTL_MS) return cached;

  const started = Date.now();
  let online = false;
  let latencyMs: number | null = null;
  try {
    const res = await fetch(STREAMING_URL, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    // Any non-5xx response means the origin is up (405s on HEAD still count)
    online = res.status < 500;
    latencyMs = Date.now() - started;
  } catch {
    // DNS failure, refused connection, or timeout — offline
  }

  cached = { online, latencyMs, checkedAt: new Date().toISOString() };
  cachedAt = Date.now();
  return cached;
}
