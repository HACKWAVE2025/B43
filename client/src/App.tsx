import React from 'react';
import { AuthProvider, useAuth } from './components/auth-context';
import LoginPage from './components/login-page';
import MainApp from './components/main-app';
import { Toaster } from './components/ui/sonner';
import Chatbot from './chatbot/Chatbot';
import './styles/neubrutalism.css';

export default function App() {
  return (
    <AuthProvider>
      <div className="nb-app">
        <AppContent />
        <Chatbot />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--nb-off-white)' }}>
        <div className="text-center">
          <div className="nb-card nb-card-lavender" style={{ padding: '3rem' }}>
            <div className="w-16 h-16 mx-auto mb-4" style={{
              border: '4px solid var(--nb-black)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p className="nb-body" style={{ fontWeight: 700 }}>Loading Vishuddhi...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return user ? <MainApp /> : <LoginPage />;
}