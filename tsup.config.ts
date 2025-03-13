import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  dts: false,
  minify: true,
  splitting: false,
  sourcemap: false,
  target: "node16",
  platform: "node",
});
