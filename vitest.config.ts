import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    server: {
      deps: {
        inline: ["server-only"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "server-only": path.resolve(__dirname, "tests/__mocks__/server-only.ts"),
    },
  },
});
