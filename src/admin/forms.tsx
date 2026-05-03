import type { PortfolioData } from './types';
import { Field, TextInput, TextArea, StringList, ItemList } from './primitives';

type Patch<T> = (next: T) => void;
type SectionProps<K extends keyof PortfolioData> = { value: PortfolioData[K]; onChange: Patch<PortfolioData[K]> };

function SectionToggle({ show, onChange }: { show: boolean; onChange: (v: boolean) => void }) {
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

export function HeroForm({ value, onChange }: SectionProps<'hero'>) {
  const set = <K extends keyof PortfolioData['hero']>(k: K, v: PortfolioData['hero'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        Hero is always shown. The <code>show</code> field stays in data.json only for section schema consistency.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <TextInput value={value.name} onChange={(v) => set('name', v)} />
        </Field>
        <Field label="Title (badge)">
          <TextInput value={value.title} onChange={(v) => set('title', v)} />
        </Field>
        <Field label="Subtitle (paragraph text)" >
          <TextInput value={value.subtitle} onChange={(v) => set('subtitle', v)} />
        </Field>
      </div>
    </div>
  );
}

export function BrandForm({ value, onChange }: SectionProps<'brand'>) {
  const set = <K extends keyof PortfolioData['brand']>(k: K, v: PortfolioData['brand'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Shortname">
        <TextInput value={value.shortname} onChange={(v) => set('shortname', v)} />
      </Field>
      <Field label="Nickname">
        <TextInput value={value.nickname} onChange={(v) => set('nickname', v)} />
      </Field>
      <Field label="Homepage">
        <TextInput value={value.homepage} onChange={(v) => set('homepage', v)} />
      </Field>
      <Field label="Homepage usage note">
        <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {value._homepageComment}
        </p>
      </Field>
      <Field label="Google site verification token">
        <TextInput value={value.googleVerification} onChange={(v) => set('googleVerification', v)} />
      </Field>
      <Field label="Last updated (auto on save)">
        <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {value.lastUpdated || '—'}
        </p>
      </Field>
    </div>
  );
}

export function AboutForm({ value, onChange }: SectionProps<'about'>) {
  const set = <K extends keyof PortfolioData['about']>(k: K, v: PortfolioData['about'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <Field label="Section title">
        <TextInput value={value.title} onChange={(v) => set('title', v)} />
      </Field>
      <Field label="About copy (markdown: **bold**, __italic__)">
        <TextArea
          value={value.content}
          onChange={(content) => onChange({ ...value, content })}
          rows={20}
        />
      </Field>
    </div>
  );
}

type SkillGroup = PortfolioData['skills']['items'][number];
export function SkillsForm({ value, onChange }: SectionProps<'skills'>) {
  const set = <K extends keyof PortfolioData['skills']>(k: K, v: PortfolioData['skills'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <Field label="Section title">
        <TextInput value={value.title} onChange={(v) => set('title', v)} />
      </Field>
      <ItemList<SkillGroup>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ category: '', skills: [] })}
        itemLabel={(g) => g.category || '(untitled group)'}
        renderItem={(item, _update, set) => (
          <>
            <Field label="Category"><TextInput value={item.category} onChange={(v) => set('category', v)} /></Field>
            <Field label="Skills"><StringList values={item.skills} onChange={(v) => set('skills', v)} /></Field>
          </>
        )}
      />
    </div>
  );
}

type Experience = PortfolioData['experiences']['items'][number];
export function ExperiencesForm({ value, onChange }: SectionProps<'experiences'>) {
  const set = <K extends keyof PortfolioData['experiences']>(k: K, v: PortfolioData['experiences'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <div className="grid gap-4 sm:grid-cols-2 mb-2">
        <Field label="Section title">
          <TextInput value={value.title} onChange={(v) => set('title', v)} />
        </Field>
        <Field label="Section subtitle">
          <TextInput value={value.subtitle} onChange={(v) => set('subtitle', v)} />
        </Field>
      </div>
      <ItemList<Experience>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ title: '', company: '', location: '', period: '', type: '', description: [''] })}
        itemLabel={(e) => `${e.title || '(untitled)'} — ${e.company || ''}`}
        renderItem={(item, _update, set) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><TextInput value={item.title} onChange={(v) => set('title', v)} /></Field>
              <Field label="Company"><TextInput value={item.company} onChange={(v) => set('company', v)} /></Field>
              <Field label="Location"><TextInput value={item.location} onChange={(v) => set('location', v)} /></Field>
              <Field label="Period"><TextInput value={item.period} onChange={(v) => set('period', v)} /></Field>
              <Field label="Type"><TextInput value={item.type} onChange={(v) => set('type', v)} /></Field>
            </div>
            <Field label="Description (one bullet per line)">
              <StringList values={item.description} onChange={(v) => set('description', v)} />
            </Field>
          </>
        )}
      />
    </div>
  );
}

type Project = PortfolioData['projects']['items'][number];
export function ProjectsForm({ value, onChange }: SectionProps<'projects'>) {
  const set = <K extends keyof PortfolioData['projects']>(k: K, v: PortfolioData['projects'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <div className="grid gap-4 sm:grid-cols-2 mb-2">
        <Field label="Section title">
          <TextInput value={value.title} onChange={(v) => set('title', v)} />
        </Field>
        <Field label="Section subtitle">
          <TextInput value={value.subtitle} onChange={(v) => set('subtitle', v)} />
        </Field>
      </div>
      <ItemList<Project>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ title: '', organization: '', date: '', role: '', description: [''], tags: [], image: '', link: '', github: '' })}
        itemLabel={(p) => p.title || '(untitled project)'}
        renderItem={(item, _update, set) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><TextInput value={item.title} onChange={(v) => set('title', v)} /></Field>
              <Field label="Organization"><TextInput value={item.organization} onChange={(v) => set('organization', v)} /></Field>
              <Field label="Date"><TextInput value={item.date} onChange={(v) => set('date', v)} /></Field>
              <Field label="Role"><TextInput value={item.role} onChange={(v) => set('role', v)} /></Field>
              <Field label="Image URL"><TextInput value={item.image ?? ''} onChange={(v) => set('image', v)} /></Field>
              <Field label="Link"><TextInput value={item.link ?? ''} onChange={(v) => set('link', v)} /></Field>
              <Field label="GitHub"><TextInput value={item.github ?? ''} onChange={(v) => set('github', v)} /></Field>
            </div>
            <Field label="Description bullets">
              <StringList values={item.description} onChange={(v) => set('description', v)} />
            </Field>
            <Field label="Tags">
              <StringList values={item.tags} onChange={(v) => set('tags', v)} />
            </Field>
          </>
        )}
      />
    </div>
  );
}

type Dashboard = PortfolioData['dashboards']['items'][number];
export function DashboardsForm({ value, onChange }: SectionProps<'dashboards'>) {
  const set = <K extends keyof PortfolioData['dashboards']>(k: K, v: PortfolioData['dashboards'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <div className="grid gap-4 sm:grid-cols-2 mb-2">
        <Field label="Section title">
          <TextInput value={value.title} onChange={(v) => set('title', v)} />
        </Field>
        <Field label="Section subtitle">
          <TextInput value={value.subtitle} onChange={(v) => set('subtitle', v)} />
        </Field>
      </div>
      <ItemList<Dashboard>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ title: '', platform: '', description: '', image: '', link: '' })}
        itemLabel={(d) => d.title || '(untitled dashboard)'}
        renderItem={(item, _update, set) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><TextInput value={item.title} onChange={(v) => set('title', v)} /></Field>
              <Field label="Platform"><TextInput value={item.platform} onChange={(v) => set('platform', v)} /></Field>
              <Field label="Image URL"><TextInput value={item.image} onChange={(v) => set('image', v)} /></Field>
              <Field label="Link"><TextInput value={item.link ?? ''} onChange={(v) => set('link', v)} /></Field>
            </div>
            <Field label="Description">
              <TextArea value={item.description} onChange={(v) => set('description', v)} rows={3} />
            </Field>
          </>
        )}
      />
    </div>
  );
}

type EducationItem = PortfolioData['education']['items'][number];
export function EducationForm({ value, onChange }: SectionProps<'education'>) {
  const set = <K extends keyof PortfolioData['education']>(k: K, v: PortfolioData['education'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <Field label="Section title">
        <TextInput value={value.title} onChange={(v) => set('title', v)} />
      </Field>
      <ItemList<EducationItem>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ degree: '', institution: '', location: '', period: '', details: [] })}
        itemLabel={(e) => e.degree || '(untitled education)'}
        renderItem={(item, _update, set) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Degree"><TextInput value={item.degree} onChange={(v) => set('degree', v)} /></Field>
              <Field label="Institution"><TextInput value={item.institution} onChange={(v) => set('institution', v)} /></Field>
              <Field label="Location"><TextInput value={item.location} onChange={(v) => set('location', v)} /></Field>
              <Field label="Period"><TextInput value={item.period} onChange={(v) => set('period', v)} /></Field>
            </div>
            <Field label="Details (optional bullets)">
              <StringList values={item.details ?? []} onChange={(v) => set('details', v)} />
            </Field>
          </>
        )}
      />
    </div>
  );
}

type CertGroup = PortfolioData['education']['certifications'];
export function CertificationsForm({ value, onChange }: { value: CertGroup; onChange: (v: CertGroup) => void }) {
  type Cert = CertGroup['items'][number];
  return (
    <div className="grid gap-4">
      <Field label="Section title">
        <TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} />
      </Field>
      <ItemList<Cert>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ name: '', issuer: '', date: '', link: '' })}
        itemLabel={(c) => c.name || '(untitled certification)'}
        renderItem={(item, _update, set) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name"><TextInput value={item.name} onChange={(v) => set('name', v)} /></Field>
            <Field label="Issuer"><TextInput value={item.issuer} onChange={(v) => set('issuer', v)} /></Field>
            <Field label="Date"><TextInput value={item.date} onChange={(v) => set('date', v)} /></Field>
            <Field label="Link"><TextInput value={item.link ?? ''} onChange={(v) => set('link', v)} /></Field>
          </div>
        )}
      />
    </div>
  );
}

export function ContactsForm({ value, onChange }: SectionProps<'contacts'>) {
  const set = <K extends keyof PortfolioData['contacts']>(k: K, v: PortfolioData['contacts'][K]) =>
    onChange({ ...value, [k]: v });
  type ContactItem = PortfolioData['contacts']['items'][number];
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Section title">
          <TextInput value={value.title} onChange={(v) => set('title', v)} />
        </Field>
        <Field label="Section subtitle">
          <TextInput value={value.subtitle} onChange={(v) => set('subtitle', v)} />
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
        {(Object.keys(value) as (keyof PortfolioData['contacts'])[])
          .filter((key) => !['show', 'title', 'subtitle', 'email', 'phone', 'location', 'items'].includes(key))
          .map((key) => (
            <Field key={key} label={key}>
              <TextInput value={value[key] as string} onChange={(next) => set(key, next as never)} />
            </Field>
          ))}
      </div>
      <ItemList<ContactItem>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ icon: 'mail', label: '', value: '', href: '' })}
        itemLabel={(item) => item.label || '(untitled contact)'}
        renderItem={(item, _update, set) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Icon">
              <TextInput value={item.icon} onChange={(v) => set('icon', v as ContactItem['icon'])} />
            </Field>
            <Field label="Label">
              <TextInput value={item.label} onChange={(v) => set('label', v)} />
            </Field>
            <Field label="Display value">
              <TextInput value={item.value} onChange={(v) => set('value', v)} />
            </Field>
            <Field label="Link">
              <TextInput value={item.href ?? ''} onChange={(v) => set('href', v)} />
            </Field>
          </div>
        )}
      />
    </div>
  );
}
