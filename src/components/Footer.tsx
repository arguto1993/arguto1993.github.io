import React from 'react';
import { PERSONAL_INFO } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-serif font-bold">
          {PERSONAL_INFO.nickname} Portfolio
        </h2>
        <p className="text-sm opacity-50 font-light">
          © {new Date().getFullYear()} {PERSONAL_INFO.name}
        </p>
        <p className="text-[10px] opacity-30 uppercase tracking-tighter">
          Last Updated: {PERSONAL_INFO.lastUpdated}
        </p>
      </div>
    </footer>
  );
};
