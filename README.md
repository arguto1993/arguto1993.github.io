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

   **Automatic (recommended):** push to `master` — the CI workflow builds, deploys, and pings IndexNow automatically.

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
- Each section can be shown or hidden via `src/sections.json`
- All content managed in a single `src/data.json` — no code changes needed
- SEO-ready: meta tags, Open Graph, Twitter Card, and JSON-LD structured data (Person, WebSite, BreadcrumbList) are all auto-generated from `data.json` at build time
- Pre-rendered static HTML injected at build time so crawlers (Google, AI assistants) can read content without executing JavaScript
- `robots.txt` and `sitemap.xml` auto-generated at build time
- CI/CD via GitHub Actions: push to `master` triggers build, deploy, and IndexNow ping


## ⚙️ Customization

| What to change | Where |
| --- | --- |
| Personal info, experience, skills, projects, education | `src/data.json` |
| Section visibility (show/hide) | `src/sections.json` |
| Images | `public/images/` |

> SEO meta tags, Open Graph, and JSON-LD are all derived from `data.json` automatically — no manual updates needed.

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
├── public/
│   ├── robots.txt       # Allows all crawlers; points to sitemap.xml
│   └── images/
│       ├── favicon/
│       ├── logo/
│       ├── portrait/
│       └── projects/
└── src/
    ├── App.tsx
    ├── constants.ts
    ├── data.json        # All portfolio content lives here
    ├── sections.json    # Toggle section visibility
    ├── index.css
    ├── main.tsx
    ├── types.ts
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
