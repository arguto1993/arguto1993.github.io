import { useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useTheme } from '../components/ThemeContext';
import Preview from './Preview';
import type { AdminSectionKey } from './sections';
import type { PortfolioData } from './types';

const MIN_PREVIEW_W = 320;
const MAX_PREVIEW_W = 1080;

export function AdminPreviewPane({
  data,
  section,
}: {
  data: PortfolioData;
  section: AdminSectionKey;
}) {
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);

  const handlePreviewDrag = (e: ReactMouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = previewWidth ?? window.innerWidth * 0.5;
    const onMove = (ev: globalThis.MouseEvent) => {
      const w = Math.min(Math.max(startWidth + startX - ev.clientX, MIN_PREVIEW_W), MAX_PREVIEW_W);
      setPreviewWidth(w);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:shrink-0 lg:sticky lg:top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto relative"
      style={{
        width: previewWidth ?? '50vw',
        minWidth: MIN_PREVIEW_W,
        maxWidth: MAX_PREVIEW_W,
      }}
    >
      <div
        className="absolute left-0 inset-y-0 w-1.5 cursor-col-resize hover:bg-[var(--accent)]/30 active:bg-[var(--accent)]/50 transition-colors"
        onMouseDown={handlePreviewDrag}
      />
      <div className="pl-3">
        <PreviewHeader section={section} />
        <Preview section={section} data={data} />
      </div>
    </aside>
  );
}

function PreviewHeader({ section }: { section: AdminSectionKey }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Preview · {section}
      </p>
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
      >
        {theme === 'dark' ? '☀ Light' : '☾ Dark'}
      </button>
    </div>
  );
}
