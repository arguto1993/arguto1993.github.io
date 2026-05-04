export const DEFAULT_HOMEPAGE = 'https://arguto1993.github.io';

export const HOME_SECTION = {
  id: 'home',
  label: 'Home',
  dataKey: 'hero',
  href: '#home',
  nav: false,
};

export const CONTENT_SECTIONS = [
  { id: 'about', label: 'About', dataKey: 'about', href: '#about', nav: true },
  { id: 'skills', label: 'Skills', dataKey: 'skills', href: '#skills', nav: true },
  { id: 'experience', label: 'Experience', dataKey: 'experience', href: '#experience', nav: true },
  { id: 'projects', label: 'Projects', dataKey: 'projects', href: '#projects', nav: true },
  { id: 'dashboards', label: 'Dashboards', dataKey: 'dashboards', href: '#dashboards', nav: true },
  { id: 'education', label: 'Education', dataKey: 'education', href: '#education', nav: true },
  { id: 'contact', label: 'Contact', dataKey: 'contact', href: '#contact', nav: true },
];

export const SITE_SECTIONS = [HOME_SECTION, ...CONTENT_SECTIONS];

export function normalizeHomepage(homepage) {
  return String(homepage || DEFAULT_HOMEPAGE).replace(/\/$/, '');
}

export function isSectionVisible(data, sectionId) {
  if (sectionId === HOME_SECTION.id) return true;
  const section = CONTENT_SECTIONS.find((item) => item.id === sectionId);
  return section ? Boolean(data[section.dataKey]?.show) : false;
}

export function getVisibleContentSections(data) {
  return CONTENT_SECTIONS.filter((section) => isSectionVisible(data, section.id));
}

export function getVisibleNavSections(data) {
  return getVisibleContentSections(data).filter((section) => section.nav);
}

export function buildSectionVisibility(data) {
  return Object.fromEntries(
    SITE_SECTIONS.map((section) => [section.id, isSectionVisible(data, section.id)]),
  );
}

export function buildPortfolioUrls(data, options = {}) {
  const baseUrl = normalizeHomepage(data.brand?.homepage);
  const includeHome = options.includeHome ?? true;
  const urls = includeHome ? [`${baseUrl}/`] : [];
  return [
    ...urls,
    ...getVisibleContentSections(data).map((section) => `${baseUrl}/${section.href}`),
  ];
}
