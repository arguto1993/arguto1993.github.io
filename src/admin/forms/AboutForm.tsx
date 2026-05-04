import { Field, StringList, TextArea, TextInput } from '../primitives';
import type { PortfolioData } from '../../types';
import { SectionToggle, type SectionProps } from './shared';

export function AboutForm({ value, onChange }: SectionProps<'about'>) {
  const set = <K extends keyof PortfolioData['about']>(k: K, v: PortfolioData['about'][K]) =>
    onChange({ ...value, [k]: v });
  const setTooltip = (key: string, nextKey: string, nextValue: string) => {
    const tooltips = { ...value.tooltips };
    delete tooltips[key];
    tooltips[nextKey] = nextValue;
    set('tooltips', tooltips);
  };
  return (
    <div className="grid gap-4">
      <SectionToggle show={value.show} onChange={(v) => set('show', v)} />
      <Field label="Title">
        <TextInput value={value.title} onChange={(v) => set('title', v)} />
      </Field>
      <Field label="Greeting messages">
        <StringList
          values={value.greetingMessages}
          onChange={(v) => set('greetingMessages', v)}
        />
      </Field>
      <Field label="Content (markdown: **bold**, __italic__)">
        <TextArea
          value={value.content}
          onChange={(content) => onChange({ ...value, content })}
          rows={20}
        />
      </Field>
      <Field label="Tooltip text for __italic__ terms">
        <div className="grid gap-2">
          {Object.entries(value.tooltips).map(([key, tooltip]) => (
            <div key={key} className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
              <TextInput
                value={key}
                onChange={(nextKey) => setTooltip(key, nextKey, tooltip)}
              />
              <TextInput
                value={tooltip}
                onChange={(nextTooltip) => setTooltip(key, key, nextTooltip)}
              />
              <button
                type="button"
                onClick={() => {
                  const { [key]: _removed, ...tooltips } = value.tooltips;
                  set('tooltips', tooltips);
                }}
                className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set('tooltips', { ...value.tooltips, Term: 'Tooltip' })}
            className="text-xs text-[var(--accent)] hover:underline justify-self-start"
          >
            + Add tooltip
          </button>
        </div>
      </Field>
    </div>
  );
}
