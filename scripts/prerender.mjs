/**
 * prerender.mjs
 *
 * Post-build script that injects the portfolio content from data.json as static
 * HTML into dist/index.html. Crawlers (Google, AI assistants) read this HTML
 * directly without executing JavaScript. React takes over in the browser as usual.
 *
 * Run automatically via the "postbuild" npm script.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const dataPath = path.join(rootDir, 'src', 'data.json');
const indexPath = path.join(rootDir, 'dist', 'index.html');
const DEFAULT_HOMEPAGE = 'https://arguto1993.github.io';

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found — run "npm run build" first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
let html = fs.readFileSync(indexPath, 'utf-8');

const staticHTML = generateStaticHTML(data);

// Inject into the root div so crawlers see the content
html = html.replace('<div id="root"></div>', `<div id="root">${staticHTML}</div>`);

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('✓ Pre-rendering complete: portfolio content injected into dist/index.html');

// ── Sitemap generation ───────────────────────────────────────────────────────

const BASE_URL = String(data.brand.homepage || DEFAULT_HOMEPAGE).replace(/\/$/, '');

/** Convert "April 12, 2026" → "2026-04-12" (W3C datetime for <lastmod>) */
function toW3CDate(humanDate) {
  const d = new Date(humanDate);
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  return d.toISOString().split('T')[0];
}

const lastmod = toW3CDate(data.brand.lastUpdated);

const sitemapUrls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'monthly' },
];

const SECTION_MAP = [
  { id: 'about', show: data.about.show, title: data.about.title },
  { id: 'skills', show: data.skills.show, title: data.skills.title },
  { id: 'experience', show: data.experience.show, title: data.experience.title },
  { id: 'projects', show: data.projects.show, title: data.projects.title },
  { id: 'dashboards', show: data.dashboards.show, title: data.dashboards.title },
  { id: 'education', show: data.education.show, title: data.education.title },
  { id: 'contact', show: data.contact.show, title: data.contact.title },
];
for (const { id, show } of SECTION_MAP) {
  if (!show) continue;
  sitemapUrls.push({ loc: `${BASE_URL}/#${id}`, priority: '0.8', changefreq: 'monthly' });
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const sitemapPath = path.join(rootDir, 'dist', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
console.log(`✓ Sitemap written: ${sitemapUrls.length} URLs → dist/sitemap.xml`);

// ---------------------------------------------------------------------------

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Strip markdown bold/italic/underline markers from about text */
function stripMarkdown(str = '') {
  return str.replace(/\*\*/g, '').replace(/__/g, '').replace(/\n/g, ' ');
}

function generateStaticHTML(data) {
  const { hero, about, skills, experience, projects, dashboards, education, contact } = data;

  const skillsHTML = skills.items.map(group => `
    <div>
      <h3>${esc(group.category)}</h3>
      <p>${group.skills.map(esc).join(', ')}</p>
    </div>`).join('');
    
  const experienceHTML = experience.items.map(exp => `
    <article>
      <h3>${esc(exp.title)}</h3>
      <p>${esc(exp.company)} &mdash; ${esc(exp.location)}</p>
      <p>${esc(exp.period)} | ${esc(exp.type)}</p>
      <ul>${exp.description.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
    </article>`).join('');

  const projectsHTML = projects.items.map(proj => `
    <article>
      <h3>${esc(proj.title)}</h3>
      <p>${esc(proj.organization)} &mdash; ${esc(proj.date)}</p>
      <p>${esc(proj.role)}</p>
      <ul>${proj.description.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      <p>Tags: ${proj.tags.map(esc).join(', ')}</p>
    </article>`).join('');

  const dashboardsHTML = dashboards.items.map(dashboard => `
    <article>
      <h3>${esc(dashboard.title)}</h3>
      <p>${esc(dashboard.platform)}</p>
      <p>${esc(dashboard.description)}</p>
    </article>`).join('');

  const educationHTML = education.items.map(edu => `
    <article>
      <h3>${esc(edu.degree)}</h3>
      <p>${esc(edu.institution)} &mdash; ${esc(edu.location)}</p>
      <p>${esc(edu.period)}</p>
      ${edu.details ? `<ul>${edu.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
    </article>`).join('');

  const certsHTML = education.certifications.items.map(cert => `
    <article>
      <h3>${esc(cert.name)}</h3>
      <p>${esc(cert.issuer)} &mdash; ${esc(cert.date)}</p>
    </article>`).join('');

  const contactHTML = contact.items.map(item => `
    <p>${esc(item.label)}: ${esc(item.value)}</p>`).join('');

  const sections = [
    about.show && `
    <section id="about">
      <h2>${esc(about.title)}</h2>
      ${about.subtitle ? `<p>${esc(about.subtitle)}</p>` : ''}
      <p>${esc(stripMarkdown(about.content))}</p>
    </section>`,
    skills.show && `
    <section id="skills">
      <h2>${esc(skills.title)}</h2>
      ${skills.subtitle ? `<p>${esc(skills.subtitle)}</p>` : ''}
      ${skillsHTML}
    </section>`,
    experience.show && `
    <section id="experience">
      <h2>${esc(experience.title)}</h2>
      ${experience.subtitle ? `<p>${esc(experience.subtitle)}</p>` : ''}
      ${experienceHTML}
    </section>`,
    projects.show && `
    <section id="projects">
      <h2>${esc(projects.title)}</h2>
      ${projects.subtitle ? `<p>${esc(projects.subtitle)}</p>` : ''}
      ${projectsHTML}
    </section>`,
    dashboards.show && `
    <section id="dashboards">
      <h2>${esc(dashboards.title)}</h2>
      ${dashboards.subtitle ? `<p>${esc(dashboards.subtitle)}</p>` : ''}
      ${dashboardsHTML}
    </section>`,
    education.show && `
    <section id="education">
      <h2>${esc(education.title)}</h2>
      ${education.subtitle ? `<p>${esc(education.subtitle)}</p>` : ''}
      ${educationHTML}
      <h3>${esc(education.certifications.title)}</h3>
      ${certsHTML}
    </section>`,
    contact.show && `
    <section id="contact">
      <h2>${esc(contact.title)}</h2>
      ${contact.subtitle ? `<p>${esc(contact.subtitle)}</p>` : ''}
      ${contactHTML}
    </section>`,
  ].filter(Boolean).join('');

  return `
<div id="prerendered" aria-hidden="false">
  <header>
    <h1>${esc(hero.name)}</h1>
    <p>${esc(hero.title)}</p>
    <p>${esc(contact.items.find(i => i.icon === 'map')?.value ?? '')}</p>
  </header>
  <main>
${sections}
  </main>
</div>`;
}
