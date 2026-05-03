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
import type { AdminSectionKey } from './sections';
import type { PortfolioData } from '../types';

function buildSiteData(data: PortfolioData): SiteDataContextValue {
  return {
    brand: data.brand,
    hero: data.hero,
    about: data.about,
    skills: data.skills,
    experience: data.experience,
    projects: data.projects,
    dashboards: data.dashboards,
    education: data.education,
    contact: data.contact,
  };
}

function SectionComponent({ section }: { section: AdminSectionKey }) {
  switch (section) {
    case 'Brand': return <><Navbar /><div className="h-24" /><Footer /></>;
    case 'Hero': return <Hero />;
    case 'About': return <About />;
    case 'Skills': return <Skills />;
    case 'Experience': return <Experience />;
    case 'Projects': return <Projects />;
    case 'Dashboards': return <Dashboards />;
    case 'Education':
    case 'Certifications': return <Education />;
    case 'Contact': return <Contact />;
  }
}

export default function Preview({
  section,
  data,
}: {
  section: AdminSectionKey;
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
