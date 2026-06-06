import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Squared outline badge used for Tech Stack / Skills tags.
 * A parenthetical detail (e.g. "Python (Pandas, NumPy)") is collapsed by
 * default and expands on click, revealing the detail with a chevron affordance.
 */
export const SkillBadge: React.FC<{ skill: string }> = ({ skill }) => {
  const match = skill.match(/^(.*?)\s*\((.+)\)\s*$/);
  const main = match ? match[1] : skill;
  const detail = match ? match[2].replace(/,\s*/g, ' · ') : null;
  const [open, setOpen] = useState(false);

  if (!detail) {
    return <span className="skill-badge">{main}</span>;
  }

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className={`skill-badge text-left !cursor-pointer ${open ? 'border-[var(--accent)]' : ''}`}
    >
      <span className="flex items-center gap-1">
        {main}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`w-3 h-3 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="block overflow-hidden"
          >
            <span className="skill-badge-detail">{detail}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
