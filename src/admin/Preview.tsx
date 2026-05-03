import { SiteDataProvider, type SiteDataContextValue } from '../SiteDataContext';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';
import { Projects } from '../components/Projects';
import { Dashboards } from '../components/Dashboards';
import { Education } from '../components/Education';
import { Contact } from '../components/Contact';
import { Navbar } from '../components/Navbar';
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
  | 'Contacts';

function buildSiteData(data: PortfolioData): SiteDataContextValue {
  return {
    brand: data.brand,
    hero: data.hero,
    about: data.about,
    skills: data.skills,
    experiences: data.experiences,
    projects: data.projects,
    dashboards: data.dashboards,
    education: data.education,
    contacts: data.contacts,
  };
}

function SectionComponent({ section }: { section: SectionKey }) {
  switch (section) {
    case 'Brand': return <><Navbar /><div className="h-24" /><Footer /></>;
    case 'Hero': return <Hero />;
    case 'About': return <About />;
    case 'Skills': return <Skills />;
    case 'Experiences': return <Experience />;
    case 'Projects': return <Projects />;
    case 'Dashboards': return <Dashboards />;
    case 'Education':
    case 'Certifications': return <Education />;
    case 'Contacts': return <Contact />;
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
      {/* transform creates a new containing block so position:fixed children stay inside */}
      <div className="bg-[var(--bg)] text-[var(--text)]" style={{ transform: 'translateZ(0)' }}>
        <SectionComponent section={section} />
      </div>
    </SiteDataProvider>
  );
}
