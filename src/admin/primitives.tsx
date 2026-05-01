import { type ReactNode } from 'react';

export const inputCls =
  'w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      className={inputCls}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      className={inputCls}
      rows={rows}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function RowButtons({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const btn =
    'px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30';
  return (
    <div className="flex gap-1 shrink-0">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(-1)}>
        ↑
      </button>
      <button
        type="button"
        className={btn}
        disabled={index === length - 1}
        onClick={() => onMove(1)}
      >
        ↓
      </button>
      <button
        type="button"
        className={`${btn} text-red-600 dark:text-red-400`}
        onClick={onRemove}
      >
        ✕
      </button>
    </div>
  );
}

export function StringList({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const update = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputCls}
            value={v}
            placeholder={placeholder}
            onChange={(e) => update(i, e.target.value)}
          />
          <RowButtons
            index={i}
            length={values.length}
            onMove={(dir) => onChange(move(values, i, dir))}
            onRemove={() => onChange(values.filter((_, k) => k !== i))}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="text-xs text-[var(--accent)] hover:underline"
      >
        + Add item
      </button>
    </div>
  );
}

export function ItemList<T>({
  items,
  onChange,
  emptyItem,
  renderItem,
  itemLabel,
}: {
  items: T[];
  onChange: (v: T[]) => void;
  emptyItem: () => T;
  renderItem: (item: T, update: (next: T) => void, set: <K extends keyof T>(k: K, v: T[K]) => void) => ReactNode;
  itemLabel: (item: T, i: number) => string;
}) {
  const update = (i: number, next: T) => {
    const arr = [...items];
    arr[i] = next;
    onChange(arr);
  };
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const itemUpdate = (next: T) => update(i, next);
        const set = <K extends keyof T>(k: K, v: T[K]) => itemUpdate({ ...item, [k]: v });
        return (
          <details
            key={i}
            open={i === 0}
            className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="cursor-pointer select-none px-4 py-2 flex items-center justify-between gap-2 list-none hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg">
              <span className="flex items-center gap-2 min-w-0">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform group-open:rotate-90"
                  fill="currentColor"
                >
                  <path d="M7 5l6 5-6 5V5z" />
                </svg>
                <span className="text-sm font-medium truncate">
                  {itemLabel(item, i) || `Item ${i + 1}`}
                </span>
              </span>
              <RowButtons
                index={i}
                length={items.length}
                onMove={(dir) => onChange(move(items, i, dir))}
                onRemove={() => onChange(items.filter((_, k) => k !== i))}
              />
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-3">
              {renderItem(item, itemUpdate, set)}
            </div>
          </details>
        );
      })}
      <button
        type="button"
        onClick={() => onChange([...items, emptyItem()])}
        className="text-sm text-[var(--accent)] hover:underline"
      >
        + Add new
      </button>
    </div>
  );
}
