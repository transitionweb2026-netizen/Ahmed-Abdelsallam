import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      // The real package unconditionally throws on import — Next's own
      // bundler aliases it away server-side at build time; vitest runs
      // plain Node, so it needs the same stand-in to import server-only
      // modules at all (see tests/stubs/server-only.ts).
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    // PGlite boots a full Postgres per test file.
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
});
