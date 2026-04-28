export type InlineSegment =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string };

// Parses the markdown subset used in data.json: **bold** and __italic__.
// Unmatched markers are emitted as plain text so authoring typos don't blow up rendering.
export function parseInline(input: string): InlineSegment[] {
  const out: InlineSegment[] = [];
  let i = 0;
  while (i < input.length) {
    const bold = input.indexOf('**', i);
    const italic = input.indexOf('__', i);
    const next = [bold, italic].filter((n) => n !== -1).sort((a, b) => a - b)[0];
    if (next === undefined) {
      out.push({ type: 'text', value: input.slice(i) });
      break;
    }
    if (next > i) out.push({ type: 'text', value: input.slice(i, next) });
    const marker = input.slice(next, next + 2);
    const close = input.indexOf(marker, next + 2);
    if (close === -1) {
      out.push({ type: 'text', value: input.slice(i) });
      break;
    }
    out.push({
      type: marker === '**' ? 'bold' : 'italic',
      value: input.slice(next + 2, close),
    });
    i = close + 2;
  }
  return out;
}
