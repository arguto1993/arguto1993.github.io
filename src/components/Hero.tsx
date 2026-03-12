import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

export const Hero: React.FC = () => {

  return (
    <section id="home" className="min-h-[calc(100vh-130px)] flex items-center justify-center pt-4 pb-2 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="accent-badge px-8 py-2"
            >
              <span className="tracking-[0.3em] font-bold text-lg md:text-xl">
                {PERSONAL_INFO.title}
              </span>
            </motion.div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold mb-10 tracking-tighter leading-[0.9] whitespace-nowrap">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[var(--text)] to-[var(--text)]/60">
              {PERSONAL_INFO.name}
            </span>
          </h1>
          <p className="text-xl md:text-2xl opacity-70 max-w-2xl mx-auto mb-16 leading-relaxed font-light">
            Turning complex data into strategic business insights with 9+ years of cross-sector experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <SocialLink href={PERSONAL_INFO.linkedin} icon={<Linkedin size={20} />} label="LinkedIn" />
          <SocialLink href={PERSONAL_INFO.github} icon={<Github size={20} />} label="Github" />
          <SocialLink href={`mailto:${PERSONAL_INFO.email}`} icon={<Mail size={20} />} label="Email" />
          <SocialLink href={PERSONAL_INFO.resume} icon={<FileText size={20} />} label="Resume" />
        </motion.div>
      </div>
    </section>
  );
};

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 px-6 py-3 rounded-full border border-[var(--border)] hover:bg-[var(--accent)] transition-all duration-300 group"
  >
    <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </a>
);
