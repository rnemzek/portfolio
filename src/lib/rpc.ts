import { hc } from "hono/client";
import type { AppType } from "~/server/hono";

// During SSR, requests short-circuit into the in-process Hono app (no self-HTTP
// hop); in the browser, relative URLs resolve against the page origin. The
// dynamic server import lives behind an SSR guard so it is dead-code-eliminated
// from the client bundle.
const rpcFetch: typeof fetch = async (input, init) => {
  if (import.meta.env.SSR) {
    const { app } = await import("~/server/hono");
    return app.fetch(new Request(input, init));
  }
  return fetch(input, init);
};

export const rpc = hc<AppType>(import.meta.env.SSR ? "http://ssr.internal" : "", {
  fetch: rpcFetch,
});
