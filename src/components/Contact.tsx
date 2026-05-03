import React from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Linkedin, Github, BookOpen, Code } from 'lucide-react';
import { useSiteData } from '../SiteDataContext';
import type { ContactItem as ContactItemType } from '../types';

const iconMap: Record<string, typeof Mail> = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  book: BookOpen,
  code: Code,
  map: MapPin,
};

export const Contact: React.FC = () => {
  const { contact } = useSiteData();

  return (
    <section id="contact" className="section-container">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">{contact.title}</h2>
          <p className="text-lg opacity-60 max-w-4xl mx-auto">{contact.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-x-24 gap-y-10">
          {contact.items.map((item) => (
            <ContactItem key={`${item.label}-${item.value}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactItem: React.FC<{ item: ContactItemType }> = ({ item }) => {
  const Icon = iconMap[item.icon] ?? Mail;

  return (
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-[var(--accent)]/10 rounded-xl">
        <Icon className="accent-text" size={24} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest opacity-50 font-bold mb-1">{item.label}</p>
        {item.href ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-md font-medium hover:accent-text transition-colors">
            {item.value}
          </a>
        ) : (
          <p className="text-lg font-medium">{item.value}</p>
        )}
      </div>
    </div>
  );
};
