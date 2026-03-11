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

export default function App() {
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
