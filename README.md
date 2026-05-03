# Arguto (Argo Wahyu Utomo) Portfolio Website

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-FF0055?style=flat&logo=framer&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat&logo=github&logoColor=white)

My professional portfolio website built with React and TypeScript.

## 🚀 Quick Start

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Deploy to GitHub Pages:

   **Automatic:** push to `master` — the CI workflow builds, deploys, and pings IndexNow automatically.

   **Manual:**

   ```bash
   npm run deploy
   ```

   > ⚠️ **Do not delete the `gh-pages` branch.** It holds the built site that GitHub Pages serves.
   > GitHub Pages settings must point to `gh-pages` branch / `/ (root)`.
   > Deleting the branch takes the site down.

## ✨ Features

- Responsive portfolio website
- Dark/light theme support
- Sections for Home, About, Skills, Experience, Projects, Dashboards, Education, and Contact
- Each content section can be shown or hidden via the `show` flag inside each section in `src/data.json`, or via the admin page
- The Hero section is always shown; `hero.show` remains in `src/data.json` only for section schema consistency
- All content managed in a single `src/data.json` — no code changes needed
- SEO-ready: meta tags, Open Graph, Twitter Card, and JSON-LD structured data
  (Person, WebSite, BreadcrumbList) are all auto-generated from `data.json` at build time
- Pre-rendered static HTML injected at build time so search crawlers (Googlebot, Bingbot) and LLM bots
  (GPTBot, ClaudeBot, PerplexityBot) can read content without executing JavaScript
- `robots.txt` and `sitemap.xml` auto-generated at build time
- CI/CD via GitHub Actions: push to `master` triggers build, deploy, and IndexNow ping

## ⚙️ Customization

| What to change | Where |
| --- | --- |
| All content, section titles, and visibility (show/hide) | `src/data.json` (or the admin page — see below) |

> SEO meta tags, Open Graph, and JSON-LD are all derived from `data.json` automatically — no manual updates needed.
> `brand.homepage` is used for canonical URLs, Open Graph/Twitter images, JSON-LD, and sitemap URLs.

## 🔐 Admin page (`#/admin`)

Edit `src/data.json` from the live site instead of by hand. The admin route signs in
with GitHub OAuth, loads `data.json` via the GitHub Contents API, lets you edit each
section in a structured form, and commits the result back to `master` — which then
auto-deploys via the existing CI workflow.

**One-time setup:**

1. **Create a GitHub OAuth App** at <https://github.com/settings/developers> with
   Authorization callback URL `https://arguto1993.github.io/`. Note the
   **Client ID** and generate a **Client secret**.
2. **Deploy the Cloudflare Worker** in `worker/` — it does the OAuth code-exchange
   so the client secret never reaches the browser:

   ```bash
   cd worker
   wrangler deploy
   wrangler secret put GITHUB_CLIENT_SECRET   # paste the secret from step 1
   ```

   Then in `worker/wrangler.toml` set `GITHUB_CLIENT_ID` and confirm
   `ALLOWED_ORIGINS` matches your site origin.
3. **Set Vite env vars** in `.env.production` (committed; see `.env.example`):

   ```env
   VITE_GH_CLIENT_ID=<oauth client id>
   VITE_OAUTH_WORKER_URL=https://<your-worker>.workers.dev
   ```

**Use it:**

- Go to <https://arguto1993.github.io/#/admin>.
- Click **Sign in with GitHub** → approve.
- Edit fields → **Save**. A commit lands on `master`; GitHub Pages redeploys in ~1 min.

> Local dev (`npm run dev`) bypasses OAuth: `#/admin` opens directly with
> `src/data.json` loaded into the form so you can preview the UI. Save is
> disabled — commit content via the live admin page.

The admin route is lazy-loaded, marked `noindex`, and the OAuth token is held in
`sessionStorage` only. `brand.lastUpdated` is bumped to today on every save.

## 📁 Project Structure

```bash
├── index.html           # Minimal HTML shell (SEO tags injected at build time)
├── vite.config.ts       # Vite config + portfolioSeoPlugin (injects SEO tags from data.json)
├── package.json
├── tsconfig.json
├── .github/
│   └── workflows/
│       └── deploy.yml   # CI: build → deploy to gh-pages → ping IndexNow
├── scripts/
│   ├── prerender.mjs    # Post-build: injects static HTML + generates dist/sitemap.xml
│   └── ping-indexing.mjs  # Pings Bing IndexNow after deploy
├── worker/
│   ├── oauth.ts         # Cloudflare Worker: GitHub OAuth code-exchange for #/admin
│   └── wrangler.toml
├── public/
│   ├── robots.txt       # Allows all crawlers; points to sitemap.xml
│   └── images/
│       ├── favicon/
│       ├── logo/
│       ├── portrait/
│       └── projects/
└── src/
    ├── App.tsx              # Routes to AdminApp on #/admin, otherwise the portfolio
    ├── SiteDataContext.tsx  # React context + useSiteData hook; default value from constants
    ├── constants.ts         # Section visibility flags (from data.json)
    ├── types.ts             # TypeScript interfaces for all data shapes
    ├── inlineMarkdown.ts    # Parses **bold** and __italic__ in about copy
    ├── data.json            # All content, homepage metadata, contact cards, and section flags
    ├── index.css
    ├── main.tsx
    ├── admin/           # #/admin editor — OAuth + GitHub Contents API
    │   ├── AdminApp.tsx
    │   ├── AdminPreviewPane.tsx
    │   ├── Preview.tsx
    │   ├── auth.ts
    │   ├── github.ts
    │   ├── forms/
    │   │   ├── AboutForm.tsx
    │   │   ├── BrandForm.tsx
    │   │   ├── CertificationsForm.tsx
    │   │   ├── ContactForm.tsx
    │   │   ├── DashboardsForm.tsx
    │   │   ├── EducationForm.tsx
    │   │   ├── ExperienceForm.tsx
    │   │   ├── HeroForm.tsx
    │   │   ├── ProjectsForm.tsx
    │   │   ├── SkillsForm.tsx
    │   │   ├── index.ts
    │   │   └── shared.tsx
    │   ├── primitives.tsx
    │   ├── sections.tsx
    │   ├── types.ts
    │   └── useAdminData.ts
    └── components/
        ├── About.tsx
        ├── Contact.tsx
        ├── Dashboards.tsx
        ├── Education.tsx
        ├── Experience.tsx
        ├── Footer.tsx
        ├── Hero.tsx
        ├── Navbar.tsx
        ├── Projects.tsx
        ├── Skills.tsx
        └── ThemeContext.tsx
```

## 👐 Open Source

Feel free to reuse, adapt, or extend this portfolio site repo for your own needs. You are welcome to [fork the repository](https://github.com/arguto1993/arguto1993.github.io) for personal or professional use, or [open an issue](https://github.com/arguto1993/arguto1993.github.io/issues) if you have suggestions or spot something worth improving.
