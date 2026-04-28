- Consult [README.md](../README.md) when you need project context — structure, features, stack
- Skip it for small edits where the context isn't needed
- End every reply with `Files read: x | Read README: 1/0` (x = total files read, partial or full)

- After any refactor, file rename, or structural change — update README.md in the same pass

- All site content goes in `src/data.json` — not scattered across components
- Whenever `src/data.json` is modified, update `footer.lastUpdated` to today's date (e.g. `"April 12, 2026"`)
- Section visibility is controlled via `src/sections.json`
- SEO meta tags, Open Graph, and JSON-LD are auto-generated from `data.json` by the `portfolioSeoPlugin` in `vite.config.ts`
- don't hardcode any info in `index.html`
- Static HTML pre-rendering runs via `scripts/prerender.mjs` as a `postbuild` hook — don't remove it
- Tailwind 4 syntax — no `tailwind.config.js`, use CSS variable tokens and `@layer`
- No backend, no auth, no persistence — purely static site deployed to GitHub Pages

Approach:
- Read existing files before writing code
- Be concise in output but thorough in reasoning
- Do not re-read files you have already read unless the file may have changed
- No sycophantic openers or closing fluff
