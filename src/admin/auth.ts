import {
  ADMIN_HASH,
  OAUTH_CLIENT_ID,
  OAUTH_WORKER_URL,
  SESSION_STATE_KEY,
  SESSION_TOKEN_KEY,
} from './config';

export function getStoredToken(): string | null {
  return sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function clearToken(): void {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
}

function randomState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function beginOAuth(): void {
  if (!OAUTH_CLIENT_ID) {
    alert('VITE_GH_CLIENT_ID is not set. See README.md → Admin.');
    return;
  }
  const state = randomState();
  sessionStorage.setItem(SESSION_STATE_KEY, state);
  const redirectUri = `${window.location.origin}/`;
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', OAUTH_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'public_repo');
  url.searchParams.set('state', state);
  window.location.assign(url.toString());
}

// Guard against StrictMode double-invocation: the first call consumes the
// state from sessionStorage, the second would otherwise see an empty state
// and report a (false) mismatch.
let inFlight: Promise<boolean> | null = null;

/**
 * If the URL contains an OAuth ?code=, exchange it for a token via the Worker,
 * store the token, strip the query string, and ensure the hash points at #/admin.
 * Returns true when a callback was handled (caller should re-render).
 */
export function handleOAuthCallback(): Promise<boolean> {
  if (inFlight) return inFlight;
  inFlight = doHandleOAuthCallback();
  return inFlight;
}

async function doHandleOAuthCallback(): Promise<boolean> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  if (!code) return false;

  const expected = sessionStorage.getItem(SESSION_STATE_KEY);
  sessionStorage.removeItem(SESSION_STATE_KEY);
  if (!expected || expected !== state) {
    alert('OAuth state mismatch — login aborted.');
    cleanUrl();
    return false;
  }

  if (!OAUTH_WORKER_URL) {
    alert('VITE_OAUTH_WORKER_URL is not set. See README.md → Admin.');
    return false;
  }

  try {
    const res = await fetch(OAUTH_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      access_token?: string;
      error?: string;
      detail?: string;
    };
    if (!res.ok || !json.access_token) {
      const parts = [`status ${res.status}`, json.error, json.detail].filter(Boolean);
      throw new Error(parts.join(' — ') || 'unknown error');
    }
    sessionStorage.setItem(SESSION_TOKEN_KEY, json.access_token);
  } catch (err) {
    alert(`OAuth exchange failed: ${(err as Error).message}`);
    cleanUrl();
    return false;
  }

  cleanUrl();
  if (window.location.hash !== ADMIN_HASH) {
    window.location.hash = ADMIN_HASH;
  }
  return true;
}

function cleanUrl(): void {
  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, '', url.toString());
}
