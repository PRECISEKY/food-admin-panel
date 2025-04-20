import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'; // Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  // No StrictMode for now
  <AuthProvider> {/* Wrap App */}
    <App />
  </AuthProvider>
);