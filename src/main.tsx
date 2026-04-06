import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0]?.toString() || '';
  if (url.includes('api.poehali.dev/api/project/badge')) {
    return Promise.resolve(new Response('', { status: 200 }));
  }
  return originalFetch.apply(this, args);
};

const params = new URLSearchParams(window.location.search);
const spaRoute = params.get('spa_route');
if (spaRoute) {
  window.history.replaceState(null, '', decodeURIComponent(spaRoute));
}

createRoot(document.getElementById("root")!).render(<App />);