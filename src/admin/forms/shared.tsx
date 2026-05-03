import type { PortfolioData } from '../../types';

export type Patch<T> = (next: T) => void;
export type SectionProps<K extends keyof PortfolioData> = {
  value: PortfolioData[K];
  onChange: Patch<PortfolioData[K]>;
};

export function toDirectGoogleDriveImageUrl(value: string): string {
  const trimmed = value.trim();
  const fileId = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1];
  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;

  try {
    const url = new URL(trimmed);
    if (url.hostname === 'drive.google.com' && (url.pathname === '/open' || url.pathname === '/uc')) {
      const id = url.searchParams.get('id');
      if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
    }
  } catch {
    // Keep manually typed relative paths or incomplete URLs as-is while editing.
  }

  return value;
}

export function SectionToggle({ show, onChange }: { show: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={show}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded accent-[var(--accent)]"
        />
        <span className="font-medium">Show this section</span>
      </label>
    </div>
  );
}
