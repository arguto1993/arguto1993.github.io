import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (!import.meta.env.DEV && !location.hash.startsWith('#/admin')) {
  fetch(`https://ntfy.sh/${import.meta.env.VITE_NTFY_TOPIC}`, {
    method: 'POST',
    body: `🌐 arguto1993.github.io${location.pathname}${location.hash || ''}  🔗 ${document.referrer || 'direct'}`,
    headers: { Title: 'New portfolio visit', Priority: 'low', Tags: 'eyes' },
  }).catch(() => {});
}

// Clear any pre-rendered static HTML before mounting — prevents React 19 from
// attempting hydration against content it didn't render, which causes a blank page.
const root = document.getElementById('root')!;
root.innerHTML = '';

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
