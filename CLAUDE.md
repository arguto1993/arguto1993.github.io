- Consult [README.md](../README.md) when you need project context — structure, features, stack
- Skip it for small edits where the context isn't needed
- End every reply with `Files read: x | Read README: 1/0` (x = total files read, partial or full)

- After any refactor, file rename, or structural change — update README.md in the same pass

- All site content goes in `src/data.json` — not scattered across components
- Whenever `src/data.json` is modified, update `brand.lastUpdated` to today's date (e.g. `"April 12, 2026"`)
- Section visibility is controlled via each section's `show` field in `src/data.json` (sections.json no longer exists)
- SEO meta tags, Open Graph, and JSON-LD are auto-generated from `data.json` by the `portfolioSeoPlugin` in `vite.config.ts`
- don't hardcode any info in `index.html`
- Static HTML pre-rendering runs via `scripts/prerender.mjs` as a `postbuild` hook — don't remove it; keep its field references and section order in sync whenever `data.json` structure changes
- Tailwind 4 syntax — no `tailwind.config.js`, use CSS variable tokens and `@layer`
- No backend server — deployed to GitHub Pages; the admin page (`#/admin`) uses GitHub OAuth (token in
  sessionStorage) and commits changes directly via the GitHub API
