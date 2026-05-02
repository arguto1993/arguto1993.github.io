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
  | 'Brand'
  | 'Hero'
  | 'About'
  | 'Skills'
  | 'Experiences'
  | 'Projects'
  | 'Dashboards'
  | 'Education'
  | 'Certifications'
  | 'Contact';

function buildSiteData(data: PortfolioData): SiteDataContextValue {
  return {
    hero: data.hero,
    about: data.about,
    experiences: data.experiences,
    projects: data.projects,
    dashboards: data.dashboards,
    education: data.education,
    skills: data.skills,
    certifications: data.certifications,
    contacts: data.contacts,
    brand: data.brand,
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
      <div className="bg-[var(--bg)] text-[var(--text)]">
        <SectionComponent section={section} />
      </div>
    </SiteDataProvider>
  );
}
