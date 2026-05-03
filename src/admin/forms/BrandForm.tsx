import { Field, TextInput } from '../primitives';
import type { PortfolioData } from '../types';
import type { SectionProps } from './shared';

export function BrandForm({ value, onChange }: SectionProps<'brand'>) {
  const set = <K extends keyof PortfolioData['brand']>(k: K, v: PortfolioData['brand'][K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Shortname">
          <TextInput value={value.shortname} onChange={(v) => set('shortname', v)} />
        </Field>
        <Field label="Nickname">
          <TextInput value={value.nickname} onChange={(v) => set('nickname', v)} />
        </Field>
      </div>
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
