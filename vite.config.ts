import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import {
  getAllSkills,
  getContactByIcon,
  getHomepage,
  getVisibleSections,
} from './src/sectionRegistry.js';

/** Reads data.json and injects SEO meta tags + JSON-LD into the built HTML. */
function portfolioSeoPlugin(): Plugin {
  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      const data = JSON.parse(fs.readFileSync('./src/data.json', 'utf-8'));
      const { hero, brand, about, projects, education } = data;
      const homepage = getHomepage(data);
      const location = getContactByIcon(data, 'map')?.value ?? '';

      const allSkills = getAllSkills(data);

      const stripMarkdown = (str = '') =>
        String(str).replace(/\*\*/g, '').replace(/__/g, '').replace(/\s+/g, ' ').trim();
      const escAttr = (str = '') =>
        String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      const driveImageUrl = (url = '') => {
        if (!url) return '';
        const match = String(url).match(/\/d\/([^/]+)/) || String(url).match(/[?&]id=([^&]+)/);
        return match ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w200` : url;
      };

      // Derived from data.json (about copy + location) so the description stays in
      // sync with content edits instead of being hardcoded here.
      const aboutLead = stripMarkdown(about?.content ?? '').split('. ')[0];
      const description = aboutLead
        ? `${aboutLead}. Based in ${location}.`
        : `${hero.title} based in ${location}.`;

      const personSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: hero.name,
        alternateName: brand.nickname,
        jobTitle: hero.title,
        description,
        url: homepage,
        email: getContactByIcon(data, 'mail')?.value ?? '',
        address: {
          '@type': 'PostalAddress',
          addressLocality: location.split(',')[0]?.trim(),
          addressCountry: 'ID',
        },
        sameAs: ['linkedin', 'github', 'book', 'code'].map(
          (icon: string) => getContactByIcon(data, icon)?.href ?? ''
        ).filter(Boolean),
        knowsAbout: allSkills,
        worksFor: {
          '@type': 'Organization',
          name: data.experience?.items?.[0]?.company ?? '',
        },
      };

      // Education & certifications enrich the Person graph when the section is shown.
      if (education?.show) {
        personSchema.alumniOf = (education.items ?? []).map(
          (edu: { institution: string }) => ({
            '@type': 'EducationalOrganization',
            name: edu.institution,
          })
        );
        personSchema.hasCredential = (education.certifications?.items ?? []).map(
          (cert: { name: string; type: string; issuer: string; issuerLogo?: string; link?: string }) => ({
            '@type': 'EducationalOccupationalCredential',
            name: cert.name,
            credentialCategory: cert.type,
            recognizedBy: {
              '@type': 'Organization',
              name: cert.issuer,
              ...(cert.issuerLogo ? { logo: driveImageUrl(cert.issuerLogo) } : {}),
            },
            ...(cert.link ? { url: cert.link } : {}),
          })
        );
      }

      const visibleSections = getVisibleSections(data);

      const jsonLd: Record<string, unknown>[] = [
        personSchema,
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: `${hero.name} — Portfolio`,
          url: `${homepage}/`,
          description,
          author: { '@type': 'Person', name: hero.name },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: visibleSections.map((section, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: section.label,
            item: `${homepage}/${section.href}`,
          })),
        },
      ];

      // Projects as an ItemList of CreativeWorks so search/AI crawlers can read the portfolio.
      if (projects?.show && projects.items?.length) {
        jsonLd.push({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${projects.title} — ${hero.name}`,
          itemListElement: projects.items.map((proj: {
            title: string;
            goal?: string;
            background?: string;
            description?: string[];
            date?: string;
            techStack?: string[];
            relatedSkills?: string[];
            domain?: string;
            image?: string;
            githubLink?: string;
            dashboardLink?: string;
            presentationLink?: string;
          }, i: number) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'CreativeWork',
              name: proj.title,
              description: proj.goal || proj.background || proj.description?.[0] || '',
              dateCreated: proj.date,
              creator: { '@type': 'Person', name: hero.name },
              keywords: [...(proj.techStack ?? []), ...(proj.relatedSkills ?? [])].join(', '),
              ...(proj.domain ? { about: proj.domain } : {}),
              ...(proj.image ? { image: proj.image } : {}),
              ...((proj.githubLink || proj.dashboardLink || proj.presentationLink)
                ? { url: proj.githubLink || proj.dashboardLink || proj.presentationLink }
                : {}),
            },
          })),
        });
      }

      const verifyTag = brand.googleVerification
        ? `\n    <meta name="google-site-verification" content="${brand.googleVerification as string}" />`
        : '';

      const jsonLdTags = jsonLd
        .map((schema) => `    <script type="application/ld+json">${JSON.stringify(schema)}</script>`)
        .join('\n');

      const tags = `
    <!-- Primary SEO -->${verifyTag}
    <meta name="description" content="${escAttr(description)}" />
    <meta name="keywords" content="${escAttr(`${allSkills.join(', ')}, ${hero.name}, ${brand.nickname}`)}" />
    <meta name="author" content="${escAttr(hero.name)}" />
    <link rel="canonical" href="${homepage}/" />

    <!-- Open Graph / Social -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${homepage}/" />
    <meta property="og:title" content="${escAttr(`${hero.name} — ${hero.title}`)}" />
    <meta property="og:description" content="${escAttr(description)}" />
    <meta property="og:image" content="${homepage}/images/logo/white.png" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:url" content="${homepage}/" />
    <meta name="twitter:title" content="${escAttr(`${hero.name} — ${hero.title}`)}" />
    <meta name="twitter:description" content="${escAttr(description)}" />
    <meta name="twitter:image" content="${homepage}/images/logo/white.png" />

    <!-- JSON-LD Structured Data -->
${jsonLdTags}`;

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
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          preview: path.resolve(__dirname, 'preview.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
