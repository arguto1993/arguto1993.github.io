import { Field, ItemList, TextInput } from '../primitives';
import type { PortfolioData } from '../../types';
import { SectionToggle, type SectionProps } from './shared';

export function ContactForm({ value, onChange }: SectionProps<'contact'>) {
  const set = <K extends keyof PortfolioData['contact']>(k: K, v: PortfolioData['contact'][K]) =>
    onChange({ ...value, [k]: v });
  type ContactItem = PortfolioData['contact']['items'][number];
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
      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(value) as (keyof PortfolioData['contact'])[])
          .filter((key) => !['show', 'title', 'subtitle', 'email', 'phone', 'location', 'items'].includes(key))
          .map((key) => (
            <Field key={key} label={key}>
              <TextInput value={value[key] as string} onChange={(next) => set(key, next as never)} />
            </Field>
          ))}
      </div>
      <ItemList<ContactItem>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ icon: 'mail', label: '', value: '', href: '' })}
        itemLabel={(item) => item.label || '(untitled contact)'}
        renderItem={(item, _update, set) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Icon">
              <TextInput value={item.icon} onChange={(v) => set('icon', v as ContactItem['icon'])} />
            </Field>
            <Field label="Label">
              <TextInput value={item.label} onChange={(v) => set('label', v)} />
            </Field>
            <Field label="Display value">
              <TextInput value={item.value} onChange={(v) => set('value', v)} />
            </Field>
            <Field label="Link">
              <TextInput value={item.href ?? ''} onChange={(v) => set('href', v)} />
            </Field>
          </div>
        )}
      />
    </div>
  );
}
