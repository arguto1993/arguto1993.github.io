import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSiteData } from '../SiteDataContext';
import sections from '../sections.json';
import { parseInline } from '../inlineMarkdown';

const messages = [
  "Hi! Welcome to my portfolio.",
  "I'm Guto. Nice to meet you.",
  "How can I help you?"
];

const techTooltips: Record<string, string> = {
  'Python': 'Programming language',
  'SQL': 'Structured Query Language',
  'BigQuery': 'Google Cloud data warehouse',
  'ClickHouse': 'Columnar database for analytics',
  'BI platforms': 'Business Intelligence tools',
  'CRM': 'Customer Relationship Management',
  'OMS': 'Order Management System'
};

export const About: React.FC = () => {
  const { personalInfo } = useSiteData();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="section-container">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative max-w-sm mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -top-16 left-0 right-0 bg-[var(--accent)] text-black px-6 py-3 rounded-2xl font-semibold text-sm md:text-base text-center"
            >
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {messages[currentMessageIndex]}
              </motion.div>
            </motion.div>

            <div className="aspect-[3/5] rounded-2xl overflow-hidden border-4 border-[var(--accent)] shadow-2xl bg-gray-300">
              <img
                src={personalInfo.portrait}
                alt={personalInfo.name}
                className="w-full h-full object-cover hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--accent)] rounded-full -z-10 opacity-20 blur-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-serif font-bold mb-8">{sections.about.title}</h2>
            <div className="space-y-6 text-lg opacity-80 leading-relaxed font-light text-justify">
              {personalInfo.about.split('\n').map((paragraph, i) => (
                <p key={i}>
                  {parseInline(paragraph).map((seg, j) => {
                    if (seg.type === 'bold') {
                      return (
                        <strong
                          key={j}
                          className="font-semibold text-[var(--text)] opacity-100"
                        >
                          {seg.value}
                        </strong>
                      );
                    }
                    if (seg.type === 'italic') {
                      return (
                        <span
                          key={j}
                          className="underline decoration-[var(--accent)] decoration-2 underline-offset-2 cursor-help"
                          title={techTooltips[seg.value] || seg.value}
                        >
                          {seg.value}
                        </span>
                      );
                    }
                    return seg.value;
                  })}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
