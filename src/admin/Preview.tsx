import { SiteDataProvider, type SiteDataContextValue } from '../SiteDataContext';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';
import { Projects } from '../components/Projects';
import { Dashboards } from '../components/Dashboards';
import { Education } from '../components/Education';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import type { PortfolioData } from './types';

type SectionKey =
  | 'Hero'
  | 'About'
  | 'Skills'
  | 'Experiences'
  | 'Projects'
  | 'Dashboards'
  | 'Education'
  | 'Certifications'
  | 'Contact'
  | 'Brand';

function buildSiteData(data: PortfolioData): SiteDataContextValue {
  return {
    personalInfo: {
      ...data.hero,
      ...data.brand,
      about: data.about.content,
      ...data.contact,
      logoWhite: '/images/logo/white.png',
      logoBlack: '/images/logo/black.png',
      portrait: '/images/portrait/arguto_portrait_600.webp',
    },
    experiences: data.experiences,
    projects: data.projects,
    dashboards: data.dashboards,
    education: data.education,
    skills: data.skills,
    certifications: data.certifications,
  };
}

function SectionComponent({ section }: { section: SectionKey }) {
  switch (section) {
    case 'Hero': return <Hero />;
    case 'About': return <About />;
    case 'Skills': return <Skills />;
    case 'Experiences': return <Experience />;
    case 'Projects': return <Projects />;
    case 'Dashboards': return <Dashboards />;
    case 'Education':
    case 'Certifications': return <Education />;
    case 'Contact': return <Contact />;
    case 'Brand': return <Footer />;
  }
}

export default function Preview({
  section,
  data,
}: {
  section: SectionKey;
  data: PortfolioData;
}) {
  return (
    <SiteDataProvider value={buildSiteData(data)}>
      <SectionComponent section={section} />
    </SiteDataProvider>
  );
}
