/**
 * One-off image optimization for the OLLI site.
 *
 * For every raster image under src/images (except Course Catalog scans, which are
 * full-bleed pages read at up to 2000px tall), this:
 *   1. Downscales to a sensible max width for the largest size the image is ever
 *      rendered at (2x the CSS box), never upscaling.
 *   2. Strips metadata (EXIF/ICC/thumbnails) which are large and unused.
 *   3. Writes a compressed original (matching its format) and a WebP sibling.
 *
 * Originals are never deleted — they stay in place so the change is reversible.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'src', 'images');

// Largest CSS width each image is displayed at, x2 for high-DPI screens.
// Keyed by path relative to src/images (posix separators). Unlisted = no resize.
const TARGET_WIDTH = {
  'GroupPhotos/Group31.jpg': 2000, // wide community banner, full 7xl-width container
  'GroupPhotos/Group33.jpg': 1600,
  'GroupPhotos/Group34.jpg': 1600,
  'GroupPhotos/Group30.jpeg': 1600,
  'GroupPhotos/Group32.jpg': 1600,
  'GroupPhotos/Group29.jpeg': 1600,
  'GroupPhotos/Group39.jpeg': 1600,
  'GroupPhotos/Group26.png': 1600, // half-width card tiles
  'GroupPhotos/Group24.png': 1600,
  'GroupPhotos/Group48.png': 1200,
  'GroupPhotos/Group47.png': 1200,
  'GroupPhotos/Group42.jpeg': 1200,
  'GroupPhotos/Group6.jpeg': 1200,
  'GroupPhotos/Group5.jpeg': 1200,
  'GroupPhotos/Group4.jpeg': 1200,
  'GroupPhotos/Group3.jpeg': 1200,
  'GroupPhotos/Group15.jpg': 1200,
  'GroupPhotos/Group14.jpg': 1200,
  'GroupPhotos/Group13.jpg': 1200,
  'GroupPhotos/Group2.jpeg': 1200,
  'GroupPhotos/Group9.jpeg': 1200,
  'GroupPhotos/Group25.png': 1200,
  'GroupPhotos/Group36.jpeg': 1200,
  'GroupPhotos/Group41.png': 1200,
  'GroupPhotos/Group37.png': 1200,
  'GroupPhotos/Group8.jpeg': 1200,
  'GroupPhotos/Group1.jpeg': 1200,
  'GroupPhotos/Group21.png': 1200,
  'GroupPhotos/Group23.jpg': 1000,
  'GroupPhotos/Group16.jpg': 1000,
  'GroupPhotos/Group17.jpeg': 1000,
  'GroupPhotos/Group11.jpeg': 1000,
  'GroupPhotos/Group35.jfif': 1000,
  'GroupPhotos/Group18.jpg': 800,
  'GroupPhotos/Group20.jpg': 800,
  'GroupPhotos/Group10.jpg': 1024, // native width; rendered slightly wider, do not shrink
  'GroupPhotos/Group12.jpg': 1600, // full-width panorama banner
  'GroupPhotos/Group22.png': 800,
  'GroupPhotos/Group25.jpg': 800,
  'GroupPhotos/Group7.jpg': 800,
  'GroupPhotos/Group27.jpg': 600,
  'GroupPhotos/Group28.jpg': 600,
  'GroupPhotos/Group40.jpg': 600,
  'GroupPhotos/Group43.jpg': 600,
  'GroupPhotos/Group44.jpeg': 600,
  'GroupPhotos/Group45.jpg': 600,
  'GroupPhotos/Group46.jpg': 600,
  'SpotlightMember.png': 1200,
  'HeroBG.png': 2000, // full-bleed blurred hero backgrounds
  'AboutBG.png': 2000,
  'CoursesBG.png': 2000,
  'FaqBG.png': 2000,
  'TravelBG.png': 2000,
  'DonorsBG.png': 2000,
  'WaystoGiveBG.png': 2000,
  'Strip1.png': 1600,
  'Strip2.png': 800,
  'Strip3.png': 800,
  'Strip4.jpg': 800,
  'Strip5.jpg': 1200,
  'Strip6.png': 1200,
  'Trip1.png': 760, // 3:4 trip tiles; 4 shown at once on desktop
  'Trip2.png': 760,
  'Trip3.png': 760,
  'Trip4.png': 760,
  'Trip5.png': 760,
  'Trip6.png': 760,
  'Vendor7.png': 500, // square vendor tiles, up to 9 across
  'Vendor8.png': 360,
  'Vendor9.png': 360,
  'HULogo.png': 400,
  'Osher20Logo.png': 400,
};

const isCatalog = (rel) => rel.startsWith('CourseCatalog/');

async function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (/\.(png|jpe?g|jfif|webp|avif)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const kb = (n) => `${(n / 1024).toFixed(1)}KB`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Windows file watchers / antivirus can briefly lock a file mid-write.
// Write to a temp file next to the target, then atomically rename it into place.
async function writeWithRetry(dest, buffer, attempts = 12) {
  const tmp = `${dest}.tmp-${process.pid}`;
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      fs.writeFileSync(tmp, buffer);
      fs.rmSync(dest, { force: true });
      fs.renameSync(tmp, dest);
      return;
    } catch (e) {
      lastErr = e;
      try {
        fs.rmSync(tmp, { force: true });
      } catch {}
      await sleep(200 * (i + 1));
    }
  }
  throw lastErr;
}

(async () => {
  const files = await walk(IMAGES);
  let beforeTotal = 0;
  let afterTotal = 0;
  let webpTotal = 0;
  const report = [];
  const skipped = [];

  for (const file of files) {
    const rel = path.relative(IMAGES, file).replace(/\\/g, '/');
    const before = fs.statSync(file).size;

    // Already optimized? (a webp sibling exists and the source is under 1/4 the
    // size sharp would produce at full resolution) - skip to keep re-runs cheap.
    const webpPath = file.replace(/\.[^.]+$/, '.webp');
    const meta = await sharp(file).metadata();
    const target = isCatalog(rel) ? null : TARGET_WIDTH[rel];
    const needsResize = target && meta.width > target;
    if (!needsResize && fs.existsSync(webpPath)) {
      beforeTotal += before;
      afterTotal += before;
      webpTotal += fs.statSync(webpPath).size;
      skipped.push(rel);
      continue;
    }

    beforeTotal += before;

    // Compress the original in place, preserving its format and any transparency.
    let pipe = sharp(file, { failOn: 'none' }).rotate();
    if (needsResize) pipe = pipe.resize({ width: target, withoutEnlargement: true });
    if (meta.format === 'png') {
      pipe = pipe.png({ compressionLevel: 9, effort: 10, palette: !meta.hasAlpha });
    } else {
      pipe = pipe.jpeg({ quality: 82, mozjpeg: true, progressive: true });
    }
    const out = await pipe.toBuffer();
    // Only replace the source if we actually made it smaller.
    if (out.length < before) await writeWithRetry(file, out);

    // Emit a WebP sibling for browsers (referenced by the pages).
    const webp = await sharp(file, { failOn: 'none' })
      .rotate()
      .webp({ quality: 78, alphaQuality: 90, effort: 6 })
      .toBuffer();
    await writeWithRetry(webpPath, webp);

    const after = fs.statSync(file).size;
    afterTotal += after;
    webpTotal += webp.length;
    report.push({
      rel,
      dims: `${meta.width}x${meta.height}${needsResize ? ` -> ${target}px wide` : ''}`,
      before,
      after,
      webp: webp.length,
    });
  }

  report.sort((a, b) => b.before - a.before);
  console.log('file\tdims\tbefore\tafter\twebp\tsaved');
  for (const r of report) {
    const saved = ((1 - r.webp / r.before) * 100).toFixed(1);
    console.log(`${r.rel}\t${r.dims}\t${kb(r.before)}\t${kb(r.after)}\t${kb(r.webp)}\t-${saved}% vs orig`);
  }
  console.log('\nTOTAL before:', kb(beforeTotal));
  console.log('TOTAL resized originals:', kb(afterTotal));
  console.log('TOTAL webp:', kb(webpTotal));
  if (skipped.length) console.log(`\nSkipped (already optimized): ${skipped.length}`);
})();
