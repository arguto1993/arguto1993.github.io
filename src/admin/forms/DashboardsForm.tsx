import { Field, ItemList, TextArea, TextInput } from '../primitives';
import type { PortfolioData } from '../../types';
import { SectionToggle, toDirectGoogleDriveImageUrl, type SectionProps } from './shared';

type Dashboard = PortfolioData['dashboards']['items'][number];

export function DashboardsForm({ value, onChange }: SectionProps<'dashboards'>) {
  const set = <K extends keyof PortfolioData['dashboards']>(k: K, v: PortfolioData['dashboards'][K]) =>
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
              <Field label="Image URL"><TextInput value={item.image} onChange={(v) => set('image', toDirectGoogleDriveImageUrl(v))} /></Field>
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
