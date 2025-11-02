import React, { useState } from 'react';
import { Home, BookOpen, Calendar, Lightbulb, User, Shield } from 'lucide-react';
import HomePage from './home-page';
import JournalPage from './journal-page';
import TrackPage from './track-page';
import ResourcesPage from './resources-page';
import ProfilePage from './profile-page';
import AdminDashboard from './admin-dashboard';
import { useAuth } from './auth-context';

type TabType = 'home' | 'journal' | 'track' | 'resources' | 'profile' | 'admin';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [profileDefaultTab, setProfileDefaultTab] = useState<'account' | 'mental-health'>('account');
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: 'var(--nb-off-white)' }}>
      {/* Neubrutalism Navbar */}
      <nav className="nb-navbar">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => signOut()}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-10 h-10 nb-card-gradient flex items-center justify-center" style={{ borderRadius: '50%', border: 'var(--nb-border-md)', boxShadow: 'var(--nb-shadow-sm)' }}>
                <span style={{ color: 'var(--nb-white)', fontSize: '1.25rem', fontWeight: 900 }}>V</span>
              </div>
              <span className="nb-heading-sm" style={{ fontSize: '1.5rem' }}>VISHUDDHI</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <button
                className={`nb-nav-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Home</span>
              </button>
              
              <button
                className={`nb-nav-link ${activeTab === 'journal' ? 'active' : ''}`}
                onClick={() => setActiveTab('journal')}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden md:inline">Journal</span>
              </button>
              
              <button
                className={`nb-nav-link ${activeTab === 'track' ? 'active' : ''}`}
                onClick={() => setActiveTab('track')}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden md:inline">Track</span>
              </button>
              
              <button
                className={`nb-nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="hidden md:inline">Resources</span>
              </button>
              
              <button
                className={`nb-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('profile');
                  setProfileDefaultTab('account'); // Reset to account tab when clicking profile nav
                }}
                style={{ 
                  background: activeTab === 'profile' ? 'var(--nb-gradient-purple-blue)' : 'var(--nb-white)',
                  color: activeTab === 'profile' ? 'var(--nb-white)' : 'var(--nb-black)'
                }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ 
                  background: activeTab === 'profile' ? 'rgba(255,255,255,0.3)' : 'var(--nb-gradient-purple-blue)' 
                }}>
                  <User className="w-4 h-4" style={{ color: 'var(--nb-white)' }} />
                </div>
                <span className="hidden md:inline">Profile</span>
              </button>
              
              {user?.isAdmin && (
                <button
                  className={`nb-nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admin')}
                  style={{ background: 'var(--nb-yellow)' }}
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden md:inline">Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {activeTab === 'home' && <HomePage onNavigateToProfile={() => {
          setActiveTab('profile');
          setProfileDefaultTab('mental-health');
        }} />}
        {activeTab === 'journal' && <JournalPage />}
        {activeTab === 'track' && <TrackPage />}
        {activeTab === 'resources' && <ResourcesPage />}
        {activeTab === 'profile' && <ProfilePage defaultTab={profileDefaultTab} />}
        {activeTab === 'admin' && user?.isAdmin && <AdminDashboard />}
      </div>
    </div>
  );
}
