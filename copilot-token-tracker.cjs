#!/usr/bin/env node
/**
 * Copilot Token Tracker
 * Estimates token usage across the project.
 * Run: node copilot-token-tracker.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Patterns to ignore (matches .copilotignore logic)
const IGNORE_DIRS = new Set([
  'node_modules', 'dist', '.astro', '.next', 'build', 'coverage',
  '.cache', '.vercel', '.output', '.git', '.agents-refs'
]);

const IGNORE_EXTS = new Set([
  '.map', '.log', '.txt', '.trace', '.tmp', '.temp', '.lock',
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot', '.otf'
]);

let totalChars = 0;
let totalFiles = 0;
const folderStats = {};

function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
      walk(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (IGNORE_EXTS.has(ext)) continue;
      if (entry.name === 'package-lock.json' || entry.name.endsWith('.map')) continue;

      try {
        const stats = fs.statSync(fullPath);
        const chars = stats.size; // rough: bytes ≈ chars for UTF-8 text
        const tokens = Math.round(chars / 4);
        totalChars += chars;
        totalFiles++;

        const folder = relPath.split('/')[0] || '(root)';
        if (!folderStats[folder]) folderStats[folder] = { chars: 0, files: 0 };
        folderStats[folder].chars += chars;
        folderStats[folder].files++;
      } catch { /* skip unreadable */ }
    }
  }
}

console.log('══════════════════════════════════════════════');
console.log('  Copilot Token Usage Estimator');
console.log('══════════════════════════════════════════════\n');

walk(ROOT);

const totalTokens = Math.round(totalChars / 4);

console.log(`  Total files scanned:    ${totalFiles}`);
console.log(`  Total characters:       ${totalChars.toLocaleString()}`);
console.log(`  Estimated tokens:       ${totalTokens.toLocaleString()}\n`);

console.log('─── Top Token-Consuming Folders ───\n');

const sorted = Object.entries(folderStats)
  .sort((a, b) => b[1].chars - a[1].chars);

for (const [folder, stats] of sorted) {
  const pct = ((stats.chars / totalChars) * 100).toFixed(1);
  const tokens = Math.round(stats.chars / 4);
  console.log(`  ${folder}/`);
  console.log(`    Files: ${stats.files}  |  Chars: ${stats.chars.toLocaleString()}  |  Est. Tokens: ${tokens.toLocaleString()}  (${pct}%)`);
}

console.log('\n─── Recommendations ───\n');

const bigFolders = sorted.filter(([, s]) => (s.chars / totalChars) * 100 > 10);
if (bigFolders.length > 0) {
  console.log('  Folders >10% of context:');
  for (const [folder] of bigFolders) {
    console.log(`    - ${folder}/  →  Consider adding to .copilotignore`);
  }
} else {
  console.log('  No single folder exceeds 10% — good distribution.');
}

console.log(`\n  Total tokens (est.): ~${(totalTokens / 1000).toFixed(0)}K`);
console.log(`  @ 100K context window: ${((totalTokens / 100000) * 100).toFixed(1)}% of window`);
console.log('\n══════════════════════════════════════════════');
