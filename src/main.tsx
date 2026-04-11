import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Clear any pre-rendered static HTML before mounting — prevents React 19 from
// attempting hydration against content it didn't render, which causes a blank page.
const root = document.getElementById('root')!;
root.innerHTML = '';

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
