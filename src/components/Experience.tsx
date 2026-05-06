import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import { Briefcase, ChevronDown, ExternalLink } from 'lucide-react';

export const Experience: React.FC = () => {
  const { experience } = useSiteData();
  const [expanded, setExpanded] = useState<Set<number>>(
    () => experience.defaultExpanded ? new Set(experience.items.map((_, i) => i)) : new Set()
  );

  useEffect(() => {
    setExpanded(experience.defaultExpanded ? new Set(experience.items.map((_, i) => i)) : new Set());
  }, [experience.defaultExpanded]);

  const allExpanded = expanded.size === experience.items.length;

  const toggleAll = () => {
    if (allExpanded) {
      setExpanded(new Set());
    } else {
      setExpanded(new Set(experience.items.map((_, i) => i)));
    }
  };

  const toggle = (index: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <section id="experience" className="section-container bg-[var(--card-bg)]/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold mb-4">{experience.title}</h2>
          <p className="opacity-60 mb-6">{experience.subtitle}</p>
          <button
            onClick={toggleAll}
            className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 hover:accent-text transition-all duration-300 mx-auto cursor-pointer"
          >
            <span className="text-xs font-medium uppercase tracking-widest">
              {allExpanded ? 'Hide Details' : 'Show Details'}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${allExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </motion.div>

        <div className="space-y-12">
          {experience.items.map((exp, index) => {
            const isOpen = expanded.has(index);
            return (
              <motion.div
                key={`${exp.company}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 border-l border-[var(--border)] group"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--bg)] border-2 border-[var(--accent)] group-hover:scale-125 transition-transform duration-300" />

                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="cursor-pointer" onClick={() => toggle(index)}>
                    <h3 className="text-2xl font-serif font-bold group-hover:accent-text transition-colors">
                      {exp.title}
                    </h3>
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-base font-medium opacity-80 hover:opacity-100 hover:accent-text transition-colors"
                      >
                        {exp.company}
                        <ExternalLink size={12} className="opacity-50" />
                      </a>
                    ) : (
                      <p className="text-base font-medium opacity-80">{exp.company}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="accent-badge !text-[10px] !px-2 !py-0.5">
                      {exp.period}
                    </span>
                    <p className="text-xs opacity-50 mt-1">{exp.location}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium uppercase tracking-widest opacity-40 flex items-center gap-2">
                    <Briefcase size={12} /> {exp.type}
                  </p>
                  <button
                    onClick={() => toggle(index)}
                    className="flex items-center gap-1 text-xs opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{isOpen ? 'Hide' : 'Details'}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      key="bullets"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="space-y-3 opacity-70 leading-relaxed font-light list-disc pl-4 overflow-hidden"
                    >
                      {exp.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
