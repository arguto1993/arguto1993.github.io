import { Field, TextArea, TextInput } from '../primitives';
import type { PortfolioData } from '../../types';
import type { SectionProps } from './shared';

export function HeroForm({ value, onChange }: SectionProps<'hero'>) {
  const set = <K extends keyof PortfolioData['hero']>(k: K, v: PortfolioData['hero'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        Hero is always shown. The <code>show</code> field stays in data.json only for section schema consistency.
      </p>
      <div className="grid gap-4">
        <Field label="Title (badge)">
          <TextInput value={value.title} onChange={(v) => set('title', v)} />
        </Field>
        <Field label="Full Name">
          <TextInput value={value.name} onChange={(v) => set('name', v)} />
        </Field>
      </div>
      <Field label="Subtitle (Tagline)">
        <TextArea
          value={value.subtitle}
          onChange={(v) => set('subtitle', v)}
          rows={3}
        />
      </Field>
    </div>
  );
}
