import { defineConfig } from 'astro/config';

import netlify from "@astrojs/netlify/functions";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";


export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [react(), tailwind()],
  prefetch: true,
});