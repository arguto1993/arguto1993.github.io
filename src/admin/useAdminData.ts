import { useEffect, useState } from 'react';
import {
  clearToken,
  getStoredToken,
  handleOAuthCallback,
} from './auth';
import { loadDataFile, saveDataFile } from './github';
import type { PortfolioData } from './types';
import localData from '../data.json';

const DEV_PREVIEW = import.meta.env.DEV;

interface SavedCommit {
  url: string;
}

export function useAdminData() {
  const [token, setToken] = useState<string | null>(
    DEV_PREVIEW ? 'dev-preview' : getStoredToken(),
  );
  const [bootstrapping, setBootstrapping] = useState(!DEV_PREVIEW);
  const [data, setData] = useState<PortfolioData | null>(
    DEV_PREVIEW ? (localData as PortfolioData) : null,
  );
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<SavedCommit | null>(null);

  useEffect(() => {
    if (DEV_PREVIEW) return;
    let cancelled = false;
    (async () => {
      const handled = await handleOAuthCallback();
      if (cancelled) return;
      if (handled) setToken(getStoredToken());
      setBootstrapping(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (DEV_PREVIEW || !token) return;
    setLoading(true);
    setError(null);
    loadDataFile(token)
      .then(({ data, sha }) => {
        setData(data);
        setSha(sha);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const save = async () => {
    if (DEV_PREVIEW) {
      setError('Save disabled in local dev preview. Use the live admin page to commit.');
      return;
    }
    if (!token || !data || !sha) return;
    setSaving(true);
    setError(null);
    setSavedAt(null);
    const next: PortfolioData = {
      ...data,
      brand: { ...data.brand, lastUpdated: formatToday() },
    };
    try {
      const isoJakarta = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Jakarta',
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(new Date());
      const { commitUrl } = await saveDataFile(
        token,
        next,
        sha,
        `data.json: update via admin (${isoJakarta} Jakarta)`,
      );
      setData(next);
      setSavedAt({ url: commitUrl });
      const fresh = await loadDataFile(token);
      setSha(fresh.sha);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const signOut = () => {
    clearToken();
    setToken(null);
    setData(null);
    setSha(null);
  };

  return {
    bootstrapping,
    data,
    error,
    loading,
    save,
    savedAt,
    saving,
    setData,
    signOut,
    token,
  };
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatToday(): string {
  const d = new Date();
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
