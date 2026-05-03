import { Field, TextArea, TextInput } from '../primitives';
import type { PortfolioData } from '../types';
import { SectionToggle, type SectionProps } from './shared';

export function AboutForm({ value, onChange }: SectionProps<'about'>) {
  const set = <K extends keyof PortfolioData['about']>(k: K, v: PortfolioData['about'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <Field label="Title">
        <TextInput value={value.title} onChange={(v) => set('title', v)} />
      </Field>
      <Field label="Content (markdown: **bold**, __italic__)">
        <TextArea
          value={value.content}
          onChange={(content) => onChange({ ...value, content })}
          rows={20}
        />
      </Field>
    </div>
  );
}
