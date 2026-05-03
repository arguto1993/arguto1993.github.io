import { Field, ItemList, StringList, TextInput } from '../primitives';
import type { PortfolioData } from '../../types';
import { SectionToggle, type SectionProps } from './shared';

type SkillGroup = PortfolioData['skills']['items'][number];

export function SkillsForm({ value, onChange }: SectionProps<'skills'>) {
  const set = <K extends keyof PortfolioData['skills']>(k: K, v: PortfolioData['skills'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <Field label="Title">
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
