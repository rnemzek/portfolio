import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  middleware: "src/middleware.ts",
  server: {
    preset: "node-server",
    // Pre-generate gzip + brotli variants of all static assets at build time
    compressPublicAssets: true,
  },
});
