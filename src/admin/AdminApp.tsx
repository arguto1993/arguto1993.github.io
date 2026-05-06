import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { beginOAuth } from './auth';
import { actionsRunsUrl } from './github';
import { AdminPreviewPane } from './AdminPreviewPane';
import {
  ADMIN_SECTIONS,
  renderAdminSectionForm,
  type AdminSectionKey,
} from './sections';
import { useAdminData } from './useAdminData';

const DEV_PREVIEW = import.meta.env.DEV;
const ADMIN_TITLE = 'Arguto Portfolio 2.0 - Admin';

export default function AdminApp() {
  const {
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
  } = useAdminData();
  const [section, setSection] = useState<AdminSectionKey>('Brand');

  // Inject noindex once for the admin route.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = ADMIN_TITLE;
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  if (bootstrapping) {
    return <Centered>Signing in…</Centered>;
  }

  if (!token) {
    return (
      <Centered>
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold">{ADMIN_TITLE}</h1>
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

  // Main admin UI — rendered once data is loaded
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <h1 className="text-base font-semibold">{ADMIN_TITLE}</h1>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-xs text-slate-500 hover:text-[var(--accent)]"
            >
              ← Back to site
            </a>
            <button
              onClick={save}
              disabled={!data || saving || loading || DEV_PREVIEW}
              title={DEV_PREVIEW ? 'Save disabled in dev preview' : undefined}
              className="cursor-pointer px-4 py-1.5 text-sm rounded-md bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            {!DEV_PREVIEW && (
              <button
                onClick={signOut}
                className="cursor-pointer px-3 py-1.5 text-sm rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
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
            (live in ~5 min)
          </div>
        )}
      </header>

      <div className="px-4 py-6 grid gap-6 md:grid-cols-[180px_1fr] lg:flex lg:gap-6 lg:items-start">
        <nav className="md:sticky md:top-24 self-start flex md:flex-col gap-1 overflow-x-auto lg:w-44 lg:shrink-0">
          {ADMIN_SECTIONS.map(({ key }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`cursor-pointer text-left text-sm px-3 py-2 rounded-md whitespace-nowrap ${
                section === key
                  ? 'bg-[var(--accent)] text-black'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {key}
            </button>
          ))}
        </nav>
        <main className="min-w-0 lg:flex-1">
          {loading && <p className="text-sm text-slate-500">Loading data.json…</p>}
          {data && renderAdminSectionForm(section, data, setData)}
        </main>
        {data && <AdminPreviewPane section={section} data={data} />}
      </div>
    </div>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6">
      {children}
    </div>
  );
}
