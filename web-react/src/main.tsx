import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);

// Prevent href="#" from adding hash to URL
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const anchor = target.closest('a[href="#"]');
  if (anchor) {
    e.preventDefault();
    e.stopPropagation();
    console.error('🚨 BLOCKED href="#" click on:', anchor.textContent?.trim() || anchor);
    console.error('   Current URL:', window.location.href);
    console.trace('Click origin');
    return false;
  }
}, true);
