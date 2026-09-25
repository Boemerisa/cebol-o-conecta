import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
    externals: {
      inline: [
        "tslib",
        "@supabase/supabase-js",
        "@supabase/functions-js",
        "@supabase/postgrest-js",
        "@supabase/realtime-js",
        "@supabase/storage-js",
        "@supabase/auth-js",
      ],
      trace: false,
    },
  },
});
