import React from 'react';
import { PERSONAL_INFO } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border)] py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-serif font-bold mb-2">
            {PERSONAL_INFO.nickname} Portfolio
          </h2>
          <p className="text-sm opacity-50 font-light">
            © {new Date().getFullYear()} {PERSONAL_INFO.name}
          </p>
          <p className="text-[10px] opacity-30 mt-1 uppercase tracking-tighter">
            Last Updated: {PERSONAL_INFO.lastUpdated}
          </p>
        </div>

        <div className="text-center md:text-right">
          <span className="accent-badge !text-[9px] !px-3 !py-1">
            Designed for Excellence
          </span>
        </div>
      </div>
    </footer>
  );
};
