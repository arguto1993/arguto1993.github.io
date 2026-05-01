import type { PortfolioData } from './types';
import { Field, TextInput, TextArea, StringList, ItemList } from './primitives';

type Patch<T> = (next: T) => void;
type SectionProps<K extends keyof PortfolioData> = { value: PortfolioData[K]; onChange: Patch<PortfolioData[K]> };

export function HeroForm({ value, onChange }: SectionProps<'hero'>) {
  const set = <K extends keyof PortfolioData['hero']>(k: K, v: PortfolioData['hero'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Name">
        <TextInput value={value.name} onChange={(v) => set('name', v)} />
      </Field>
      <Field label="Title">
        <TextInput value={value.title} onChange={(v) => set('title', v)} />
      </Field>
    </div>
  );
}

export function BrandForm({ value, onChange }: SectionProps<'brand'>) {
  const set = <K extends keyof PortfolioData['brand']>(k: K, v: PortfolioData['brand'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nickname">
        <TextInput value={value.nickname} onChange={(v) => set('nickname', v)} />
      </Field>
      <Field label="Google site verification token">
        <TextInput value={value.googleVerification} onChange={(v) => set('googleVerification', v)} />
      </Field>
      <Field label="Last updated (auto on save)">
        <TextInput value={value.lastUpdated} onChange={(v) => set('lastUpdated', v)} />
      </Field>
    </div>
  );
}

export function AboutForm({ value, onChange }: SectionProps<'about'>) {
  return (
    <div className="grid gap-4">
      <Field label="About copy (markdown: **bold**, __italic__)">
        <TextArea
          value={value.content}
          onChange={(content) => onChange({ ...value, content })}
          rows={8}
        />
      </Field>
    </div>
  );
}

export function ContactForm({ value, onChange }: SectionProps<'contact'>) {
  const set = <K extends keyof PortfolioData['contact']>(k: K, v: PortfolioData['contact'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Email">
        <TextInput value={value.email} onChange={(v) => set('email', v)} type="email" />
      </Field>
      <Field label="Phone">
        <TextInput value={value.phone} onChange={(v) => set('phone', v)} />
      </Field>
      <Field label="Location">
        <TextInput value={value.location} onChange={(v) => set('location', v)} />
      </Field>
      {(Object.keys(value) as (keyof PortfolioData['contact'])[])
        .filter((key) => !['email', 'phone', 'location'].includes(key))
        .map((key) => (
          <Field key={key} label={key}>
            <TextInput value={value[key]} onChange={(next) => set(key, next)} />
          </Field>
        ))}
    </div>
  );
}

type Experience = PortfolioData['experiences'][number];
export function ExperiencesForm({ value, onChange }: SectionProps<'experiences'>) {
  return (
    <ItemList<Experience>
      items={value}
      onChange={onChange}
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
  );
}

type Project = PortfolioData['projects'][number];
export function ProjectsForm({ value, onChange }: SectionProps<'projects'>) {
  return (
    <ItemList<Project>
      items={value}
      onChange={onChange}
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
  );
}

type Dashboard = PortfolioData['dashboards'][number];
export function DashboardsForm({ value, onChange }: SectionProps<'dashboards'>) {
  return (
    <ItemList<Dashboard>
      items={value}
      onChange={onChange}
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
  );
}

type Education = PortfolioData['education'][number];
export function EducationForm({ value, onChange }: SectionProps<'education'>) {
  return (
    <ItemList<Education>
      items={value}
      onChange={onChange}
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
  );
}

type SkillGroup = PortfolioData['skills'][number];
export function SkillsForm({ value, onChange }: SectionProps<'skills'>) {
  return (
    <ItemList<SkillGroup>
      items={value}
      onChange={onChange}
      emptyItem={() => ({ category: '', skills: [] })}
      itemLabel={(g) => g.category || '(untitled group)'}
      renderItem={(item, _update, set) => (
        <>
          <Field label="Category"><TextInput value={item.category} onChange={(v) => set('category', v)} /></Field>
          <Field label="Skills"><StringList values={item.skills} onChange={(v) => set('skills', v)} /></Field>
        </>
      )}
    />
  );
}

type Certification = PortfolioData['certifications'][number];
export function CertificationsForm({ value, onChange }: SectionProps<'certifications'>) {
  return (
    <ItemList<Certification>
      items={value}
      onChange={onChange}
      emptyItem={() => ({ name: '', issuer: '', date: '', link: '' })}
      itemLabel={(c) => c.name || '(untitled certification)'}
      renderItem={(item, _update, set) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name"><TextInput value={item.name} onChange={(v) => set('name', v)} /></Field>
          <Field label="Issuer"><TextInput value={item.issuer} onChange={(v) => set('issuer', v)} /></Field>
          <Field label="Date"><TextInput value={item.date} onChange={(v) => set('date', v)} /></Field>
          <Field label="Link"><TextInput value={item.link} onChange={(v) => set('link', v)} /></Field>
        </div>
      )}
    />
  );
}
