import { Field, ItemList, StringList, TextInput } from '../primitives';
import type { PortfolioData } from '../../types';
import { SectionToggle, type SectionProps } from './shared';

type Experience = PortfolioData['experience']['items'][number];

export function ExperienceForm({ value, onChange }: SectionProps<'experience'>) {
  const set = <K extends keyof PortfolioData['experience']>(k: K, v: PortfolioData['experience'][K]) =>
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
