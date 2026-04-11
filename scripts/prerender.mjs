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
  const { personal, experiences, projects, skills, education, certifications } = data;

  const experienceHTML = experiences.map(exp => `
    <article>
      <h3>${esc(exp.title)}</h3>
      <p>${esc(exp.company)} &mdash; ${esc(exp.location)}</p>
      <p>${esc(exp.period)} | ${esc(exp.type)}</p>
      <ul>${exp.description.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
    </article>`).join('');

  const projectsHTML = projects.map(proj => `
    <article>
      <h3>${esc(proj.title)}</h3>
      <p>${esc(proj.organization)} &mdash; ${esc(proj.date)}</p>
      <p>${esc(proj.role)}</p>
      <ul>${proj.description.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      <p>Tags: ${proj.tags.map(esc).join(', ')}</p>
    </article>`).join('');

  const skillsHTML = skills.map(group => `
    <div>
      <h3>${esc(group.category)}</h3>
      <p>${group.skills.map(esc).join(', ')}</p>
    </div>`).join('');

  const educationHTML = education.map(edu => `
    <article>
      <h3>${esc(edu.degree)}</h3>
      <p>${esc(edu.institution)} &mdash; ${esc(edu.location)}</p>
      <p>${esc(edu.period)}</p>
      ${edu.details ? `<ul>${edu.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
    </article>`).join('');

  const certsHTML = certifications.map(cert => `
    <article>
      <h3>${esc(cert.name)}</h3>
      <p>${esc(cert.issuer)} &mdash; ${esc(cert.date)}</p>
    </article>`).join('');

  return `
<div id="prerendered" aria-hidden="false">
  <header>
    <h1>${esc(personal.name)}</h1>
    <p>${esc(personal.title)}</p>
    <p>${esc(personal.location)}</p>
  </header>
  <main>
    <section id="about">
      <h2>About</h2>
      <p>${esc(stripMarkdown(personal.about))}</p>
    </section>
    <section id="experience">
      <h2>Experience</h2>
      ${experienceHTML}
    </section>
    <section id="skills">
      <h2>Skills</h2>
      ${skillsHTML}
    </section>
    <section id="projects">
      <h2>Projects</h2>
      ${projectsHTML}
    </section>
    <section id="education">
      <h2>Education</h2>
      ${educationHTML}
    </section>
    <section id="certifications">
      <h2>Certifications</h2>
      ${certsHTML}
    </section>
  </main>
</div>`;
}
