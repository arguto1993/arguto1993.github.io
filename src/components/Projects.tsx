import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import {
  Github,
  FileText,
  LayoutDashboard,
  Youtube,
  Code,
  Table,
  ArrowRight,
  Search,
  LayoutGrid,
  List as ListIcon,
  Rows3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Building2,
  Layers,
  Zap,
  CalendarDays,
  ArrowUpDown,
  Hash,
} from 'lucide-react';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';

type ViewMode = 'grid' | 'list' | 'compact';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES: Record<string, string> = {
  Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
  Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December',
};
const PER_PAGE_OPTIONS = [6, 9, 12, 24];

type SortId =
  | 'date-desc'
  | 'date-asc'
  | 'title-asc'
  | 'title-desc'
  | 'industry-asc'
  | 'industry-desc'
  | 'org-asc'
  | 'org-desc';

const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: 'date-desc', label: 'Newest' },
  { id: 'date-asc', label: 'Oldest' },
  { id: 'title-asc', label: 'Title (A–Z)' },
  { id: 'title-desc', label: 'Title (Z–A)' },
  { id: 'industry-asc', label: 'Industry (A–Z)' },
  { id: 'industry-desc', label: 'Industry (Z–A)' },
  { id: 'org-asc', label: 'Organization (A–Z)' },
  { id: 'org-desc', label: 'Organization (Z–A)' },
];

/** Parse a project date like "Dec 2025" or "2024" into { month, year }. */
function parseDate(date: string): { month: string | null; year: string | null } {
  let month: string | null = null;
  let year: string | null = null;
  for (const part of date.trim().split(/\s+/)) {
    if (/^\d{4}$/.test(part)) year = part;
    else {
      const idx = MONTHS.indexOf(part.slice(0, 3));
      if (idx >= 0) month = MONTHS[idx];
    }
  }
  return { month, year };
}

/** Comparable numeric key for a date; bare-year entries sort as that year's start. */
function dateSortKey(date: string): number {
  const { month, year } = parseDate(date);
  const y = year ? Number(year) : 0;
  const m = month ? MONTHS.indexOf(month) + 1 : 0;
  return y * 100 + m;
}

/** Stable comparator for a given sort id. */
function compareProjects(a: Project, b: Project, sort: SortId): number {
  switch (sort) {
    case 'date-desc':
      return dateSortKey(b.date) - dateSortKey(a.date);
    case 'date-asc':
      return dateSortKey(a.date) - dateSortKey(b.date);
    case 'title-asc':
      return a.title.localeCompare(b.title);
    case 'title-desc':
      return b.title.localeCompare(a.title);
    case 'industry-asc':
      return (a.domain ?? '').localeCompare(b.domain ?? '');
    case 'industry-desc':
      return (b.domain ?? '').localeCompare(a.domain ?? '');
    case 'org-asc':
      return a.organization.localeCompare(b.organization);
    case 'org-desc':
      return b.organization.localeCompare(a.organization);
  }
}

/** A searchable haystack for a project. */
function searchableText(p: Project): string {
  return [
    p.title,
    p.organization,
    p.role,
    p.domain,
    p.date,
    parseDate(p.date).month ? MONTH_NAMES[parseDate(p.date).month!] : '',
    p.background,
    p.goal,
    ...(p.description ?? []),
    ...(p.keyInsights ?? []),
    ...(p.techStack ?? []),
    ...(p.relatedSkills ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

// ── Multi-select filter dropdown ─────────────────────────────────────────────

interface MultiSelectProps {
  icon: React.ReactNode;
  allLabel: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ icon, allLabel, options, selected, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);

  const visible = query.trim()
    ? options.filter(o => o.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer hover:border-[var(--accent)] min-w-[140px] ${className}`}
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: selected.length ? 'var(--accent)' : 'var(--border)',
        }}
      >
        <span className={selected.length ? 'accent-text' : 'opacity-60'}>{icon}</span>
        <span className={selected.length ? 'accent-text' : 'opacity-70'}>
          {selected.length === 0 ? allLabel : selected.length === 1 ? selected[0] : `${selected.length} selected`}
        </span>
        {selected.length > 1 && (
          <span
            className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: 'var(--accent)', color: '#000' }}
          >
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`ml-auto opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute z-30 mt-2 w-60 rounded-lg border shadow-xl flex flex-col"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Search ${allLabel.toLowerCase()}…`}
                autoFocus
                className="w-full pl-7 pr-2 py-1.5 rounded-md border text-xs outline-none focus:border-[var(--accent)] transition-colors"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full text-left px-3 py-1.5 text-xs accent-text hover:opacity-70 cursor-pointer"
              >
                Clear selection
              </button>
            )}
            {visible.length === 0 ? (
              <p className="px-3 py-2 text-xs opacity-40">No matches</p>
            ) : (
              visible.map(opt => (
                <label
                  key={opt}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm cursor-pointer hover:bg-[var(--border)]/40"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={() => toggle(opt)}
                    className="accent-[var(--accent)] cursor-pointer"
                  />
                  <span className="opacity-80">{opt}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Link icon overlay (grid) / inline buttons (list) ─────────────────────────

const linkDefs = [
  { key: 'dashboardLink', Icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'githubLink', Icon: Github, label: 'GitHub' },
  { key: 'googleColabLink', Icon: Code, label: 'Colab' },
  { key: 'sheetLink', Icon: Table, label: 'Sheet' },
  { key: 'presentationLink', Icon: FileText, label: 'Presentation' },
  { key: 'videoLink', Icon: Youtube, label: 'Video' },
] as const;

const ProjectLinkIcons: React.FC<{ project: Project; variant?: 'overlay' | 'inline' }> = ({
  project,
  variant = 'overlay',
}) => (
  <>
    {linkDefs.map(({ key, Icon, label }) => {
      const href = project[key];
      if (!href) return null;
      return (
        <div key={key} className="relative group/tip">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            onClick={e => e.stopPropagation()}
            className={
              variant === 'overlay'
                ? 'p-3 rounded-full bg-white text-black hover:bg-[var(--accent)] hover:text-white transition-colors flex'
                : 'p-2 rounded-full border border-[var(--border)] opacity-70 hover:opacity-100 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex'
            }
          >
            <Icon size={variant === 'overlay' ? 20 : 16} />
          </a>
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded px-2 py-1 text-[10px] font-semibold text-white bg-black/80 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
            {label}
          </span>
        </div>
      );
    })}
  </>
);

const TechPills: React.FC<{ techStack?: string[]; max?: number }> = ({ techStack, max = 4 }) =>
  techStack && techStack.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {techStack.slice(0, max).map(t => (
        <span
          key={t}
          className="px-2 py-0.5 rounded-full border border-[var(--border)] text-[9px] font-bold uppercase tracking-wider opacity-70 transition-colors hover:opacity-100 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style={{ backgroundColor: 'var(--bg)' }}
        >
          {t}
        </span>
      ))}
    </div>
  ) : null;

// ── Project card variants ────────────────────────────────────────────────────

const GridCard: React.FC<{ project: Project; onOpen: () => void }> = ({ project, onOpen }) => (
  <div className="card group flex flex-col hover:shadow-2xl hover:shadow-[var(--accent)]/10 h-full">
    <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={onOpen}>
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
        <ProjectLinkIcons project={project} />
      </div>
      {project.domain && (
        <div className="absolute bottom-3 left-3">
          <span className="accent-badge-2 !text-[10px] !px-3 !py-1">✦ {project.domain}</span>
        </div>
      )}
    </div>

    <div className="p-6 flex flex-col flex-1">
      <p className="text-[11px] opacity-40 tracking-wide mb-3">
        {[project.organization, project.date].filter(Boolean).join('  ·  ')}
      </p>
      <h3
        className="text-xl font-serif font-bold leading-tight mb-3 line-clamp-2 cursor-pointer hover:text-[var(--accent)] transition-colors duration-200"
        onClick={onOpen}
      >
        {project.title}
      </h3>
      <p className="text-sm opacity-70 line-clamp-2 mb-4 font-light leading-relaxed flex-1">
        {project.description[0]}
      </p>
      <div className="mb-5">
        <TechPills techStack={project.techStack} />
      </div>
      <div className="pt-4 border-t border-[var(--border)]">
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-all duration-200 hover:gap-3"
          style={{ color: 'var(--accent)' }}
        >
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

const ListRow: React.FC<{ project: Project; onOpen: () => void }> = ({ project, onOpen }) => (
  <div className="card group flex flex-col sm:flex-row hover:shadow-xl hover:shadow-[var(--accent)]/10">
    <div
      className="relative sm:w-64 shrink-0 aspect-video sm:aspect-auto overflow-hidden cursor-pointer"
      onClick={onOpen}
    >
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      {project.domain && (
        <div className="absolute bottom-2 left-2">
          <span className="accent-badge-2 !text-[10px] !px-2.5 !py-0.5">✦ {project.domain}</span>
        </div>
      )}
    </div>

    <div className="p-5 flex flex-col flex-1 min-w-0">
      <p className="text-[11px] opacity-40 tracking-wide mb-1.5">
        {[project.organization, project.date, project.role].filter(Boolean).join('  ·  ')}
      </p>
      <h3
        className="text-lg font-serif font-bold leading-tight mb-2 line-clamp-1 cursor-pointer hover:text-[var(--accent)] transition-colors"
        onClick={onOpen}
      >
        {project.title}
      </h3>
      <p className="text-sm opacity-70 line-clamp-2 mb-3 font-light leading-relaxed flex-1">
        {project.description[0]}
      </p>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <TechPills techStack={project.techStack} max={6} />
        <div className="flex items-center gap-1.5">
          <ProjectLinkIcons project={project} variant="inline" />
          <button
            onClick={onOpen}
            className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-all duration-200 hover:gap-2.5 ml-1"
            style={{ color: 'var(--accent)' }}
          >
            Details <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CompactRow: React.FC<{ project: Project; onOpen: () => void }> = ({ project, onOpen }) => (
  <div className="card flex items-center gap-4 px-4 py-3 hover:border-[var(--accent)] transition-colors">
    <div className="min-w-0 flex-1 cursor-pointer" onClick={onOpen}>
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-base font-serif font-bold leading-tight truncate hover:text-[var(--accent)] transition-colors">
          {project.title}
        </h3>
        {project.domain && (
          <span className="accent-badge-2 !text-[9px] !px-2 !py-0.5">✦ {project.domain}</span>
        )}
      </div>
      <p className="text-[11px] opacity-40 tracking-wide mt-0.5">
        {[project.organization, project.date, project.role].filter(Boolean).join('  ·  ')}
      </p>
    </div>
    <div className="hidden md:block shrink-0">
      <TechPills techStack={project.techStack} max={3} />
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
      <ProjectLinkIcons project={project} variant="inline" />
      <button
        onClick={onOpen}
        className="p-2 rounded-full hover:bg-[var(--border)]/40 transition-colors cursor-pointer"
        style={{ color: 'var(--accent)' }}
        aria-label="View details"
      >
        <ArrowRight size={16} />
      </button>
    </div>
  </div>
);

// ── Year + month picker ──────────────────────────────────────────────────────

interface DatePickerProps {
  yearOptions: string[];
  selYear: string;
  selMonth: string;
  onYearChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ yearOptions, selYear, selMonth, onYearChange, onMonthChange, className = '' }) => {
  const [openPanel, setOpenPanel] = useState<'year' | 'month' | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const active = !!selYear || !!selMonth;

  useEffect(() => {
    if (!openPanel) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenPanel(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [openPanel]);

  const pickYear = (y: string) => { onYearChange(y); if (!y) onMonthChange(''); setOpenPanel(null); };
  const pickMonth = (m: string) => { onMonthChange(m); setOpenPanel(null); };

  return (
    <div ref={ref} className={`flex items-center gap-1 ${className}`}>
      {/* Year button */}
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setOpenPanel(p => p === 'year' ? null : 'year')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer hover:border-[var(--accent)]"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: selYear ? 'var(--accent)' : 'var(--border)',
          }}
        >
          <CalendarDays size={14} className={selYear ? 'accent-text' : 'opacity-60'} />
          <span className={selYear ? 'accent-text' : 'opacity-70'}>{selYear || 'All time'}</span>
          <ChevronDown size={14} className={`ml-auto opacity-60 transition-transform ${openPanel === 'year' ? 'rotate-180' : ''}`} />
        </button>
        {openPanel === 'year' && (
          <div
            className="absolute z-30 mt-2 w-32 rounded-lg border shadow-xl overflow-hidden"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
          >
            <button
              type="button"
              onClick={() => pickYear('')}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--border)]/40 cursor-pointer ${!selYear ? 'accent-text font-semibold' : 'opacity-70'}`}
            >
              All time
            </button>
            {yearOptions.map(y => (
              <button
                key={y}
                type="button"
                onClick={() => pickYear(y)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--border)]/40 cursor-pointer ${selYear === y ? 'accent-text font-semibold' : 'opacity-70'}`}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Month button — only when a year is selected */}
      {selYear && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel(p => p === 'month' ? null : 'month')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer hover:border-[var(--accent)]"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: selMonth ? 'var(--accent)' : 'var(--border)',
            }}
          >
            <span className={selMonth ? 'accent-text' : 'opacity-70'}>{selMonth ? MONTH_NAMES[selMonth] : 'All months'}</span>
            <ChevronDown size={14} className={`ml-auto opacity-60 transition-transform ${openPanel === 'month' ? 'rotate-180' : ''}`} />
          </button>
          {openPanel === 'month' && (
            <div
              className="absolute z-30 mt-2 w-36 rounded-lg border shadow-xl overflow-hidden max-h-64 overflow-y-auto"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
            >
              <button
                type="button"
                onClick={() => pickMonth('')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--border)]/40 cursor-pointer ${!selMonth ? 'accent-text font-semibold' : 'opacity-70'}`}
              >
                All months
              </button>
              {MONTHS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => pickMonth(m)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--border)]/40 cursor-pointer ${selMonth === m ? 'accent-text font-semibold' : 'opacity-70'}`}
                >
                  {MONTH_NAMES[m]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {active && (
        <button
          type="button"
          onClick={() => { onYearChange(''); onMonthChange(''); setOpenPanel(null); }}
          className="p-1.5 opacity-50 hover:opacity-100 cursor-pointer"
          aria-label="Clear date filter"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};

// ── Main section ─────────────────────────────────────────────────────────────

export const Projects: React.FC = () => {
  const { projects } = useSiteData();
  const items = projects.items;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const [perPage, setPerPage] = useState(9);
  const [sort, setSort] = useState<SortId>('date-desc');
  const [page, setPage] = useState(1);
  const [selDomains, setSelDomains] = useState<string[]>([]);
  const [selTech, setSelTech] = useState<string[]>([]);
  const [selSkills, setSelSkills] = useState<string[]>([]);
  const [selYear, setSelYear] = useState<string>('');
  const [selMonth, setSelMonth] = useState<string>('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersAnimating, setFiltersAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    const update = () => {
      const nextIsMobile = window.innerWidth < 768;
      setIsMobile(nextIsMobile);
      if (!nextIsMobile) setNavHidden(false);
    };
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const onNavVisibility = (event: Event) => {
      const hidden = !!(event as CustomEvent<{ hidden?: boolean }>).detail?.hidden;
      setNavHidden(isMobile && hidden);
      if (isMobile && hidden) setFiltersOpen(false);
    };
    window.addEventListener('portfolio:mobile-nav-visibility', onNavVisibility);
    return () => window.removeEventListener('portfolio:mobile-nav-visibility', onNavVisibility);
  }, [isMobile]);

  // Derive filter option lists from the data
  const { domainOptions, techOptions, skillOptions, yearOptions } = useMemo(() => {
    const domains = new Set<string>();
    const tech = new Set<string>();
    const skills = new Set<string>();
    const years = new Set<string>();
    for (const p of items) {
      if (p.domain) domains.add(p.domain);
      p.techStack?.forEach(t => tech.add(t));
      p.relatedSkills?.forEach(s => skills.add(s));
      const { year } = parseDate(p.date);
      if (year) years.add(year);
    }
    return {
      domainOptions: [...domains].sort(),
      techOptions: [...tech].sort(),
      skillOptions: [...skills].sort(),
      yearOptions: [...years].sort((a, b) => b.localeCompare(a)),
    };
  }, [items]);

  // Apply search + filters
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(p => {
      if (q && !searchableText(p).includes(q)) return false;
      if (selDomains.length && (!p.domain || !selDomains.includes(p.domain))) return false;
      if (selTech.length && !p.techStack?.some(t => selTech.includes(t))) return false;
      if (selSkills.length && !p.relatedSkills?.some(s => selSkills.includes(s))) return false;
      if (selYear || selMonth) {
        const { month, year } = parseDate(p.date);
        if (selYear && year !== selYear) return false;
        if (selMonth && month !== selMonth) return false;
      }
      return true;
    });
  }, [items, search, selDomains, selTech, selSkills, selYear, selMonth]);

  // Apply sort (stable — ties keep their filtered order)
  const sorted = useMemo(() => {
    return filtered
      .map((p, i) => [p, i] as const)
      .sort((a, b) => compareProjects(a[0], b[0], sort) || a[1] - b[1])
      .map(([p]) => p);
  }, [filtered, sort]);

  // Reset to first page whenever the result set or ordering changes
  useEffect(() => {
    setPage(1);
  }, [search, selDomains, selTech, selSkills, selYear, selMonth, perPage, sort, view]);

  // perPage is Infinity when "All" is selected
  const pageSize = Number.isFinite(perPage) ? perPage : Math.max(1, sorted.length);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  const hasFilters =
    !!search ||
    selDomains.length > 0 ||
    selTech.length > 0 ||
    selSkills.length > 0 ||
    !!selYear ||
    !!selMonth;

  const activeFilterCount =
    selDomains.length + selTech.length + selSkills.length + (selYear ? 1 : 0) + (selMonth ? 1 : 0);

  const clearAll = () => {
    setSearch('');
    setSelDomains([]);
    setSelTech([]);
    setSelSkills([]);
    setSelYear('');
    setSelMonth('');
  };

  const toggleFilters = () => {
    const guardUntil = Date.now() + 500;
    if (isMobile) {
      window.dispatchEvent(new CustomEvent('portfolio:mobile-toolbar-toggle', { detail: { guardUntil } }));
    }
    setFiltersOpen(open => !open);
    setFiltersAnimating(true);
  };

  const allViewButtons: { mode: ViewMode; Icon: typeof LayoutGrid; label: string }[] = [
    { mode: 'grid', Icon: LayoutGrid, label: 'Grid view' },
    { mode: 'list', Icon: ListIcon, label: 'List view' },
    { mode: 'compact', Icon: Rows3, label: 'Compact list' },
  ];
  const viewButtons = isMobile
    ? allViewButtons.filter(b => b.mode !== 'list')
    : allViewButtons;
  const effectiveView: ViewMode = isMobile && view === 'list' ? 'compact' : view;

  return (
    <section id="projects" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-serif font-bold mb-4">{projects.title}</h2>
        <p className="opacity-60">{projects.subtitle}</p>
      </motion.div>

      {/* Toolbar */}
      <div
        className={`sticky z-40 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] transition-[top] duration-300 ${
          navHidden ? 'top-0 md:top-16' : 'top-16'
        }`}
      >
        <div>
          {/* Single row: search + view toggle + filter hamburger */}
          <div className="flex items-center gap-2 pt-4 pb-3">
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects…"
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

            <div
              className="flex items-center rounded-lg border p-1 shrink-0"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
            >
              {viewButtons.map(({ mode, Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setView(mode)}
                  aria-label={label}
                  aria-pressed={effectiveView === mode}
                  className="p-2 rounded-md transition-colors cursor-pointer"
                  style={
                    effectiveView === mode
                      ? { backgroundColor: 'var(--accent)', color: '#000' }
                      : { color: 'var(--text)', opacity: 0.6 }
                  }
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>

            <button
              onClick={toggleFilters}
              aria-expanded={filtersOpen}
              aria-label="Toggle filters"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer shrink-0"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: filtersOpen || activeFilterCount > 0 ? 'var(--accent)' : 'var(--border)',
              }}
            >
              <SlidersHorizontal
                size={15}
                className={filtersOpen || activeFilterCount > 0 ? 'accent-text' : 'opacity-60'}
              />
              <span className={`hidden md:inline ${activeFilterCount > 0 ? 'accent-text' : 'opacity-70'}`}>
                Filters
              </span>
              {activeFilterCount > 0 && (
                <span
                  className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: 'var(--accent)', color: '#000' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Collapsible filter panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                key="filter-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: filtersAnimating ? 'hidden' : 'visible' }}
              onAnimationComplete={() => setFiltersAnimating(false)}
              >
                <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 pb-4 pt-3 border-t border-[var(--border)]">
                  {/* Row 1 on mobile: Industries + TechStacks fill evenly */}
                  <div className="flex gap-2 md:contents">
                    <div className="flex-1 min-w-0">
                      <MultiSelect
                        icon={<Building2 size={14} />}
                        allLabel="All Industries"
                        options={domainOptions}
                        selected={selDomains}
                        onChange={setSelDomains}
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <MultiSelect
                        icon={<Layers size={14} />}
                        allLabel="All Tech Stacks"
                        options={techOptions}
                        selected={selTech}
                        onChange={setSelTech}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Row 2 on mobile: Skills fills remaining space, DatePicker is natural width */}
                  <div className="flex gap-2 md:contents">
                    <div className="flex-1 min-w-0">
                      <MultiSelect
                        icon={<Zap size={14} />}
                        allLabel="All Skills"
                        options={skillOptions}
                        selected={selSkills}
                        onChange={setSelSkills}
                        className="w-full"
                      />
                    </div>
                    <div className={!selYear ? 'flex-1 min-w-0' : ''}>
                      <DatePicker
                        yearOptions={yearOptions}
                        selYear={selYear}
                        selMonth={selMonth}
                        onYearChange={setSelYear}
                        onMonthChange={setSelMonth}
                        className={!selYear ? 'w-full' : ''}
                      />
                    </div>
                  </div>

                  {/* Controls: own flex row on mobile, flows inline on md+ */}
                  <div className="flex items-center gap-2 md:contents">
                    {hasFilters && (
                      <button
                        onClick={clearAll}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm opacity-70 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <X size={14} /> Clear all
                      </button>
                    )}
                    <div className="relative ml-auto text-sm">
                      <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                      <select
                        value={sort}
                        onChange={e => setSort(e.target.value as SortId)}
                        className="pl-7 pr-7 py-2 rounded-lg border text-sm outline-none focus:border-[var(--accent)] cursor-pointer appearance-none"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
                      >
                        {SORT_OPTIONS.map(o => (
                          <option key={o.id} value={o.id}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                    </div>
                    <div className="relative text-sm">
                      <Hash size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                      <select
                        value={Number.isFinite(perPage) ? String(perPage) : 'all'}
                        onChange={e => setPerPage(e.target.value === 'all' ? Infinity : Number(e.target.value))}
                        className="pl-7 pr-7 py-2 rounded-lg border text-sm outline-none focus:border-[var(--accent)] cursor-pointer appearance-none"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
                      >
                        {PER_PAGE_OPTIONS.map(n => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                        <option value="all">All</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs opacity-40 pb-3">
          Showing {sorted.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, sorted.length)} of{' '}
          {sorted.length} project{sorted.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Results */}
      {pageItems.length === 0 ? (
        <div className="text-center py-20 mt-8 opacity-60">
          <p className="text-lg font-serif mb-2">No projects match your filters.</p>
          <button onClick={clearAll} className="text-sm accent-text hover:underline cursor-pointer">
            Clear all filters
          </button>
        </div>
      ) : (
        <motion.div
          key={`${effectiveView}-${currentPage}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={
            effectiveView === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'
              : 'flex flex-col gap-4 mt-8'
          }
        >
          {pageItems.map((project, i) => {
            const open = () => setSelectedIndex(start + i);
            if (effectiveView === 'grid') return <GridCard key={project.title} project={project} onOpen={open} />;
            if (effectiveView === 'list') return <ListRow key={project.title} project={project} onOpen={open} />;
            return <CompactRow key={project.title} project={project} onOpen={open} />;
          })}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-1.5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              aria-current={n === currentPage}
              className="min-w-[36px] h-9 px-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer"
              style={
                n === currentPage
                  ? { backgroundColor: 'var(--accent)', color: '#000', borderColor: 'var(--accent)' }
                  : { borderColor: 'var(--border)' }
              }
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <ProjectModal
        projects={sorted}
        index={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />
    </section>
  );
};
