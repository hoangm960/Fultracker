import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://hoangm960.github.io',
  base: '/Fultracker',
  adapter: node({
    mode: 'standalone'
  }),
}); 
