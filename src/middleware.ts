import { createMiddleware } from "@solidjs/start/middleware";
import { SECURITY_HEADERS } from "./server/security";

// Applies the strict security header set to every SolidStart-rendered
// response (pages, assets). API responses get the same set from the Hono
// middleware in src/server/hono.ts — both read from one shared definition.
export default createMiddleware({
  onBeforeResponse: (event) => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      event.response.headers.set(name, value);
    }
  },
});
