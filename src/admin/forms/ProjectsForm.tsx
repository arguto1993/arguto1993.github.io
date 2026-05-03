import { Field, ItemList, StringList, TextInput } from '../primitives';
import type { PortfolioData } from '../../types';
import { SectionToggle, toDirectGoogleDriveImageUrl, type SectionProps } from './shared';

type Project = PortfolioData['projects']['items'][number];

export function ProjectsForm({ value, onChange }: SectionProps<'projects'>) {
  const set = <K extends keyof PortfolioData['projects']>(k: K, v: PortfolioData['projects'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <div className="grid gap-4 mb-2">
        <Field label="Title">
          <TextInput value={value.title} onChange={(v) => set('title', v)} />
        </Field>
        <Field label="Subtitle">
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
            <div className="grid gap-3">
              <Field label="Title">
                <TextInput value={item.title} onChange={(v) => set('title', v)} />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Organization">
                  <TextInput value={item.organization} onChange={(v) => set('organization', v)} />
                </Field>
                <Field label="Date">
                  <TextInput value={item.date} onChange={(v) => set('date', v)} />
                </Field>
              </div>
              <Field label="Role">
                <TextInput value={item.role} onChange={(v) => set('role', v)} />
              </Field>
              <div className="grid gap-3">
                <Field label="Direct Image URL (Google Drive links will auto-converted)">
                  <TextInput value={item.image ?? ''} onChange={(v) => set('image', toDirectGoogleDriveImageUrl(v))} />
                </Field>
                <Field label="Link">
                  <TextInput value={item.link ?? ''} onChange={(v) => set('link', v)} />
                </Field>
                <Field label="GitHub">
                  <TextInput value={item.github ?? ''} onChange={(v) => set('github', v)} />
                </Field>
              </div>
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
