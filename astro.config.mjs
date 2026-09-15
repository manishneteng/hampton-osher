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
  // NOTE: `trailingSlash` is intentionally left at its default. Setting it to
  // 'always' made the dev server return 404 for slash-less paths such as
  // /about instead of redirecting them. Cloudflare Pages already normalises
  // trailing slashes in production with a 308, so the default is correct here.
  integrations: [
    sitemap({
      // Stamp each entry so Google sees a stable, meaningful lastmod.
      lastmod: new Date(),
      // Never emit the 404 page as a sitemap entry.
      filter: (page) => !page.includes('404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});