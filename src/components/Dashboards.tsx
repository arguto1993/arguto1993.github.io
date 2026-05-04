import React from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import { Layout } from 'lucide-react';

export const Dashboards: React.FC = () => {
  const { dashboards } = useSiteData();

  return (
    <section id="dashboards" className="section-container bg-[var(--card-bg)]/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-serif font-bold mb-4">{dashboards.title}</h2>
        <p className="opacity-60">{dashboards.subtitle}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {dashboards.items.map((dash, index) => (
          <motion.a
            key={dash.title}
            href={dash.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl aspect-[16/9] border border-[var(--border)] block"
          >
            <img
              src={dash.image}
              alt={dash.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="mb-3">
                <span className="accent-badge-2 !text-[10px] !px-2 !py-0.5 flex items-center gap-1 w-fit">
                  <Layout size={10} /> {dash.platform}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">{dash.title}</h3>
              <p className="text-sm text-white/70 font-light max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                {dash.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};
