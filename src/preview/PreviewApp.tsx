import { useState, useEffect } from 'react';
import { ThemeProvider } from '../components/ThemeContext';
import Preview from '../admin/Preview';
import type { AdminSectionKey } from '../admin/sections';
import type { PortfolioData } from '../types';

type PreviewState = {
  data: PortfolioData;
  section: AdminSectionKey;
  theme: 'light' | 'dark';
};

function reportHeight() {
  // Measure #root, not documentElement — the iframe viewport expands to fill
  // its set height, making scrollHeight always equal the parent-set height.
  const root = document.getElementById('root');
  const height = root ? Math.ceil(root.getBoundingClientRect().height) : 0;
  if (height > 0) {
    window.parent?.postMessage({ type: 'PREVIEW_HEIGHT', height }, '*');
  }
}

export default function PreviewApp() {
  const [state, setState] = useState<PreviewState | null>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_DATA') {
        const incoming = e.data as PreviewState & { type: string };
        localStorage.setItem('theme', incoming.theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(incoming.theme);
        setState({ data: incoming.data, section: incoming.section, theme: incoming.theme });
      }
    };
    window.addEventListener('message', handler);
    window.parent?.postMessage({ type: 'PREVIEW_READY' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // Report content height to parent after every render so the iframe resizes to fit
  useEffect(() => {
    if (!state) return;
    // Small delay lets React finish painting before measuring
    const t = setTimeout(reportHeight, 50);
    const root = document.getElementById('root');
    if (!root) return () => clearTimeout(t);
    const ro = new ResizeObserver(reportHeight);
    ro.observe(root);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [state]);

  if (!state) return null;

  return (
    <ThemeProvider key={state.theme}>
      <Preview section={state.section} data={state.data} />
    </ThemeProvider>
  );
}
