import React from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import { Briefcase } from 'lucide-react';

export const Experience: React.FC = () => {
  const { experiences } = useSiteData();

  return (
    <section id="experience" className="section-container bg-[var(--card-bg)]/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold mb-4">{experiences.title}</h2>
          <p className="opacity-60">{experiences.subtitle}</p>
        </motion.div>

        <div className="space-y-12">
          {experiences.items.map((exp, index) => (
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
                <div>
                  <h3 className="text-2xl font-serif font-bold group-hover:accent-text transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-lg font-medium opacity-80">{exp.company}</p>
                </div>
                <div className="text-right">
                  <span className="accent-badge !text-[10px] !px-2 !py-0.5">
                    {exp.period}
                  </span>
                  <p className="text-xs opacity-50 mt-1">{exp.location}</p>
                </div>
              </div>

              <p className="text-xs font-medium uppercase tracking-widest opacity-40 mb-4 flex items-center gap-2">
                <Briefcase size={12} /> {exp.type}
              </p>

              <ul className="space-y-3 opacity-70 leading-relaxed font-light list-disc pl-4">
                {exp.description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
