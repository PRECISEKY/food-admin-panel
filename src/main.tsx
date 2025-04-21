// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx';
// Ensure this import path is correct for your file structure:
import { LanguageProvider } from './context/language-provider.tsx';
import './lib/i18n'; // Initialize i18next

ReactDOM.createRoot(document.getElementById('root')!).render(
  // LanguageProvider MUST wrap AuthProvider and App
  <LanguageProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </LanguageProvider>
);