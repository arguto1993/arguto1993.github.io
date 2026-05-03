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

const KEY = process.env.INDEXNOW_KEY;
if (!KEY) {
  console.error('Error: INDEXNOW_KEY environment variable is not set.');
  process.exit(1);
}

const HOST = 'arguto1993.github.io';
const BASE_URL = `https://${HOST}`;

const urlList = [
  `${BASE_URL}/`,
  `${BASE_URL}/#about`,
  `${BASE_URL}/#skills`,
  `${BASE_URL}/#experience`,
  `${BASE_URL}/#projects`,
  `${BASE_URL}/#education`,
  `${BASE_URL}/#contact`,
];

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `${BASE_URL}/${KEY}.txt`,
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
