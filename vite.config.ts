import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

/** Reads data.json and injects SEO meta tags + JSON-LD into the built HTML. */
function portfolioSeoPlugin(): Plugin {
  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      const data = JSON.parse(fs.readFileSync('./src/data.json', 'utf-8'));
      const { hero, brand, contact, skills } = data;

      const allSkills = skills.flatMap((g: { skills: string[] }) => g.skills);
      const description =
        `Data Professional with 9+ years of cross-sector experience in analytics, ` +
        `data engineering, and machine learning. Skilled in Python, SQL, BigQuery, ` +
        `ClickHouse, and BI platforms. Based in ${contact.location}.`;

      const jsonLdPerson = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: hero.name,
        alternateName: brand.nickname,
        jobTitle: hero.title,
        description: `Data Professional with 9+ years of cross-sector experience turning complex data into strategic business insights.`,
        url: contact.portfolio,
        email: contact.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: contact.location.split(',')[0]?.trim(),
          addressCountry: 'ID',
        },
        sameAs: [contact.linkedin, contact.github, contact.medium, contact.hackerrank],
        knowsAbout: allSkills,
        worksFor: {
          '@type': 'Organization',
          name: data.experiences[0]?.company ?? '',
        },
      });

      const jsonLdWebSite = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: `${hero.name} — Portfolio`,
        url: `${contact.portfolio}/`,
        description,
        author: { '@type': 'Person', name: hero.name },
      });

      const sectionIds = ['about', 'experience', 'skills', 'projects', 'education', 'contact'];
      const jsonLdBreadcrumbs = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: sectionIds.map((id, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          item: `${contact.portfolio}/#${id}`,
        })),
      });

      const verifyTag = brand.googleVerification
        ? `\n    <meta name="google-site-verification" content="${brand.googleVerification as string}" />`
        : '';

      const tags = `
    <!-- Primary SEO -->${verifyTag}
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${allSkills.join(', ')}, ${hero.name}, ${brand.nickname}" />
    <meta name="author" content="${hero.name}" />
    <link rel="canonical" href="${contact.portfolio}/" />

    <!-- Open Graph / Social -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${contact.portfolio}/" />
    <meta property="og:title" content="${hero.name} — ${hero.title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${contact.portfolio}/images/logo/white.png" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:url" content="${contact.portfolio}/" />
    <meta name="twitter:title" content="${hero.name} — ${hero.title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${contact.portfolio}/images/logo/white.png" />

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">${jsonLdPerson}</script>
    <script type="application/ld+json">${jsonLdWebSite}</script>
    <script type="application/ld+json">${jsonLdBreadcrumbs}</script>`;

      let result = html.replace(
        '<title>Arguto Portfolio</title>',
        `<title>Arguto Portfolio</title>`,
      );
      return result.replace('</head>', `${tags}\n  </head>`);
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    plugins: [react(), tailwindcss(), portfolioSeoPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
