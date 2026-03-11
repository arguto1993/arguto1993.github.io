import React from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Linkedin, Github, BookOpen, Code } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="section-container">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Get In Touch</h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-x-24 gap-y-10">
          <ContactItem 
            icon={<Mail className="accent-text" size={24} />} 
            label="Email" 
            value={PERSONAL_INFO.email} 
            href={`mailto:${PERSONAL_INFO.email}`}
          />
          <ContactItem 
            icon={<Linkedin className="accent-text" size={24} />} 
            label="LinkedIn" 
            value="linkedin.com/in/arguto" 
            href={PERSONAL_INFO.linkedin}
          />
          <ContactItem 
            icon={<Github className="accent-text" size={24} />} 
            label="GitHub" 
            value="github.com/arguto1993" 
            href={PERSONAL_INFO.github}
          />
          <ContactItem 
            icon={<BookOpen className="accent-text" size={24} />} 
            label="Medium" 
            value="medium.com/@arguto" 
            href={PERSONAL_INFO.medium}
          />
          <ContactItem 
            icon={<Code className="accent-text" size={24} />} 
            label="HackerRank" 
            value="hackerrank.com/arguto" 
            href={PERSONAL_INFO.hackerrank}
          />
          <ContactItem 
            icon={<MapPin className="accent-text" size={24} />} 
            label="Location" 
            value={PERSONAL_INFO.location}
            href={`https://maps.google.com/?q=${encodeURIComponent(PERSONAL_INFO.location)}`}
          />
        </div>
      </div>
    </section>
  );
};

const ContactItem: React.FC<{ icon: React.ReactNode; label: string; value: string; href?: string }> = ({ icon, label, value, href }) => (
  <div className="flex items-start space-x-4">
    <div className="p-3 bg-[var(--accent)]/10 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-xs uppercase tracking-widest opacity-50 font-bold mb-1">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-lg font-medium hover:accent-text transition-colors">
          {value}
        </a>
      ) : (
        <p className="text-lg font-medium">{value}</p>
      )}
    </div>
  </div>
);
