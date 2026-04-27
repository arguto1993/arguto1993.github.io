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

const AdminApp = lazy(() => import('./admin/AdminApp'));

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
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen selection:bg-[var(--accent)] selection:text-white">
        <Navbar />
        <main>
          <Hero />
          {SECTION_VISIBILITY.about && <About />}
          {SECTION_VISIBILITY.skills && <Skills />}
          {SECTION_VISIBILITY.experience && <Experience />}
          {SECTION_VISIBILITY.projects && <Projects />}
          {SECTION_VISIBILITY.dashboards && <Dashboards />}
          {SECTION_VISIBILITY.education && <Education />}
          {SECTION_VISIBILITY.contact && <Contact />}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
