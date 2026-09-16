// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';
import { execFileSync } from 'node:child_process';

// ---------------------------------------------------------------------------
// Sitemap <lastmod> strategy
//
// Google only trusts <lastmod> when it changes for genuine reasons. A blanket
// `new Date()` stamps every URL on every deploy - including deploys that touch
// no content at all - which teaches Google to ignore the field.
//
// Instead we resolve the last commit date of the source files behind each
// page. This is a hint, never a correctness requirement: CI checkouts are
// sometimes shallow, so if git cannot answer we fall back to the build time
// rather than emit a wrong date. The build never fails on a missing git.
// ---------------------------------------------------------------------------
const gitLastModified = (filePath) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? new Date(out) : null;
  } catch {
    return null;
  }
};

const buildDate = new Date();

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
      // Never emit the 404 page as a sitemap entry.
      filter: (page) => !page.includes('404'),
      serialize(item) {
        // Map the page URL back to the .astro source that produced it.
        const path = new URL(item.url).pathname.replace(/^\/|\/$/g, '');
        const sources = [
          path ? `src/pages/${path}.astro` : 'src/pages/index.astro',
          // Every page renders through the shared layout, so a layout edit is
          // a genuine content change for every page it wraps.
          'src/layouts/Layout.astro',
        ];

        let newest = null;
        for (const file of sources) {
          const d = gitLastModified(file);
          if (d && (!newest || d > newest)) newest = d;
        }

        return { ...item, lastmod: (newest ?? buildDate).toISOString() };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
