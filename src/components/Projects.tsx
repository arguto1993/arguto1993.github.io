import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import {
  Github,
  FileText,
  LayoutDashboard,
  Youtube,
  ArrowRight,
  Search,
  LayoutGrid,
  List as ListIcon,
  Rows3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Project } from '../types';
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
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange }) => {
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

  // Reset the in-dropdown search each time it closes
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
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer hover:border-[var(--accent)]"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: selected.length ? 'var(--accent)' : 'var(--border)',
        }}
      >
        <span className={selected.length ? 'accent-text' : 'opacity-70'}>{label}</span>
        {selected.length > 0 && (
          <span
            className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: 'var(--accent)', color: '#000' }}
          >
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} />
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
                placeholder={`Search ${label.toLowerCase()}…`}
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
  { key: 'githubLink', Icon: Github, label: 'GitHub' },
  { key: 'dashboardLink', Icon: LayoutDashboard, label: 'Dashboard' },
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
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          onClick={e => e.stopPropagation()}
          className={
            variant === 'overlay'
              ? 'p-3 rounded-full bg-white text-black hover:bg-[var(--accent)] hover:text-white transition-colors'
              : 'p-2 rounded-full border border-[var(--border)] opacity-70 hover:opacity-100 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors'
          }
        >
          <Icon size={variant === 'overlay' ? 20 : 16} />
        </a>
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
  const [selMonths, setSelMonths] = useState<string[]>([]);
  const [selYears, setSelYears] = useState<string[]>([]);

  // Derive filter option lists from the data
  const { domainOptions, techOptions, skillOptions, monthOptions, yearOptions } = useMemo(() => {
    const domains = new Set<string>();
    const tech = new Set<string>();
    const skills = new Set<string>();
    const months = new Set<string>();
    const years = new Set<string>();
    for (const p of items) {
      if (p.domain) domains.add(p.domain);
      p.techStack?.forEach(t => tech.add(t));
      p.relatedSkills?.forEach(s => skills.add(s));
      const { month, year } = parseDate(p.date);
      if (month) months.add(month);
      if (year) years.add(year);
    }
    return {
      domainOptions: [...domains].sort(),
      techOptions: [...tech].sort(),
      skillOptions: [...skills].sort(),
      monthOptions: MONTHS.filter(m => months.has(m)),
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
      if (selMonths.length || selYears.length) {
        const { month, year } = parseDate(p.date);
        if (selMonths.length && (!month || !selMonths.includes(month))) return false;
        if (selYears.length && (!year || !selYears.includes(year))) return false;
      }
      return true;
    });
  }, [items, search, selDomains, selTech, selSkills, selMonths, selYears]);

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
  }, [search, selDomains, selTech, selSkills, selMonths, selYears, perPage, sort, view]);

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
    selMonths.length > 0 ||
    selYears.length > 0;

  const clearAll = () => {
    setSearch('');
    setSelDomains([]);
    setSelTech([]);
    setSelSkills([]);
    setSelMonths([]);
    setSelYears([]);
  };

  const viewButtons: { mode: ViewMode; Icon: typeof LayoutGrid; label: string }[] = [
    { mode: 'grid', Icon: LayoutGrid, label: 'Grid view' },
    { mode: 'list', Icon: ListIcon, label: 'List view' },
    { mode: 'compact', Icon: Rows3, label: 'Compact list' },
  ];

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

      {/* Toolbar — sticks below the navbar while scrolling through this section */}
      <div className="sticky top-16 z-40 mb-8 flex flex-col gap-4 pt-6 pb-4 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)]">
        {/* Row 1: search + view toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects, industry, tech, skills, month, year…"
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
            className="flex items-center rounded-lg border p-1 shrink-0 self-start"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
          >
            {viewButtons.map(({ mode, Icon, label }) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                aria-label={label}
                aria-pressed={view === mode}
                className="p-2 rounded-md transition-colors cursor-pointer"
                style={
                  view === mode
                    ? { backgroundColor: 'var(--accent)', color: '#000' }
                    : { color: 'var(--text)', opacity: 0.6 }
                }
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: filters + per-page */}
        <div className="flex flex-wrap items-center gap-3">
          <MultiSelect label="Industry" options={domainOptions} selected={selDomains} onChange={setSelDomains} />
          <MultiSelect label="Tech stack" options={techOptions} selected={selTech} onChange={setSelTech} />
          <MultiSelect label="Skills" options={skillOptions} selected={selSkills} onChange={setSelSkills} />
          <MultiSelect
            label="Month"
            options={monthOptions.map(m => MONTH_NAMES[m])}
            selected={selMonths.map(m => MONTH_NAMES[m])}
            onChange={names =>
              setSelMonths(names.map(n => MONTHS.find(m => MONTH_NAMES[m] === n)!).filter(Boolean))
            }
          />
          <MultiSelect label="Year" options={yearOptions} selected={selYears} onChange={setSelYears} />

          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 text-sm opacity-70 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              <X size={14} /> Clear all
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto text-sm">
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

          <div className="flex items-center gap-2 text-sm">
            <span className="opacity-50">Per page</span>
            <select
              value={Number.isFinite(perPage) ? String(perPage) : 'all'}
              onChange={e => setPerPage(e.target.value === 'all' ? Infinity : Number(e.target.value))}
              className="px-2 py-2 rounded-lg border text-sm outline-none focus:border-[var(--accent)] cursor-pointer"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
            >
              {PER_PAGE_OPTIONS.map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
              <option value="all">All</option>
            </select>
          </div>
        </div>

        <p className="text-xs opacity-40">
          Showing {sorted.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, sorted.length)} of{' '}
          {sorted.length} project{sorted.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Results */}
      {pageItems.length === 0 ? (
        <div className="text-center py-20 opacity-60">
          <p className="text-lg font-serif mb-2">No projects match your filters.</p>
          <button onClick={clearAll} className="text-sm accent-text hover:underline cursor-pointer">
            Clear all filters
          </button>
        </div>
      ) : (
        <motion.div
          key={`${view}-${currentPage}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={
            view === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'flex flex-col gap-4'
          }
        >
          {pageItems.map((project, i) => {
            const open = () => setSelectedIndex(start + i);
            if (view === 'grid') return <GridCard key={project.title} project={project} onOpen={open} />;
            if (view === 'list') return <ListRow key={project.title} project={project} onOpen={open} />;
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
