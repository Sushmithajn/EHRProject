import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HealthcareProvider } from './context/HealthcareContext'; // ⬅️ Make sure this path is correct

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HealthcareProvider>
      <App />
    </HealthcareProvider>
  </StrictMode>
);
