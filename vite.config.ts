// Replaces the @lovable.dev/vite-tanstack-config wrapper.
// That wrapper defaults nitro's build target to Cloudflare Workers, which is
// not runnable as a plain Node server — this repo now deploys via Docker on
// Coolify like synkra-client-hub, so it needs the same plain, Node-targeted
// TanStack Start config that client-hub uses.
//
// Known tradeoff: the wrapper also included Lovable's componentTagger
// (dev-only, enables click-to-select in Lovable's visual editor). There is
// no standalone lovable-tagger package in this repo to reinstate it
// separately. Lovable can still edit this code as text/AI-assisted edits;
// only the click-to-select-in-preview convenience may be affected. Confirm
// in Lovable after this change lands, and reintroduce a standalone tagger
// plugin here if Lovable's docs offer one.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Preserve the original repo's custom server entry (src/server.ts).
      server: { entry: "server" },
    }),
    react(),
    tsConfigPaths(),
  ],
});
