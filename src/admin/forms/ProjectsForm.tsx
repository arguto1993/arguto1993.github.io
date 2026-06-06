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
        emptyItem={() => ({ title: '', organization: '', date: '', role: '', domain: '', background: '', goal: '', description: [''], keyInsights: [], techStack: [], relatedSkills: [], image: '', dashboardLink: '', githubLink: '', presentationLink: '', videoLink: '', link: '', github: '' })}
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
              <Field label="Domain (e.g. Retail & E-Commerce)">
                <TextInput value={item.domain ?? ''} onChange={(v) => set('domain', v)} />
              </Field>
              <Field label="Direct Image URL (Google Drive links will auto-converted)">
                <TextInput value={item.image ?? ''} onChange={(v) => set('image', toDirectGoogleDriveImageUrl(v))} />
              </Field>
              <div className="grid gap-3">
                <Field label="Dashboard Link">
                  <TextInput value={item.dashboardLink ?? ''} onChange={(v) => set('dashboardLink', v)} />
                </Field>
                <Field label="GitHub Link">
                  <TextInput value={item.githubLink ?? ''} onChange={(v) => set('githubLink', v)} />
                </Field>
                <Field label="Presentation Link">
                  <TextInput value={item.presentationLink ?? ''} onChange={(v) => set('presentationLink', v)} />
                </Field>
                <Field label="Video Link">
                  <TextInput value={item.videoLink ?? ''} onChange={(v) => set('videoLink', v)} />
                </Field>
              </div>
            </div>
            <Field label="Background">
              <TextInput value={item.background ?? ''} onChange={(v) => set('background', v)} />
            </Field>
            <Field label="Goal">
              <TextInput value={item.goal ?? ''} onChange={(v) => set('goal', v)} />
            </Field>
            <Field label="Description bullets">
              <StringList values={item.description} onChange={(v) => set('description', v)} />
            </Field>
            <Field label="Key Insights & Results">
              <StringList values={item.keyInsights ?? []} onChange={(v) => set('keyInsights', v)} />
            </Field>
            <Field label="Tech Stack">
              <StringList values={item.techStack ?? []} onChange={(v) => set('techStack', v)} />
            </Field>
            <Field label="Related Skills">
              <StringList values={item.relatedSkills ?? []} onChange={(v) => set('relatedSkills', v)} />
            </Field>
          </>
        )}
      />
    </div>
  );
}
