import React from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import sections from '../sections.json';

export const Skills: React.FC = () => {
  const { skills } = useSiteData();

  return (
    <section id="skills" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-serif font-bold mb-12 text-center">{sections.skills.title}</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {skills.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="space-y-6"
            >
              <div className="border-b border-[var(--border)] pb-2 mb-6">
                <span className="accent-badge !rounded-md !px-2 !py-1 !text-[10px]">
                  {group.category}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-[11px] font-medium transition-all cursor-default shadow-sm hover:border-[var(--accent)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
