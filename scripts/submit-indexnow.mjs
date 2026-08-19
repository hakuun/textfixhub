/**
 * Submit all site URLs to IndexNow (Bing/Google/DuckDuckGo fast indexing).
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *
 * Reads the URL list from app/sitemap.ts output via the built sitemap.
 * Key is auto-loaded from public/<key>.txt.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

// --- 1. Load key from the key file in public/ ---
const keyFile = fs
  .readdirSync(publicDir)
  .find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('❌ No IndexNow key file found in public/ (expected 32-hex .txt)');
  process.exit(1);
}
const key = path.basename(keyFile, '.txt');

// --- 2. Read all URLs from the built sitemap ---
const sitemapPath = path.join(__dirname, '..', 'out', 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ out/sitemap.xml not found — run `pnpm build` first');
  process.exit(1);
}
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) =>
  m[1].replace(/&amp;/g, '&')
);
console.log(`📋 Found ${urlList.length} URLs in sitemap`);

// --- 3. Submit to IndexNow ---
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const body = { host: 'www.textfixhub.com', key, keyLocation: `https://www.textfixhub.com/${key}.txt`, urlList };

const res = await fetch(INDEXNOW_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

if (res.ok) {
  console.log(`✅ IndexNow submitted ${urlList.length} URLs (HTTP ${res.status})`);
} else {
  const text = await res.text();
  console.error(`❌ IndexNow failed (HTTP ${res.status}): ${text}`);
  process.exit(1);
}
