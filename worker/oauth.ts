/**
 * Cloudflare Worker — GitHub OAuth code exchange.
 *
 * The static admin page sends `{ code }` here; this Worker swaps it for a
 * GitHub access_token using the OAuth App's client_secret (held as a Worker
 * secret), then returns the token to the browser. CORS is locked to the
 * configured ALLOWED_ORIGIN(s).
 *
 * Bindings (configure in wrangler.toml / dashboard):
 *   GITHUB_CLIENT_ID      — public, set as a var
 *   GITHUB_CLIENT_SECRET  — secret (`wrangler secret put GITHUB_CLIENT_SECRET`)
 *   ALLOWED_ORIGINS       — comma-separated list, e.g.
 *                           "https://arguto1993.github.io,http://localhost:3000"
 */

interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_ORIGINS: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get('Origin') ?? '';
    const allowed = (env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const corsOrigin = allowed.includes(origin) ? origin : '';

    const cors: Record<string, string> = corsOrigin
      ? {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          Vary: 'Origin',
        }
      : {};

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (!corsOrigin) {
      return json({ error: 'origin_not_allowed' }, 403, cors);
    }
    if (req.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405, cors);
    }

    let body: { code?: string };
    try {
      body = (await req.json()) as { code?: string };
    } catch {
      return json({ error: 'invalid_json' }, 400, cors);
    }
    if (!body.code) return json({ error: 'missing_code' }, 400, cors);

    const ghRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: body.code,
      }),
    });
    const data = (await ghRes.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };
    if (!data.access_token) {
      return json(
        { error: data.error || 'exchange_failed', detail: data.error_description },
        400,
        cors,
      );
    }
    return json({ access_token: data.access_token }, 200, cors);
  },
};

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
