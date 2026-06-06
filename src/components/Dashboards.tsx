import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import { Layout, Columns3, Search, X } from 'lucide-react';
import { DashboardModal } from './DashboardModal';

const COL_OPTIONS = [2, 3, 4, 5];
const ALL = '__all__';

/** Largest sensible column count for the current viewport width (1 = mobile, no control). */
function maxColsFor(width: number): number {
  if (width >= 1280) return 5;
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type SortId = 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'platform-asc' | 'platform-desc';

const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'title-asc', label: 'Title (A–Z)' },
  { id: 'title-desc', label: 'Title (Z–A)' },
  { id: 'platform-asc', label: 'Platform (A–Z)' },
  { id: 'platform-desc', label: 'Platform (Z–A)' },
];

/** Comparable numeric key for a date like "Nov 2025" or "2024"; bare years sort as that year's start. */
function dateSortKey(date: string): number {
  let year = 0;
  let month = 0;
  for (const part of (date ?? '').trim().split(/\s+/)) {
    if (/^\d{4}$/.test(part)) year = Number(part);
    else {
      const idx = MONTHS.indexOf(part.slice(0, 3));
      if (idx >= 0) month = idx + 1;
    }
  }
  return year * 100 + month;
}

// ── Main section ─────────────────────────────────────────────────────────────

export const Dashboards: React.FC = () => {
  const { dashboards } = useSiteData();
  const [cols, setCols] = useState(3);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<string>(ALL);
  const [sort, setSort] = useState<SortId>('newest');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Track how many columns the viewport can fit; options and grid step down as it shrinks.
  const [maxCols, setMaxCols] = useState(() =>
    typeof window === 'undefined' ? 5 : maxColsFor(window.innerWidth)
  );
  useEffect(() => {
    const onResize = () => setMaxCols(maxColsFor(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const effectiveCols = Math.min(cols, maxCols);

  const platformOptions = useMemo(
    () => [...new Set(dashboards.items.map(d => d.platform).filter(Boolean))].sort(),
    [dashboards.items]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = dashboards.items.filter(d => {
      if (q && ![d.title, d.platform, d.description].filter(Boolean).join(' ').toLowerCase().includes(q))
        return false;
      if (platform !== ALL && d.platform !== platform) return false;
      return true;
    });

    return filtered
      .map((d, i) => [d, i] as const)
      .sort(([a, ai], [b, bi]) => {
        switch (sort) {
          case 'oldest':
            return dateSortKey(a.date) - dateSortKey(b.date) || ai - bi;
          case 'title-asc':
            return a.title.localeCompare(b.title) || ai - bi;
          case 'title-desc':
            return b.title.localeCompare(a.title) || ai - bi;
          case 'platform-asc':
            return a.platform.localeCompare(b.platform) || ai - bi;
          case 'platform-desc':
            return b.platform.localeCompare(a.platform) || ai - bi;
          case 'newest':
          default:
            return dateSortKey(b.date) - dateSortKey(a.date) || ai - bi;
        }
      })
      .map(([d]) => d);
  }, [dashboards.items, search, platform, sort]);

  const clearAll = () => {
    setSearch('');
    setPlatform(ALL);
  };

  const tabs = [{ id: ALL, label: 'All Platforms' }, ...platformOptions.map(p => ({ id: p, label: p }))];

  return (
    <section id="dashboards" className="section-container bg-[var(--card-bg)]/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-serif font-bold mb-4">{dashboards.title}</h2>
        <p className="opacity-60">{dashboards.subtitle}</p>
      </motion.div>

      {/* Toolbar — search, platform tabs, sort + columns control; sticks below the navbar while scrolling */}
      <div className="sticky top-16 z-40 flex flex-col gap-3 pt-6 pb-4 bg-[var(--bg)]/95 backdrop-blur-md">
        {/* Row 1: search + per-row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dashboards by title, platform…"
              className="w-full pl-9 pr-9 py-2.5 rounded-lg border text-sm outline-none focus:border-[var(--accent)] transition-colors"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {maxCols > 1 && (
            <div className="flex items-center gap-2 text-sm shrink-0 self-start">
              <Columns3 size={15} className="opacity-50" />
              <span className="opacity-50">Per row</span>
              <div
                className="flex items-center rounded-lg border p-1"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
              >
                {COL_OPTIONS.filter(n => n <= maxCols).map(n => (
                  <button
                    key={n}
                    onClick={() => setCols(n)}
                    aria-pressed={effectiveCols === n}
                    className="min-w-[32px] h-8 px-2 rounded-md text-sm font-semibold transition-colors cursor-pointer"
                    style={
                      effectiveCols === n
                        ? { backgroundColor: 'var(--accent)', color: '#000' }
                        : { color: 'var(--text)', opacity: 0.6 }
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Row 2: platform tabs + sort */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center overflow-x-auto no-scrollbar -mb-1 pb-1">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setPlatform(t.id)}
                aria-pressed={platform === t.id}
                className={`shrink-0 px-3.5 py-1.5 border text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  i > 0 ? '-ml-px' : ''
                }`}
                style={
                  platform === t.id
                    ? { backgroundColor: 'var(--accent)', color: '#000', borderColor: 'var(--accent)' }
                    : { backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', opacity: 0.75 }
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm shrink-0">
            <span className="opacity-50">Sort</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortId)}
              className="px-2 py-2 rounded-lg border text-sm outline-none focus:border-[var(--accent)] cursor-pointer"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Flickr-style grid — edge to edge, no gaps, no rounding */}
      {visible.length === 0 ? (
        <div className="text-center py-20 opacity-60">
          <p className="text-lg font-serif mb-2">No dashboards match your filters.</p>
          <button onClick={clearAll} className="text-sm accent-text hover:underline cursor-pointer">
            Clear all filters
          </button>
        </div>
      ) : (
        <div
          className="grid overflow-hidden border border-[var(--border)]"
          style={{ gridTemplateColumns: `repeat(${effectiveCols}, minmax(0, 1fr))` }}
        >
          {visible.map((dash, i) => (
            <button
              key={dash.title}
              onClick={() => setSelectedIndex(i)}
              className="group relative aspect-[16/9] overflow-hidden block text-left cursor-pointer"
            >
              <img
                src={dash.image}
                alt={dash.title}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-colors duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                <div className="mb-2 flex items-center gap-2">
                  <span className="accent-badge-2 !text-[10px] !px-2 !py-0.5 flex items-center gap-1 w-fit">
                    <Layout size={10} /> {dash.platform}
                  </span>
                  {dash.date && <span className="text-[10px] text-white/60">{dash.date}</span>}
                </div>
                <h3 className="text-base font-serif font-bold text-white leading-tight">{dash.title}</h3>
                {dash.description && (
                  <p className="text-xs text-white/70 font-light mt-1 line-clamp-2">{dash.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <DashboardModal
        dashboards={visible}
        index={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />
    </section>
  );
};
