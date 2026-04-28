import { type ReactNode } from 'react';
import type { PortfolioData } from './types';

// ── Primitives ───────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      className={inputCls}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      className={inputCls}
      rows={rows}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function StringList({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const update = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputCls}
            value={v}
            placeholder={placeholder}
            onChange={(e) => update(i, e.target.value)}
          />
          <RowButtons
            index={i}
            length={values.length}
            onMove={(dir) => onChange(move(values, i, dir))}
            onRemove={() => onChange(values.filter((_, k) => k !== i))}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="text-xs text-[var(--accent)] hover:underline"
      >
        + Add item
      </button>
    </div>
  );
}

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function RowButtons({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const btn =
    'px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30';
  return (
    <div className="flex gap-1 shrink-0">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(-1)}>
        ↑
      </button>
      <button
        type="button"
        className={btn}
        disabled={index === length - 1}
        onClick={() => onMove(1)}
      >
        ↓
      </button>
      <button
        type="button"
        className={`${btn} text-red-600 dark:text-red-400`}
        onClick={onRemove}
      >
        ✕
      </button>
    </div>
  );
}

export function ItemList<T>({
  items,
  onChange,
  emptyItem,
  renderItem,
  itemLabel,
}: {
  items: T[];
  onChange: (v: T[]) => void;
  emptyItem: () => T;
  renderItem: (item: T, update: (next: T) => void) => ReactNode;
  itemLabel: (item: T, i: number) => string;
}) {
  const update = (i: number, next: T) => {
    const arr = [...items];
    arr[i] = next;
    onChange(arr);
  };
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <details
          key={i}
          open={i === 0}
          className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="cursor-pointer select-none px-4 py-2 flex items-center justify-between gap-2 list-none hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg">
            <span className="flex items-center gap-2 min-w-0">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform group-open:rotate-90"
                fill="currentColor"
              >
                <path d="M7 5l6 5-6 5V5z" />
              </svg>
              <span className="text-sm font-medium truncate">
                {itemLabel(item, i) || `Item ${i + 1}`}
              </span>
            </span>
            <RowButtons
              index={i}
              length={items.length}
              onMove={(dir) => onChange(move(items, i, dir))}
              onRemove={() => onChange(items.filter((_, k) => k !== i))}
            />
          </summary>
          <div className="px-4 pb-4 pt-2 space-y-3">
            {renderItem(item, (next) => update(i, next))}
          </div>
        </details>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, emptyItem()])}
        className="text-sm text-[var(--accent)] hover:underline"
      >
        + Add new
      </button>
    </div>
  );
}

// ── Section editors ──────────────────────────────────────────────────────────

type Patch<T> = (next: T) => void;

export function PersonalForm({
  value,
  onChange,
}: {
  value: PortfolioData['personal'];
  onChange: Patch<PortfolioData['personal']>;
}) {
  const set = <K extends keyof PortfolioData['personal']>(
    k: K,
    v: PortfolioData['personal'][K],
  ) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Name">
        <TextInput value={value.name} onChange={(v) => set('name', v)} />
      </Field>
      <Field label="Nickname">
        <TextInput value={value.nickname} onChange={(v) => set('nickname', v)} />
      </Field>
      <Field label="Short name">
        <TextInput value={value.shortName} onChange={(v) => set('shortName', v)} />
      </Field>
      <Field label="Title">
        <TextInput value={value.title} onChange={(v) => set('title', v)} />
      </Field>
      <Field label="Email">
        <TextInput value={value.email} onChange={(v) => set('email', v)} type="email" />
      </Field>
      <Field label="Phone">
        <TextInput value={value.phone} onChange={(v) => set('phone', v)} />
      </Field>
      <Field label="Location">
        <TextInput value={value.location} onChange={(v) => set('location', v)} />
      </Field>
      <Field label="Last updated (auto on save)">
        <TextInput value={value.lastUpdated} onChange={(v) => set('lastUpdated', v)} />
      </Field>
      <Field label="Google site verification token">
        <TextInput
          value={value.googleVerification}
          onChange={(v) => set('googleVerification', v)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="About (markdown: **bold**, __italic__)">
          <TextArea value={value.about} onChange={(v) => set('about', v)} rows={8} />
        </Field>
      </div>
    </div>
  );
}

export function LinksForm({
  value,
  onChange,
}: {
  value: PortfolioData['links'];
  onChange: Patch<PortfolioData['links']>;
}) {
  const set = (k: keyof PortfolioData['links'], v: string) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(Object.keys(value) as (keyof PortfolioData['links'])[]).map((k) => (
        <Field key={k} label={k}>
          <TextInput value={value[k]} onChange={(v) => set(k, v)} />
        </Field>
      ))}
    </div>
  );
}

type Experience = PortfolioData['experiences'][number];
export function ExperiencesForm({
  value,
  onChange,
}: {
  value: Experience[];
  onChange: Patch<Experience[]>;
}) {
  return (
    <ItemList<Experience>
      items={value}
      onChange={onChange}
      emptyItem={() => ({
        title: '',
        company: '',
        location: '',
        period: '',
        type: '',
        description: [''],
      })}
      itemLabel={(e) => `${e.title || '(untitled)'} — ${e.company || ''}`}
      renderItem={(item, update) => {
        const set = <K extends keyof Experience>(k: K, v: Experience[K]) =>
          update({ ...item, [k]: v });
        return (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <TextInput value={item.title} onChange={(v) => set('title', v)} />
              </Field>
              <Field label="Company">
                <TextInput value={item.company} onChange={(v) => set('company', v)} />
              </Field>
              <Field label="Location">
                <TextInput value={item.location} onChange={(v) => set('location', v)} />
              </Field>
              <Field label="Period">
                <TextInput value={item.period} onChange={(v) => set('period', v)} />
              </Field>
              <Field label="Type">
                <TextInput value={item.type} onChange={(v) => set('type', v)} />
              </Field>
            </div>
            <Field label="Description (one bullet per line)">
              <StringList
                values={item.description}
                onChange={(v) => set('description', v)}
              />
            </Field>
          </>
        );
      }}
    />
  );
}

type Project = PortfolioData['projects'][number];
export function ProjectsForm({
  value,
  onChange,
}: {
  value: Project[];
  onChange: Patch<Project[]>;
}) {
  return (
    <ItemList<Project>
      items={value}
      onChange={onChange}
      emptyItem={() => ({
        title: '',
        organization: '',
        date: '',
        role: '',
        description: [''],
        tags: [],
        image: '',
        link: '',
        github: '',
      })}
      itemLabel={(p) => p.title || '(untitled project)'}
      renderItem={(item, update) => {
        const set = <K extends keyof Project>(k: K, v: Project[K]) =>
          update({ ...item, [k]: v });
        return (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <TextInput value={item.title} onChange={(v) => set('title', v)} />
              </Field>
              <Field label="Organization">
                <TextInput
                  value={item.organization}
                  onChange={(v) => set('organization', v)}
                />
              </Field>
              <Field label="Date">
                <TextInput value={item.date} onChange={(v) => set('date', v)} />
              </Field>
              <Field label="Role">
                <TextInput value={item.role} onChange={(v) => set('role', v)} />
              </Field>
              <Field label="Image URL">
                <TextInput value={item.image ?? ''} onChange={(v) => set('image', v)} />
              </Field>
              <Field label="Link">
                <TextInput value={item.link ?? ''} onChange={(v) => set('link', v)} />
              </Field>
              <Field label="GitHub">
                <TextInput value={item.github ?? ''} onChange={(v) => set('github', v)} />
              </Field>
            </div>
            <Field label="Description bullets">
              <StringList
                values={item.description}
                onChange={(v) => set('description', v)}
              />
            </Field>
            <Field label="Tags">
              <StringList values={item.tags} onChange={(v) => set('tags', v)} />
            </Field>
          </>
        );
      }}
    />
  );
}

type Dashboard = PortfolioData['dashboards'][number];
export function DashboardsForm({
  value,
  onChange,
}: {
  value: Dashboard[];
  onChange: Patch<Dashboard[]>;
}) {
  return (
    <ItemList<Dashboard>
      items={value}
      onChange={onChange}
      emptyItem={() => ({ title: '', platform: '', description: '', image: '', link: '' })}
      itemLabel={(d) => d.title || '(untitled dashboard)'}
      renderItem={(item, update) => {
        const set = <K extends keyof Dashboard>(k: K, v: Dashboard[K]) =>
          update({ ...item, [k]: v });
        return (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <TextInput value={item.title} onChange={(v) => set('title', v)} />
              </Field>
              <Field label="Platform">
                <TextInput value={item.platform} onChange={(v) => set('platform', v)} />
              </Field>
              <Field label="Image URL">
                <TextInput value={item.image} onChange={(v) => set('image', v)} />
              </Field>
              <Field label="Link">
                <TextInput value={item.link ?? ''} onChange={(v) => set('link', v)} />
              </Field>
            </div>
            <Field label="Description">
              <TextArea
                value={item.description}
                onChange={(v) => set('description', v)}
                rows={3}
              />
            </Field>
          </>
        );
      }}
    />
  );
}

type Education = PortfolioData['education'][number];
export function EducationForm({
  value,
  onChange,
}: {
  value: Education[];
  onChange: Patch<Education[]>;
}) {
  return (
    <ItemList<Education>
      items={value}
      onChange={onChange}
      emptyItem={() => ({
        degree: '',
        institution: '',
        location: '',
        period: '',
        details: [],
      })}
      itemLabel={(e) => e.degree || '(untitled education)'}
      renderItem={(item, update) => {
        const set = <K extends keyof Education>(k: K, v: Education[K]) =>
          update({ ...item, [k]: v });
        return (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Degree">
                <TextInput value={item.degree} onChange={(v) => set('degree', v)} />
              </Field>
              <Field label="Institution">
                <TextInput
                  value={item.institution}
                  onChange={(v) => set('institution', v)}
                />
              </Field>
              <Field label="Location">
                <TextInput value={item.location} onChange={(v) => set('location', v)} />
              </Field>
              <Field label="Period">
                <TextInput value={item.period} onChange={(v) => set('period', v)} />
              </Field>
            </div>
            <Field label="Details (optional bullets)">
              <StringList
                values={item.details ?? []}
                onChange={(v) => set('details', v)}
              />
            </Field>
          </>
        );
      }}
    />
  );
}

type SkillGroup = PortfolioData['skills'][number];
export function SkillsForm({
  value,
  onChange,
}: {
  value: SkillGroup[];
  onChange: Patch<SkillGroup[]>;
}) {
  return (
    <ItemList<SkillGroup>
      items={value}
      onChange={onChange}
      emptyItem={() => ({ category: '', skills: [] })}
      itemLabel={(g) => g.category || '(untitled group)'}
      renderItem={(item, update) => {
        return (
          <>
            <Field label="Category">
              <TextInput
                value={item.category}
                onChange={(v) => update({ ...item, category: v })}
              />
            </Field>
            <Field label="Skills">
              <StringList
                values={item.skills}
                onChange={(v) => update({ ...item, skills: v })}
              />
            </Field>
          </>
        );
      }}
    />
  );
}

type Certification = PortfolioData['certifications'][number];
export function CertificationsForm({
  value,
  onChange,
}: {
  value: Certification[];
  onChange: Patch<Certification[]>;
}) {
  return (
    <ItemList<Certification>
      items={value}
      onChange={onChange}
      emptyItem={() => ({ name: '', issuer: '', date: '', link: '' })}
      itemLabel={(c) => c.name || '(untitled certification)'}
      renderItem={(item, update) => {
        const set = <K extends keyof Certification>(k: K, v: Certification[K]) =>
          update({ ...item, [k]: v });
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <TextInput value={item.name} onChange={(v) => set('name', v)} />
            </Field>
            <Field label="Issuer">
              <TextInput value={item.issuer} onChange={(v) => set('issuer', v)} />
            </Field>
            <Field label="Date">
              <TextInput value={item.date} onChange={(v) => set('date', v)} />
            </Field>
            <Field label="Link">
              <TextInput value={item.link} onChange={(v) => set('link', v)} />
            </Field>
          </div>
        );
      }}
    />
  );
}
