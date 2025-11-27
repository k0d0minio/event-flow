import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  target: "es2022",
  outDir: "dist",
  external: ["react", "react-dom", "@ef/ui", "@ef/db/client"],
  banner: {
    js: '"use client";',
  },
});
