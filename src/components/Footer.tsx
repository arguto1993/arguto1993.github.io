import React from 'react';
import { useSiteData } from '../SiteDataContext';

export const Footer: React.FC = () => {
  const { hero, brand } = useSiteData();

  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-serif font-bold">
          {brand.nickname} Portfolio
        </h2>
        <div className="flex items-center gap-2 text-[10px] opacity-79 uppercase tracking-tighter justify-center">
          <a
            href={brand.repository}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="hover:opacity-70 transition"
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="inline-block align-middle">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.186 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.37-1.342-3.37-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.254-.447-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 7.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.547 1.382.203 2.402.1 2.656.64.699 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.422-.012 2.752 0 .268.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          <span>
            Last Updated: {brand.lastUpdated}
          </span>
        </div>
      </div>
    </footer>
  );
};
