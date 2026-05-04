/**
 * ping-indexing.mjs
 *
 * Pings IndexNow (Bing/Yandex/others) after each deploy to request immediate
 * re-indexing of all portfolio URLs.
 *
 * Usage:
 *   INDEXNOW_KEY=<your-key> node scripts/ping-indexing.mjs
 *
 * Bing distributes the notification to other IndexNow participants automatically.
 * Google does not participate in IndexNow — use Google Search Console for that.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildPortfolioUrls,
  normalizeHomepage,
} from '../src/sectionRegistry.js';

const KEY = process.env.INDEXNOW_KEY;
if (!KEY) {
  console.error('Error: INDEXNOW_KEY environment variable is not set.');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'data.json'), 'utf-8'));
const baseUrl = normalizeHomepage(data.brand.homepage);
const host = new URL(baseUrl).host;
const urlList = buildPortfolioUrls(data);

const payload = {
  host,
  key: KEY,
  keyLocation: `${baseUrl}/${KEY}.txt`,
  urlList,
};

const response = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

if (response.ok || response.status === 202) {
  console.log(`✓ IndexNow ping accepted (HTTP ${response.status}) for ${urlList.length} URLs.`);
} else {
  const body = await response.text();
  console.error(`✗ IndexNow ping failed: HTTP ${response.status}\n${body}`);
  process.exit(1);
}
