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

createRoot(document.getElementById("root")!).render(<App />);