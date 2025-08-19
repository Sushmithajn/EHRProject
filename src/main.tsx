import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HealthcareProvider } from './context/HealthcareContext'; // ⬅️ Make sure this path is correct
import { BrowserRouter } from 'react-router-dom';

// ✅ Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker registered:', reg))
      .catch(err => console.log('❌ Service Worker registration failed:', err));
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HealthcareProvider>
      <App />
    </HealthcareProvider>
  </StrictMode>
);
