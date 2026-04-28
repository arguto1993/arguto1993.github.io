import type { ReactNode } from 'react';
import type { PortfolioData } from './types';

type SectionKey =
  | 'Personal'
  | 'Links'
  | 'Experiences'
  | 'Projects'
  | 'Dashboards'
  | 'Education'
  | 'Skills'
  | 'Certifications';

const card =
  'rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4';
const tag =
  'inline-block text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mr-1 mb-1';

function renderInline(s: string) {
  // Mirrors the markdown subset used by data.json: **bold**, __italic__.
  const parts: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < s.length) {
    const bold = s.indexOf('**', i);
    const italic = s.indexOf('__', i);
    const next = [bold, italic].filter((n) => n !== -1).sort((a, b) => a - b)[0];
    if (next === undefined) {
      parts.push(s.slice(i));
      break;
    }
    if (next > i) parts.push(s.slice(i, next));
    const marker = s.slice(next, next + 2);
    const close = s.indexOf(marker, next + 2);
    if (close === -1) {
      parts.push(s.slice(i));
      break;
    }
    const inner = s.slice(next + 2, close);
    parts.push(
      marker === '**' ? (
        <strong key={key++}>{inner}</strong>
      ) : (
        <em key={key++}>{inner}</em>
      ),
    );
    i = close + 2;
  }
  return parts;
}

export default function Preview({
  section,
  data,
}: {
  section: SectionKey;
  data: PortfolioData;
}) {
  switch (section) {
    case 'Personal': {
      const p = data.personal;
      return (
        <div className={card}>
          <h2 className="text-xl font-bold">{p.name || '(name)'}</h2>
          {p.nickname && (
            <p className="text-sm text-slate-500">aka {p.nickname}</p>
          )}
          <p className="text-sm text-[var(--accent)] mt-1">{p.title}</p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
            {p.email && (<><dt>Email</dt><dd>{p.email}</dd></>)}
            {p.phone && (<><dt>Phone</dt><dd>{p.phone}</dd></>)}
            {p.location && (<><dt>Location</dt><dd>{p.location}</dd></>)}
            {p.lastUpdated && (<><dt>Updated</dt><dd>{p.lastUpdated}</dd></>)}
          </dl>
          {p.about && (
            <p className="mt-3 text-sm whitespace-pre-line leading-relaxed">
              {renderInline(p.about)}
            </p>
          )}
        </div>
      );
    }
    case 'Links': {
      const entries = Object.entries(data.links).filter(([, v]) => v);
      return (
        <div className={card}>
          <ul className="space-y-1 text-sm">
            {entries.map(([k, v]) => (
              <li key={k} className="flex gap-2 min-w-0">
                <span className="text-slate-500 capitalize shrink-0">{k}</span>
                <span className="truncate text-[var(--accent)]">{v as string}</span>
              </li>
            ))}
            {entries.length === 0 && (
              <li className="text-slate-500">No links configured</li>
            )}
          </ul>
        </div>
      );
    }
    case 'Experiences':
      return (
        <div className="space-y-3">
          {data.experiences.map((e, i) => (
            <div key={i} className={card}>
              <div className="flex justify-between gap-2 flex-wrap">
                <h3 className="font-semibold text-sm">{e.title || '(untitled)'}</h3>
                <span className="text-xs text-slate-500">{e.period}</span>
              </div>
              <p className="text-xs text-[var(--accent)] mt-0.5">
                {e.company}
                {e.location && ` · ${e.location}`}
                {e.type && ` · ${e.type}`}
              </p>
              {e.description?.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                  {e.description.filter(Boolean).map((d, j) => (
                    <li key={j}>{renderInline(d)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {data.experiences.length === 0 && (
            <p className="text-sm text-slate-500">No experiences yet</p>
          )}
        </div>
      );
    case 'Projects':
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          {data.projects.map((p, i) => (
            <div key={i} className={card}>
              {p.image && (
                <img
                  src={p.image}
                  alt=""
                  className="w-full aspect-video object-cover rounded-md mb-2"
                  loading="lazy"
                />
              )}
              <h3 className="font-semibold text-sm">{p.title || '(untitled)'}</h3>
              <p className="text-xs text-slate-500">
                {[p.organization, p.role, p.date].filter(Boolean).join(' · ')}
              </p>
              {p.description?.length > 0 && (
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 line-clamp-3">
                  {p.description.filter(Boolean).join(' · ')}
                </p>
              )}
              {p.tags?.length > 0 && (
                <div className="mt-2">
                  {p.tags.map((t, j) => (
                    <span key={j} className={tag}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {data.projects.length === 0 && (
            <p className="text-sm text-slate-500">No projects yet</p>
          )}
        </div>
      );
    case 'Dashboards':
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          {data.dashboards.map((d, i) => (
            <div key={i} className={card}>
              {d.image && (
                <img
                  src={d.image}
                  alt=""
                  className="w-full aspect-video object-cover rounded-md mb-2"
                  loading="lazy"
                />
              )}
              <h3 className="font-semibold text-sm">{d.title || '(untitled)'}</h3>
              <p className="text-xs text-[var(--accent)]">{d.platform}</p>
              {d.description && (
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 line-clamp-3">
                  {d.description}
                </p>
              )}
            </div>
          ))}
          {data.dashboards.length === 0 && (
            <p className="text-sm text-slate-500">No dashboards yet</p>
          )}
        </div>
      );
    case 'Education':
      return (
        <div className="space-y-3">
          {data.education.map((e, i) => (
            <div key={i} className={card}>
              <div className="flex justify-between gap-2 flex-wrap">
                <h3 className="font-semibold text-sm">{e.degree || '(untitled)'}</h3>
                <span className="text-xs text-slate-500">{e.period}</span>
              </div>
              <p className="text-xs text-[var(--accent)]">
                {e.institution}
                {e.location && ` · ${e.location}`}
              </p>
              {e.details && e.details.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                  {e.details.filter(Boolean).map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {data.education.length === 0 && (
            <p className="text-sm text-slate-500">No education yet</p>
          )}
        </div>
      );
    case 'Skills':
      return (
        <div className="space-y-3">
          {data.skills.map((g, i) => (
            <div key={i} className={card}>
              <h3 className="font-semibold text-sm mb-2">{g.category || '(group)'}</h3>
              <div>
                {g.skills.filter(Boolean).map((s, j) => (
                  <span key={j} className={tag}>{s}</span>
                ))}
                {g.skills.filter(Boolean).length === 0 && (
                  <span className="text-xs text-slate-500">No skills</span>
                )}
              </div>
            </div>
          ))}
          {data.skills.length === 0 && (
            <p className="text-sm text-slate-500">No skill groups yet</p>
          )}
        </div>
      );
    case 'Certifications':
      return (
        <div className="space-y-2">
          {data.certifications.map((c, i) => (
            <div key={i} className={card}>
              <div className="flex justify-between gap-2 flex-wrap">
                <h3 className="font-semibold text-sm">{c.name || '(untitled)'}</h3>
                <span className="text-xs text-slate-500">{c.date}</span>
              </div>
              <p className="text-xs text-[var(--accent)]">{c.issuer}</p>
            </div>
          ))}
          {data.certifications.length === 0 && (
            <p className="text-sm text-slate-500">No certifications yet</p>
          )}
        </div>
      );
  }
}
