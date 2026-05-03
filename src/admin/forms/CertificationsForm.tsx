import { Field, ItemList, TextInput } from '../primitives';
import type { PortfolioData } from '../../types';

type CertGroup = PortfolioData['education']['certifications'];

export function CertificationsForm({ value, onChange }: { value: CertGroup; onChange: (v: CertGroup) => void }) {
  type Cert = CertGroup['items'][number];
  return (
    <div className="grid gap-4">
      <Field label="Title">
        <TextInput value={value.title} onChange={(title) => onChange({ ...value, title })} />
      </Field>
      <ItemList<Cert>
        items={value.items}
        onChange={(items) => onChange({ ...value, items })}
        emptyItem={() => ({ name: '', issuer: '', date: '', link: '' })}
        itemLabel={(c) => c.name || '(untitled certification)'}
        renderItem={(item, _update, set) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name"><TextInput value={item.name} onChange={(v) => set('name', v)} /></Field>
            <Field label="Issuer"><TextInput value={item.issuer} onChange={(v) => set('issuer', v)} /></Field>
            <Field label="Date"><TextInput value={item.date} onChange={(v) => set('date', v)} /></Field>
            <Field label="Link"><TextInput value={item.link ?? ''} onChange={(v) => set('link', v)} /></Field>
          </div>
        )}
      />
    </div>
  );
}
