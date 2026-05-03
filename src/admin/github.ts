import type { PortfolioData } from '../types';
import { DATA_PATH, REPO_NAME, REPO_OWNER } from './config';

const API = 'https://api.github.com';

interface ContentsResponse {
  content: string;
  sha: string;
  encoding: 'base64';
}

export interface LoadedFile {
  data: PortfolioData;
  sha: string;
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function decodeBase64Utf8(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function encodeBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export async function loadDataFile(token: string): Promise<LoadedFile> {
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}`,
    { headers: authHeaders(token), cache: 'no-store' },
  );
  if (!res.ok) throw new Error(`Failed to load data.json (${res.status})`);
  const json = (await res.json()) as ContentsResponse;
  const text = decodeBase64Utf8(json.content);
  return { data: JSON.parse(text) as PortfolioData, sha: json.sha };
}

export interface SaveResult {
  commitSha: string;
  commitUrl: string;
}

export async function saveDataFile(
  token: string,
  data: PortfolioData,
  sha: string,
  message: string,
): Promise<SaveResult> {
  const json = JSON.stringify(data, null, 2) + '\n';
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}`,
    {
      method: 'PUT',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, content: encodeBase64Utf8(json), sha }),
    },
  );
  if (res.status === 409) {
    throw new Error(
      'Repo changed since you opened the editor. Reload to fetch the latest data.json before saving again.',
    );
  }
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Save failed (${res.status}): ${detail}`);
  }
  const body = (await res.json()) as { commit: { sha: string; html_url: string } };
  return { commitSha: body.commit.sha, commitUrl: body.commit.html_url };
}

export function actionsRunsUrl(): string {
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/actions`;
}
