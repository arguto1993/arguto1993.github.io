import { Suspense, lazy, useEffect, useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Dashboards } from './components/Dashboards';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SECTION_VISIBILITY } from './constants';
import { CONTENT_SECTIONS } from './sectionRegistry.js';

const AdminApp = lazy(() => import('./admin/AdminApp'));

const sectionComponents = {
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  dashboards: Dashboards,
  education: Education,
  contact: Contact,
} as const;

function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.location.hash.startsWith('#/admin')) return true;
  return new URLSearchParams(window.location.search).has('code');
}

export default function App() {
  const [adminMode, setAdminMode] = useState(isAdminRoute);

  useEffect(() => {
    const onHashChange = () => setAdminMode(isAdminRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (adminMode) {
    return (
      <ThemeProvider>
        <Suspense fallback={null}>
          <AdminApp />
        </Suspense>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen selection:bg-[var(--accent)] selection:text-white">
        <Navbar />
        <main>
          <Hero />
          {CONTENT_SECTIONS.map((section) => {
            const Section = sectionComponents[section.id as keyof typeof sectionComponents];
            return SECTION_VISIBILITY[section.id] && Section ? <Section key={section.id} /> : null;
          })}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
