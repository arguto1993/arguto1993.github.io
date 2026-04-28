import { useEffect, useMemo, useState } from 'react';
import {
  beginOAuth,
  clearToken,
  getStoredToken,
  handleOAuthCallback,
} from './auth';
import { actionsRunsUrl, loadDataFile, saveDataFile } from './github';
import type { PortfolioData } from './types';
import localData from '../data.json';

const DEV_PREVIEW = import.meta.env.DEV;
import {
  CertificationsForm,
  DashboardsForm,
  EducationForm,
  ExperiencesForm,
  LinksForm,
  PersonalForm,
  ProjectsForm,
  SkillsForm,
} from './forms';
import Preview from './Preview';

const SECTIONS = [
  'Personal',
  'Links',
  'Experiences',
  'Projects',
  'Dashboards',
  'Education',
  'Skills',
  'Certifications',
] as const;
type SectionKey = (typeof SECTIONS)[number];

export default function AdminApp() {
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
  const [savedAt, setSavedAt] = useState<{ url: string } | null>(null);
  const [section, setSection] = useState<SectionKey>('Personal');

  // Inject noindex once for the admin route.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Admin — Portfolio';
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  // Handle OAuth callback if ?code= is in the URL on first mount.
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

  // Load data.json once we have a token.
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

  const onSave = async () => {
    if (DEV_PREVIEW) {
      setError('Save disabled in local dev preview. Use the live admin page to commit.');
      return;
    }
    if (!token || !data || !sha) return;
    setSaving(true);
    setError(null);
    setSavedAt(null);
    const today = formatToday();
    const next: PortfolioData = {
      ...data,
      personal: { ...data.personal, lastUpdated: today },
    };
    try {
      const { commitUrl } = await saveDataFile(
        token,
        next,
        sha,
        `chore(content): update via admin (${toIsoDate(new Date())})`,
      );
      setData(next);
      setSavedAt({ url: commitUrl });
      // Refetch sha so subsequent saves don't 409.
      const fresh = await loadDataFile(token);
      setSha(fresh.sha);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const onSignOut = () => {
    clearToken();
    setToken(null);
    setData(null);
    setSha(null);
  };

  const body = useMemo(() => {
    if (!data) return null;
    switch (section) {
      case 'Personal':
        return (
          <PersonalForm
            value={data.personal}
            onChange={(v) => setData({ ...data, personal: v })}
          />
        );
      case 'Links':
        return (
          <LinksForm
            value={data.links}
            onChange={(v) => setData({ ...data, links: v })}
          />
        );
      case 'Experiences':
        return (
          <ExperiencesForm
            value={data.experiences}
            onChange={(v) => setData({ ...data, experiences: v })}
          />
        );
      case 'Projects':
        return (
          <ProjectsForm
            value={data.projects}
            onChange={(v) => setData({ ...data, projects: v })}
          />
        );
      case 'Dashboards':
        return (
          <DashboardsForm
            value={data.dashboards}
            onChange={(v) => setData({ ...data, dashboards: v })}
          />
        );
      case 'Education':
        return (
          <EducationForm
            value={data.education}
            onChange={(v) => setData({ ...data, education: v })}
          />
        );
      case 'Skills':
        return (
          <SkillsForm
            value={data.skills}
            onChange={(v) => setData({ ...data, skills: v })}
          />
        );
      case 'Certifications':
        return (
          <CertificationsForm
            value={data.certifications}
            onChange={(v) => setData({ ...data, certifications: v })}
          />
        );
    }
  }, [data, section]);

  if (bootstrapping) {
    return <Centered>Signing in…</Centered>;
  }

  if (!token) {
    return (
      <Centered>
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Portfolio Admin</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in with the GitHub account that owns this repo to edit{' '}
            <code>src/data.json</code>.
          </p>
          <button
            onClick={beginOAuth}
            className="px-5 py-2 rounded-md bg-[var(--accent)] text-white hover:opacity-90"
          >
            Sign in with GitHub
          </button>
        </div>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h1 className="text-base font-semibold">Portfolio Admin</h1>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-xs text-slate-500 hover:text-[var(--accent)]"
            >
              ← Back to site
            </a>
            <button
              onClick={onSave}
              disabled={!data || saving || loading || DEV_PREVIEW}
              title={DEV_PREVIEW ? 'Save disabled in dev preview' : undefined}
              className="px-4 py-1.5 text-sm rounded-md bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            {!DEV_PREVIEW && (
              <button
                onClick={onSignOut}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
        {DEV_PREVIEW && (
          <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-sm px-4 py-2 border-t border-amber-200 dark:border-amber-900">
            Dev preview — OAuth bypassed, edits are local-only and Save is disabled.
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm px-4 py-2 border-t border-red-200 dark:border-red-900">
            {error}
          </div>
        )}
        {savedAt && (
          <div className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-sm px-4 py-2 border-t border-green-200 dark:border-green-900">
            Saved.{' '}
            <a className="underline" href={savedAt.url} target="_blank" rel="noreferrer">
              View commit
            </a>{' '}
            ·{' '}
            <a className="underline" href={actionsRunsUrl()} target="_blank" rel="noreferrer">
              Watch deploy
            </a>{' '}
            (live in ~1 min)
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]">
        <nav className="md:sticky md:top-24 self-start flex md:flex-col gap-1 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`text-left text-sm px-3 py-2 rounded-md whitespace-nowrap ${
                section === s
                  ? 'bg-[var(--accent)] text-white'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </nav>
        <main className="min-w-0">
          {loading && <p className="text-sm text-slate-500">Loading data.json…</p>}
          {body}
        </main>
        {data && (
          <aside className="hidden lg:block lg:sticky lg:top-24 self-start min-w-0 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Preview · {section}
            </p>
            <Preview section={section} data={data} />
          </aside>
        )}
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6">
      {children}
    </div>
  );
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatToday(): string {
  const d = new Date();
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
