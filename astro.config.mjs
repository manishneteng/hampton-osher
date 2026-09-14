// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Canonical production origin. This drives the URLs emitted in the
  // generated sitemap, so the Cloudflare Pages preview domain
  // (*.pages.dev) can never appear in it.
  site: 'https://osher.hamptonu.edu',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});