import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { getTemplate } from './cad/templates';
import { StoreProvider } from './state/store';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider initialModel={structuredClone(getTemplate('wallholder')!.model)}>
      <App />
    </StoreProvider>
  </StrictMode>,
);

// Service Worker → offlinefähig & installierbar (nicht in Sandbox-Frames)
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* z. B. in eingebetteten Frames nicht erlaubt */
    });
  });
}
