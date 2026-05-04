import { Field, ItemList, StringList, TextInput } from '../primitives';
import type { PortfolioData } from '../../types';
import { SectionToggle, type SectionProps } from './shared';

type EducationItem = PortfolioData['education']['items'][number];

export function EducationForm({ value, onChange }: SectionProps<'education'>) {
  const set = <K extends keyof PortfolioData['education']>(k: K, v: PortfolioData['education'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <Field label="Title">
        <TextInput value={value.title} onChange={(v) => set('title', v)} />
      </Field>
      <ItemList<EducationItem>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ degree: '', institution: '', location: '', period: '', details: [] })}
        itemLabel={(e) => e.degree || '(untitled education)'}
        renderItem={(item, _update, set) => (
          <>
            <div className="grid gap-3">
              <Field label="Degree"><TextInput value={item.degree} onChange={(v) => set('degree', v)} /></Field>
              <Field label="Institution"><TextInput value={item.institution} onChange={(v) => set('institution', v)} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Location"><TextInput value={item.location} onChange={(v) => set('location', v)} /></Field>
                <Field label="Period"><TextInput value={item.period} onChange={(v) => set('period', v)} /></Field>
              </div>
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
