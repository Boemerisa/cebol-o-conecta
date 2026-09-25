import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  ssr: {
    noExternal: ["@supabase/supabase-js", "@supabase/functions-js", "tslib"],
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    moduleSideEffects: ["tslib"],
    externals: {
      inline: ["@supabase/supabase-js", "@supabase/functions-js", "tslib"],
    },
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
  },
});
