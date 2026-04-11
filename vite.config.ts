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
      const { personal, links, skills } = data;

      const allSkills = skills.flatMap((g: { skills: string[] }) => g.skills);
      const description =
        `Data Professional with 9+ years of cross-sector experience in analytics, ` +
        `data engineering, and machine learning. Skilled in Python, SQL, BigQuery, ` +
        `ClickHouse, and BI platforms. Based in ${personal.location}.`;

      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personal.name,
        alternateName: personal.nickname,
        jobTitle: personal.title,
        description: `Data Professional with 9+ years of cross-sector experience turning complex data into strategic business insights.`,
        url: links.portfolio,
        email: personal.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: personal.location.split(',')[0]?.trim(),
          addressCountry: 'ID',
        },
        sameAs: [links.linkedin, links.github, links.medium, links.hackerrank],
        knowsAbout: allSkills,
        worksFor: {
          '@type': 'Organization',
          name: data.experiences[0]?.company ?? '',
        },
      });

      const tags = `
    <!-- Primary SEO -->
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${allSkills.join(', ')}, ${personal.name}, ${personal.nickname}" />
    <meta name="author" content="${personal.name}" />
    <link rel="canonical" href="${links.portfolio}/" />

    <!-- Open Graph / Social -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${links.portfolio}/" />
    <meta property="og:title" content="${personal.name} — ${personal.title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${links.portfolio}/images/logo/white.png" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:url" content="${links.portfolio}/" />
    <meta name="twitter:title" content="${personal.name} — ${personal.title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${links.portfolio}/images/logo/white.png" />

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">${jsonLd}</script>`;

      return html.replace('</head>', `${tags}\n  </head>`);
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
