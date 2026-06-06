import React from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import { SkillBadge } from './SkillBadge';

export const Skills: React.FC = () => {
  const { skills } = useSiteData();

  return (
    <section id="skills" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-serif font-bold mb-12 text-center">{skills.title}</h2>
        <div className="space-y-10">
          {skills.items.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="space-y-4"
            >
              <div className="border-b border-[var(--border)] pb-2">
                <span className="accent-badge !rounded-md !px-2 !py-1 !text-[10px]">
                  {group.category}
                </span>
              </div>
              <div className="flex flex-wrap items-start gap-1.5">
                {group.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
