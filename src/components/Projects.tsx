import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import { Github, ExternalLink, LayoutDashboard, ArrowRight } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const { projects } = useSiteData();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null ? (projects.items[selectedIndex] ?? null) : null;

  return (
    <section id="projects" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-serif font-bold mb-4">{projects.title}</h2>
        <p className="opacity-60">{projects.subtitle}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.items.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card group flex flex-col hover:shadow-2xl hover:shadow-[var(--accent)]/10"
          >
            {/* Image — clicking anywhere on it opens modal; icons stop propagation */}
            <div
              className="relative aspect-video overflow-hidden cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white text-black hover:bg-[var(--accent)] hover:text-white transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <Github size={20} />
                  </a>
                )}
                {project.dashboardLink && (
                  <a
                    href={project.dashboardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white text-black hover:bg-[var(--accent)] hover:text-white transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <LayoutDashboard size={20} />
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white text-black hover:bg-[var(--accent)] hover:text-white transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
              {project.domain && (
                <div className="absolute bottom-3 left-3">
                  <span className="accent-badge-2 !text-[10px] !px-3 !py-1">
                    ✦ {project.domain}
                  </span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col flex-1">
              <p className="text-[11px] opacity-40 tracking-wide mb-3">
                {[project.organization, project.date].filter(Boolean).join('  ·  ')}
              </p>

              <h3 className="text-xl font-serif font-bold leading-tight mb-3 line-clamp-2">
                {project.title}
              </h3>

              <p className="text-sm opacity-70 line-clamp-2 mb-4 font-light leading-relaxed flex-1">
                {project.description[0]}
              </p>

              {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.techStack.slice(0, 4).map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full border border-[var(--border)] text-[9px] font-bold uppercase tracking-wider opacity-70"
                      style={{ backgroundColor: 'var(--bg)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-[var(--border)]">
                <button
                  onClick={() => setSelectedIndex(index)}
                  className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-all duration-200 hover:gap-3"
                  style={{ color: 'var(--accent)' }}
                >
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelectedIndex(null)} />
    </section>
  );
};
