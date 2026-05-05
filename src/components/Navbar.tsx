import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

import { useSiteData } from '../SiteDataContext';
import { getVisibleNavSections } from '../sectionRegistry.js';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const siteData = useSiteData();
  const { brand } = siteData;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const visibleLinks = getVisibleNavSections(siteData);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = visibleLinks.map((l) => l.href.replace('#', ''));

    const handleScroll = () => {
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
      if (atBottom) {
        setActiveSection(sectionIds[sectionIds.length - 1] ?? '');
        return;
      }
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleLinks]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <img
              src={theme === 'light' ? brand.logoBlack : brand.logoWhite}
              alt={brand.nickname}
              className="h-10 w-10 object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.a>
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`font-serif font-bold text-2xl tracking-widest uppercase ${
              theme === 'light'
                ? 'bg-[var(--accent)] text-black px-2 py-0.5'
                : 'accent-text'
            }`}
          >
            {brand.shortname}.
          </motion.a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {visibleLinks.map((link, i) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <motion.a
                key={link.id}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm font-medium hover:accent-text transition-colors relative group"
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[var(--accent)] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </motion.a>
            );
          })}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--border)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--border)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="p-2 cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[var(--bg)] border-b border-[var(--border)]"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              {visibleLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      const target = document.querySelector(link.href);
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-lg font-medium hover:accent-text transition-colors relative w-fit group cursor-pointer"
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[var(--accent)] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
