import React from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import { GraduationCap, Award } from 'lucide-react';

export const Education: React.FC = () => {
  const { education } = useSiteData();

  return (
    <section id="education" className="section-container">
      <div className="grid md:grid-cols-2 gap-16">
        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-[var(--accent)]/10 accent-text">
              <GraduationCap size={28} />
            </div>
            <h2 className="text-4xl font-serif font-bold">{education.title}</h2>
          </div>

          <div className="space-y-10">
            {education.items.map((edu) => (
              <div key={edu.degree} className="relative pl-6 border-l-2 border-[var(--border)]">
                <div className="absolute left-[-6px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                <h3 className="text-xl font-serif font-bold mb-1">{edu.degree}</h3>
                <p className="text-sm font-medium opacity-80 mb-2">{edu.institution}</p>
                <div className="mb-4">
                  <span className="accent-badge !text-[10px] !px-2 !py-0.5">
                    {edu.period}
                  </span>
                </div>
                {edu.details && (
                  <ul className="space-y-2">
                    {edu.details.map((detail, i) => (
                      <li key={i} className="text-sm opacity-60 font-light leading-relaxed">
                        • {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-[var(--accent)]/10 accent-text">
              <Award size={28} />
            </div>
            <h2 className="text-4xl font-serif font-bold">{education.certifications.title}</h2>
          </div>

          <div className="grid gap-4">
            {education.certifications.items.map((cert) => (
              <div
                key={cert.name}
                className="p-6 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:accent-border transition-all duration-300 group"
              >
                <h3 className="text-lg font-serif font-bold group-hover:accent-text transition-colors mb-1">
                  {cert.name}
                </h3>
                <p className="text-xs font-medium accent-text mb-2">{cert.type}</p>
                <div className="flex justify-between items-center gap-3 text-sm opacity-60">
                  <span>{cert.issuer}</span>
                  <span className="accent-badge !text-[9px] !px-1.5 !py-0.5 !rounded-md">
                    {cert.date}
                  </span>
                </div>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs opacity-70 mt-3 transition-colors duration-200 group-hover:text-[var(--accent)]"
                  >
                    View credential ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
