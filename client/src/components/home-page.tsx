import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, CheckCircle2, Circle, AlertTriangle, Phone, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from './auth-context';
import { getStressPrediction } from './services/ml-service';
import { getMLStressPrediction } from '../services/prediction-service';
import { getTodoItems, toggleTodoItem } from './services/data-service';
import StressTrendChart from './stress-trend-chart';

interface HomePageProps {
  onNavigateToProfile?: () => void;
}

export default function HomePage({ onNavigateToProfile }: HomePageProps) {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [stressLevel, setStressLevel] = useState<any>(null);
  const [todoItems, setTodoItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isUpdatingStress, setIsUpdatingStress] = useState(false);

  useEffect(() => {
    loadData();
    checkProfileComplete();

    // Listen for profile save events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mentalHealthProfile') {
        checkProfileComplete();
      }
    };

    // Listen for custom event when profile is saved
    const handleProfileSaved = () => {
      checkProfileComplete();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileSaved', handleProfileSaved);

    // Also check periodically (in case of same-tab updates)
    const interval = setInterval(checkProfileComplete, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileSaved', handleProfileSaved);
      clearInterval(interval);
    };
  }, []);

  const checkProfileComplete = () => {
    // Check if mental health profile has been saved (not just default values)
    const savedProfile = localStorage.getItem('mentalHealthProfile');
    const profileSavedFlag = localStorage.getItem('mentalHealthProfileSaved');

    // Profile is complete if it exists in localStorage AND has been explicitly saved
    const isComplete = !!(savedProfile && profileSavedFlag === 'true');
    setIsProfileComplete(isComplete);
  };

  const loadData = async () => {
    setLoading(true);

    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const currentStreak = calculateStreak(journalEntries);
    setStreak(currentStreak);

    // Try to load stress from backend first, fallback to mock
    try {
      const mlPrediction = await getMLStressPrediction();
      setStressLevel({
        level: mlPrediction.normal_stress.level,
        value: mlPrediction.normal_stress.value,
        confidence: 0.85, // Default confidence since backend doesn't provide it
      });

      // Only add to history if it's a new prediction (check if last entry is from today)
      const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
      const today = new Date().toISOString().split('T')[0];
      const lastEntry = history[history.length - 1];
      const lastEntryDate = lastEntry ? new Date(lastEntry.timestamp).toISOString().split('T')[0] : null;

      if (lastEntryDate !== today) {
        history.push({
          level: mlPrediction.normal_stress.level,
          score: mlPrediction.normal_stress.value,
          timestamp: new Date().toISOString(),
        });
        // Keep only last 30 days
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const filtered = history.filter((p: any) => new Date(p.timestamp) > cutoff);
        localStorage.setItem('predictionHistory', JSON.stringify(filtered));
      }
    } catch (error) {
      console.warn('Failed to load stress from backend, using mock:', error);
      // Fallback to mock prediction
      const prediction = await getStressPrediction();
      setStressLevel(prediction);
    }

    const todos = getTodoItems();
    setTodoItems(todos);

    setLoading(false);
  };

  const handleUpdateStress = async () => {
    setIsUpdatingStress(true);
    try {
      const mlPrediction = await getMLStressPrediction();

      setStressLevel({
        level: mlPrediction.normal_stress.level,
        value: mlPrediction.normal_stress.value,
        confidence: 0.85,
      });

      // Save to prediction history for chart (replace today's entry if exists, otherwise add new)
      const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = history.findIndex((p: any) =>
        new Date(p.timestamp).toISOString().split('T')[0] === today
      );

      const newEntry = {
        level: mlPrediction.normal_stress.level,
        score: mlPrediction.normal_stress.value,
        timestamp: new Date().toISOString(),
      };

      if (todayEntry >= 0) {
        history[todayEntry] = newEntry;
      } else {
        history.push(newEntry);
      }

      // Keep only last 30 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const filtered = history.filter((p: any) => new Date(p.timestamp) > cutoff);
      localStorage.setItem('predictionHistory', JSON.stringify(filtered));

      // Dispatch event to refresh chart
      window.dispatchEvent(new CustomEvent('stressPredictionSaved'));

      console.log('✅ Stress updated successfully:', mlPrediction.normal_stress);
    } catch (error: any) {
      console.error('❌ Failed to update stress:', error);
      alert(error.message || 'Failed to update stress level. Please try again.');
    } finally {
      setIsUpdatingStress(false);
    }
  };

  const calculateStreak = (entries: any[]) => {
    if (entries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const hasEntry = entries.some((entry: any) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });

      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  const handleToggleTodo = (id: string) => {
    toggleTodoItem(id);
    const todos = getTodoItems();
    setTodoItems(todos);
  };

  const completedTodos = todoItems.filter(item => item.completed).length;
  const totalTodos = todoItems.length;
  const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const getStressBgColor = (level: string) => {
    switch (level) {
      case 'No Stress': return 'var(--nb-mint)';
      case 'Low Stress': return 'var(--nb-yellow)';
      case 'Moderate Stress': return 'var(--nb-peach)';
      case 'High Stress': return 'var(--nb-red-light)';
      default: return 'var(--nb-white)';
    }
  };

  if (loading) {
    return <div className="text-center py-12"><p className="nb-body">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="nb-heading-lg">Welcome back, {user?.displayName?.split(' ')[0]}!</h1>
          <p className="nb-body mt-2">Here's your wellness overview for today</p>
        </div>
      </div>

      {/* Complete Profile Banner */}
      {!isProfileComplete && (
        <div className="nb-card nb-card-yellow" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={onNavigateToProfile}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 nb-card-lavender flex items-center justify-center" style={{ borderRadius: '50%', border: 'var(--nb-border-md)' }}>
                <span style={{ fontSize: '1.5rem' }}>📋</span>
              </div>
              <div>
                <p className="nb-heading-xs" style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                  COMPLETE YOUR PROFILE
                </p>
                <p className="nb-body-sm" style={{ opacity: 0.8 }}>
                  Finish setting up your mental health profile to get personalized recommendations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="nb-body-sm" style={{ fontWeight: 600 }}>Go to Profile</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Emergency Alert */}
      {stressLevel?.level === 'High Stress' && stressLevel?.suicideRisk > 0.7 && (
        <div className="nb-card" style={{ background: 'var(--nb-red-light)', padding: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <p className="nb-heading-xs" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>WE DETECTED YOU MIGHT NEED SUPPORT</p>
                <p className="nb-body-sm">National Suicide Prevention Lifeline: 988 (24/7 Support)</p>
              </div>
            </div>
            <button className="nb-button nb-button-danger nb-button-sm">
              <Phone className="w-4 h-4" />
              Call Now
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak Card */}
        <div className="nb-card nb-card-peach">
          <div className="flex items-center justify-between">
            <div>
              <p className="nb-body-sm" style={{ marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Journaling Streak</p>
              <p className="nb-heading-lg" style={{ fontSize: '3rem', lineHeight: 1 }}>{streak}</p>
              <p className="nb-body-sm" style={{ marginTop: '0.25rem' }}>days in a row</p>
            </div>
            <div className="w-16 h-16 nb-card-gradient flex items-center justify-center" style={{ borderRadius: '50%', border: 'var(--nb-border-md)', boxShadow: 'var(--nb-shadow-md)' }}>
              <Flame className="w-8 h-8 nb-float" style={{ color: 'var(--nb-white)' }} />
            </div>
          </div>
          {streak > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '2px solid var(--nb-black)' }}>
              <p className="nb-body-sm" style={{ fontWeight: 700 }}>🎉 Keep it up! Consistency builds resilience.</p>
            </div>
          )}
        </div>

        {/* Stress Level Card */}
        <div className="nb-card" style={{ background: getStressBgColor(stressLevel?.level || '') }}>
          <div className="flex items-center justify-between mb-3">
            <p className="nb-heading-xs" style={{ fontSize: '0.875rem' }}>CURRENT STRESS LEVEL</p>
            <div className="flex items-center gap-2">
              <div className="nb-badge" style={{ background: 'var(--nb-black)', color: 'var(--nb-white)' }}>
                {stressLevel?.level || 'Unknown'}
              </div>
              {stressLevel?.value && (
                <div className="nb-badge" style={{ background: 'var(--nb-white)', color: 'var(--nb-black)', border: 'var(--nb-border-sm)' }}>
                  Level {stressLevel.value}/4
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="nb-body-sm">Stress Score</span>
              <span className="nb-body" style={{ fontWeight: 700 }}>
                {stressLevel?.value ? `${stressLevel.value}/4` : 'N/A'}
              </span>
            </div>
            <div style={{ height: '12px', background: 'var(--nb-white)', border: 'var(--nb-border-sm)', position: 'relative' }}>
              <div style={{
                height: '100%',
                width: `${((stressLevel?.value || 0) / 4) * 100}%`,
                background: 'var(--nb-black)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '2px solid var(--nb-black)' }}>
            <button
              onClick={handleUpdateStress}
              disabled={isUpdatingStress}
              className="nb-button"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: isUpdatingStress ? 0.6 : 1,
                cursor: isUpdatingStress ? 'not-allowed' : 'pointer'
              }}
            >
              {isUpdatingStress ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Update Stress</span>
                </>
              )}
            </button>
            <p className="nb-body-sm mt-2" style={{ fontWeight: 600, textAlign: 'center' }}>Based on ML analysis</p>
          </div>
        </div>

        {/* Todo Completion Card */}
        <div className="nb-card nb-card-lavender">
          <div className="flex items-center justify-between mb-3">
            <p className="nb-heading-xs" style={{ fontSize: '0.875rem' }}>TODAY'S PROGRESS</p>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="nb-heading-lg" style={{ fontSize: '3rem', lineHeight: 1 }}>{completedTodos}</span>
            <span className="nb-body">/ {totalTodos} tasks</span>
          </div>
          <div style={{ height: '8px', background: 'var(--nb-white)', border: 'var(--nb-border-sm)', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${completionRate}%`,
              background: 'var(--nb-black)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p className="nb-body-sm mt-3" style={{ fontWeight: 700 }}>
            {completionRate === 100 ? '🎉 All tasks completed!' : `${Math.round(completionRate)}% complete`}
          </p>
        </div>
      </div>

      {/* Stress Trend Chart - Only show if profile is complete */}
      {isProfileComplete && (
        <div className="nb-card">
          <h2 className="nb-heading-sm mb-4">STRESS TRENDS (LAST 7 DAYS)</h2>
          <StressTrendChart />
        </div>
      )}

      {/* Today's To-Do List */}
      <div className="nb-card">
        <h2 className="nb-heading-sm mb-4">TODAY'S RECOMMENDATIONS</h2>
        {todoItems.length === 0 ? (
          <div className="text-center py-8 nb-card nb-card-yellow" style={{ margin: '0' }}>
            <p className="nb-body">No tasks yet. Complete your journal to get personalized recommendations!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todoItems.map((item) => (
              <div
                key={item.id}
                className="nb-card"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  background: item.completed ? 'var(--nb-mint)' : 'var(--nb-white)'
                }}
                onClick={() => handleToggleTodo(item.id)}
              >
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: 'var(--nb-border-md)',
                    borderRadius: '50%',
                    background: item.completed ? 'var(--nb-black)' : 'var(--nb-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.completed && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--nb-white)' }} />}
                  </div>
                  <div className="flex-1">
                    <p className="nb-body" style={{
                      textDecoration: item.completed ? 'line-through' : 'none',
                      fontWeight: item.completed ? 400 : 600
                    }}>
                      {item.text}
                    </p>
                    {item.category && (
                      <span className="nb-badge" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Helpline */}
      <div className="nb-card nb-card-gradient">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="nb-heading-sm mb-2" style={{ color: 'var(--nb-white)' }}>24/7 EMERGENCY HELPLINE</h3>
            <p className="nb-body" style={{ color: 'var(--nb-white)' }}>Toll-free support for disabled and emergency cases</p>
          </div>
          <button className="nb-button" style={{ background: 'var(--nb-white)', color: 'var(--nb-black)' }}>
            <Phone className="w-4 h-4" />
            1-800-MINDCARE
          </button>
        </div>
      </div>
    </div>
  );
}
