import React, { useState, useEffect } from 'react';
import { LogOut, User, Settings, Bell, Shield, Smartphone, Heart, Plus, X } from 'lucide-react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';
import MentalHealthProfile from './mental-health-profile';

interface ProfilePageProps {
  defaultTab?: 'account' | 'mental-health';
}

export default function ProfilePage({ defaultTab = 'account' }: ProfilePageProps) {
  const { user, signOut, updateUserProfile } = useAuth();
  const [gender, setGender] = useState<string>(user?.gender || '');
  const [cgpa, setCgpa] = useState<string>(user?.cgpa?.toString() || '');
  const [extracurricularActivities, setExtracurricularActivities] = useState<string[]>(
    user?.extracurricularActivities || []
  );
  const [notifications, setNotifications] = useState(true);
  const [wearableConnected, setWearableConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(user?.isAdmin || false);
  const [activeTab, setActiveTab] = useState<'account' | 'mental-health'>(defaultTab);

  // Update active tab when defaultTab prop changes (only if different from current)
  React.useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  useEffect(() => {
    if (user) {
      setGender(user.gender || '');
      setCgpa(user.cgpa?.toString() || '');
      setExtracurricularActivities(user.extracurricularActivities || []);
      setIsAdmin(user.isAdmin || false);
    }
  }, [user]);

  const handleSaveProfile = () => {
    const cgpaNum = cgpa ? parseFloat(cgpa) : undefined;
    if (cgpa && (isNaN(cgpaNum!) || cgpaNum! < 0 || cgpaNum! > 10)) {
      toast.error('CGPA must be between 0 and 10');
      return;
    }
    // Filter out empty activities
    const validActivities = extracurricularActivities.filter(activity => activity.trim() !== '');
    updateUserProfile({
      gender: gender as any,
      cgpa: cgpaNum,
      extracurricularActivities: validActivities
    });
    toast.success('Profile updated successfully!');
  };

  const handleAddActivity = () => {
    if (extracurricularActivities.length >= 5) {
      toast.error('Maximum 5 extracurricular activities allowed');
      return;
    }
    setExtracurricularActivities([...extracurricularActivities, '']);
  };

  const handleRemoveActivity = (index: number) => {
    setExtracurricularActivities(extracurricularActivities.filter((_, i) => i !== index));
  };

  const handleActivityChange = (index: number, value: string) => {
    const updated = [...extracurricularActivities];
    updated[index] = value;
    setExtracurricularActivities(updated);
  };

  // Store count of activities (accessible in code)
  const extracurricularActivitiesCount = extracurricularActivities.filter(a => a.trim() !== '').length;

  const handleConnectWearable = () => {
    // Mock wearable connection
    setWearableConnected(!wearableConnected);
    toast.success(wearableConnected ? 'Wearable disconnected' : 'Wearable connected successfully!');
  };

  const handleToggleAdmin = () => {
    const newAdminStatus = !isAdmin;
    setIsAdmin(newAdminStatus);
    updateUserProfile({ isAdmin: newAdminStatus });
    toast.success(newAdminStatus ? 'Admin mode enabled' : 'Admin mode disabled');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div>
        <h1 className="nb-heading-lg">PROFILE & SETTINGS</h1>
        <p className="nb-body mt-2">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('account')}
          className={`nb-button ${activeTab === 'account' ? 'nb-button-primary' : 'nb-button-secondary'}`}
          style={{ flex: 1 }}
        >
          <User className="w-4 h-4" />
          Account Settings
        </button>
        <button
          onClick={() => setActiveTab('mental-health')}
          data-profile-tab="mental-health"
          className={`nb-button ${activeTab === 'mental-health' ? 'nb-button-primary' : 'nb-button-secondary'}`}
          style={{ flex: 1 }}
        >
          <Heart className="w-4 h-4" />
          Mental Health Profile
        </button>
      </div>

      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Profile Info */}
          <div className="nb-card">
            <div className="flex items-center gap-4 mb-6">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-20 h-20"
                  style={{
                    borderRadius: '50%',
                    border: 'var(--nb-border-md)',
                    boxShadow: 'var(--nb-shadow-sm)'
                  }}
                />
              ) : (
                <div
                  className="w-20 h-20 flex items-center justify-center"
                  style={{
                    borderRadius: '50%',
                    background: 'var(--nb-gradient-purple-blue)',
                    border: 'var(--nb-border-md)',
                    boxShadow: 'var(--nb-shadow-sm)'
                  }}
                >
                  <User className="w-10 h-10" style={{ color: 'var(--nb-white)' }} />
                </div>
              )}
              <div>
                <h2 className="nb-heading-md">{user?.displayName}</h2>
                <p className="nb-body-sm">{user?.email}</p>
              </div>
            </div>

            <div className="nb-card" style={{ background: 'var(--nb-lavender)', padding: '1rem', marginBottom: '1.5rem' }}>
              <div className="nb-body-sm" style={{ opacity: 0.8 }}>PROFILE INFORMATION</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="nb-heading-xs mb-2 block" style={{ fontSize: '0.875rem' }}>GENDER</label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`nb-toggle ${gender === g ? 'active' : ''}`}
                      style={{
                        background: gender === g ? 'var(--nb-black)' : 'var(--nb-white)',
                        color: gender === g ? 'var(--nb-white)' : 'var(--nb-black)',
                      }}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="nb-body-sm mt-2" style={{ opacity: 0.7 }}>
                  This helps us provide personalized features like menstrual tracking
                </p>
              </div>

              <div>
                <label className="nb-heading-xs mb-2 block" style={{ fontSize: '0.875rem' }}>CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="Enter your CGPA (0-10)"
                  className="nb-input"
                />
                <p className="nb-body-sm mt-2" style={{ opacity: 0.7 }}>
                  Your Cumulative Grade Point Average
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="nb-heading-xs block" style={{ fontSize: '0.875rem' }}>
                    EXTRACURRICULAR ACTIVITIES ({extracurricularActivitiesCount}/5)
                  </label>
                  {extracurricularActivities.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="nb-button nb-button-sm"
                      style={{ background: 'var(--nb-mint)' }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Activity
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {extracurricularActivities.length === 0 ? (
                    <div className="nb-card nb-card-yellow" style={{ padding: '1rem', textAlign: 'center' }}>
                      <p className="nb-body-sm" style={{ opacity: 0.7 }}>
                        No activities added. Click "Add Activity" to add up to 5 activities.
                      </p>
                    </div>
                  ) : (
                    extracurricularActivities.map((activity, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => handleActivityChange(index, e.target.value)}
                          placeholder={`Activity ${index + 1} (e.g., Sports, Clubs, Volunteering)`}
                          className="nb-input"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(index)}
                          className="nb-button nb-button-sm"
                          style={{ background: 'var(--nb-red-light)' }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <p className="nb-body-sm mt-2" style={{ opacity: 0.7 }}>
                  Add up to 5 extracurricular activities (clubs, sports, volunteering, etc.)
                </p>
              </div>

              <button onClick={handleSaveProfile} className="nb-button nb-button-primary" style={{ width: '100%' }}>
                Save Profile
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="nb-card">
            <h2 className="nb-heading-sm mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              SETTINGS
            </h2>

            <div className="space-y-4">
              <div className="nb-card nb-card-peach" style={{ padding: '1rem' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <div>
                      <p className="nb-heading-xs" style={{ fontSize: '1rem' }}>Push Notifications</p>
                      <p className="nb-body-sm">Receive daily reminders and alerts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`nb-button nb-button-sm ${notifications ? 'nb-button-success' : 'nb-button-secondary'}`}
                  >
                    {notifications ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              <div className="nb-card nb-card-lavender" style={{ padding: '1rem' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5" />
                    <div>
                      <p className="nb-heading-xs" style={{ fontSize: '1rem' }}>Wearable Device</p>
                      <p className="nb-body-sm">
                        {wearableConnected ? 'Connected to Apple Watch' : 'Connect your fitness tracker'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleConnectWearable}
                    className={`nb-button nb-button-sm ${wearableConnected ? 'nb-button-danger' : 'nb-button-success'}`}
                  >
                    {wearableConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>

              <div className="nb-card nb-card-yellow" style={{ padding: '1rem' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    <div>
                      <p className="nb-heading-xs" style={{ fontSize: '1rem' }}>Admin Mode (Demo)</p>
                      <p className="nb-body-sm">Access admin dashboard with analytics</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleAdmin}
                    className={`nb-button nb-button-sm ${isAdmin ? 'nb-button-warning' : 'nb-button-secondary'}`}
                  >
                    {isAdmin ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="nb-card">
            <h2 className="nb-heading-sm mb-4">DATA & PRIVACY</h2>
            <div className="space-y-3 nb-body-sm">
              <p>• All your data is encrypted and stored securely</p>
              <p>• We use ML models to predict stress levels locally</p>
              <p>• Your journal entries are private and never shared</p>
              <p>• You can export or delete your data at any time</p>
            </div>
            <button className="nb-button nb-button-secondary" style={{ width: '100%', marginTop: '1rem' }}>
              Download My Data
            </button>
          </div>

          {/* Sign Out */}
          <div className="nb-card">
            <button
              onClick={signOut}
              className="nb-button nb-button-danger"
              style={{ width: '100%' }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {activeTab === 'mental-health' && (
        <MentalHealthProfile />
      )}
    </div>
  );
}
