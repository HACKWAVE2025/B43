import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Droplet, Plus, Activity, Moon, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from './auth-context';
import { saveMenstrualData, getMenstrualData } from './services/data-service';
import MenstrualCycleChart from './menstrual-cycle-chart';

const SYMPTOMS = [
  'Cramps',
  'Headache',
  'Mood Swings',
  'Fatigue',
  'Bloating',
  'Acne',
  'Back Pain',
  'Breast Tenderness',
];

export default function TrackPage() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [flowIntensity, setFlowIntensity] = useState<string>('medium'); // Default to medium (level 3)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [menstrualHistory, setMenstrualHistory] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMenstrualData();
    generateCurrentWeek();
  }, []);

  // Re-generate week if it's empty and we have user access
  useEffect(() => {
    if (user?.gender === 'female' && (!currentWeek || currentWeek.length === 0)) {
      generateCurrentWeek();
    }
  }, [user?.gender]);

  const loadMenstrualData = () => {
    const data = getMenstrualData();
    setMenstrualHistory(data);
  };

  const generateCurrentWeek = () => {
    const week = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    setCurrentWeek(week);
  };

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }

    const entry = {
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString(),
      flowIntensity,
      symptoms: selectedSymptoms,
      savedAt: new Date().toISOString(),
    };

    saveMenstrualData(entry);
    loadMenstrualData();
    toast.success('Menstrual data saved successfully!');

    setStartDate(undefined);
    setEndDate(undefined);
    setFlowIntensity('medium');
    setSelectedSymptoms([]);
  };

  const getFlowColor = (intensity: string) => {
    switch (intensity) {
      case 'very-light': return '#FED7D7';
      case 'light': return '#FCA5A5';
      case 'medium': return '#F87171';
      case 'heavy': return '#EF4444';
      case 'very-heavy': return '#DC2626';
      default: return '#F87171';
    }
  };

  const isPeriodDay = (date: Date) => {
    return menstrualHistory.some(entry => {
      const start = new Date(entry.startDate);
      const end = entry.endDate ? new Date(entry.endDate) : start;
      return date >= start && date <= end;
    });
  };

  // Check if user needs to update gender
  if (!user || user.gender !== 'female') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="nb-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Droplet className="w-16 h-16 mx-auto mb-4" style={{ color: '#F87171' }} />
          <h2 className="nb-heading-md mb-2">MENSTRUAL TRACKING</h2>
          <p className="nb-body">
            This feature is available for users who identify as female. Please update your profile settings.
          </p>
        </div>
      </div>
    );
  }

  // Ensure currentWeek is populated before rendering
  if (!currentWeek || currentWeek.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="nb-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="w-16 h-16 mx-auto mb-4" style={{
            border: '4px solid var(--nb-black)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p className="nb-body" style={{ fontWeight: 700 }}>Loading...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div>
        <h1 className="nb-heading-lg">CYCLE TRACKING</h1>
        <p className="nb-body mt-2">Track your cycle and symptoms for better stress predictions</p>
      </div>

      {/* Weekly Calendar */}
      <div className="nb-card">
        <h2 className="nb-heading-sm mb-4">YOUR WEEK AT A GLANCE</h2>
        <div className="grid grid-cols-7 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
            const weekDay = currentWeek[i];
            if (!weekDay) return null;
            return (
              <div key={i} className="text-center">
                <p className="nb-body-sm mb-2" style={{ fontWeight: 800 }}>{day}</p>
                <div 
                  className="nb-card"
                  style={{ 
                    padding: '1rem',
                    background: isPeriodDay(weekDay) ? 'var(--nb-peach)' : 'var(--nb-white)',
                    border: weekDay.toDateString() === new Date().toDateString() 
                      ? '4px solid var(--nb-black)' 
                      : 'var(--nb-border-md)',
                  }}
                >
                  <p className="nb-body" style={{ fontWeight: 700 }}>{weekDay.getDate()}</p>
                  {isPeriodDay(weekDay) && (
                    <Droplet className="w-4 h-4 mx-auto mt-1" style={{ color: '#DC2626' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Section */}
      <div className="nb-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="nb-heading-sm">LOG</h2>
          <button className="nb-body-sm" style={{ color: '#3B82F6', textDecoration: 'underline', textDecorationStyle: 'dashed' }}>
            Options
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Period Card */}
          <div className="nb-card nb-card-peach">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center" style={{ 
                  background: 'var(--nb-white)', 
                  border: 'var(--nb-border-md)',
                  borderRadius: '50%'
                }}>
                  <Droplet className="w-5 h-5" />
                </div>
                <p className="nb-heading-xs" style={{ fontSize: '1rem' }}>PERIOD</p>
              </div>
              <button 
                className="nb-button nb-button-sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Set today as default start date if not set
                  const today = new Date();
                  if (!startDate) {
                    setStartDate(today);
                  }
                  // Scroll to form - try multiple methods
                  const scrollToForm = () => {
                    // Method 1: Use ref
                    if (formRef.current) {
                      formRef.current.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                      });
                      return;
                    }
                    // Method 2: Use ID with offset
                    const element = document.getElementById('period-log-form');
                    if (element) {
                      const yOffset = -80;
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                    }
                  };
                  // Try with delay to ensure DOM is ready
                  requestAnimationFrame(() => {
                    scrollToForm();
                    setTimeout(scrollToForm, 100);
                  });
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="nb-body-sm">{menstrualHistory.length > 0 ? 'Tracked this month' : 'Not logged yet'}</p>
          </div>

          {/* Symptoms Card */}
          <div className="nb-card nb-card-lavender">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center" style={{ 
                  background: 'var(--nb-white)', 
                  border: 'var(--nb-border-md)',
                  borderRadius: '50%'
                }}>
                  <Activity className="w-5 h-5" />
                </div>
                <p className="nb-heading-xs" style={{ fontSize: '1rem' }}>SYMPTOMS</p>
              </div>
              <button 
                className="nb-button nb-button-sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Scroll to form - try multiple methods
                  const scrollToForm = () => {
                    // Method 1: Use ref
                    if (formRef.current) {
                      formRef.current.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                      });
                      return;
                    }
                    // Method 2: Use ID with offset
                    const element = document.getElementById('period-log-form');
                    if (element) {
                      const yOffset = -80;
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                    }
                  };
                  // Try with delay to ensure DOM is ready
                  requestAnimationFrame(() => {
                    scrollToForm();
                    setTimeout(scrollToForm, 100);
                  });
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="nb-body-sm">{selectedSymptoms.length > 0 ? `${selectedSymptoms.length} selected` : 'Add symptoms'}</p>
          </div>
        </div>
      </div>

      {/* Factors Section */}
      <div className="nb-card">
        <h2 className="nb-heading-sm mb-4">OTHER DATA & INFLUENCES</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Moon, label: 'Sleep Quality', color: 'var(--nb-lavender)' },
            { icon: Activity, label: 'Mood', color: 'var(--nb-peach)' },
            { icon: Zap, label: 'Energy', color: 'var(--nb-yellow)' },
            { icon: Activity, label: 'Physical Activity', color: 'var(--nb-mint)' },
          ].map((factor, i) => (
            <div key={i} className="nb-card" style={{ background: factor.color, padding: '1rem' }}>
              <factor.icon className="w-8 h-8 mx-auto mb-2" />
              <p className="nb-body-sm text-center" style={{ fontWeight: 700 }}>{factor.label}</p>
              <p className="nb-body text-center mt-1" style={{ fontSize: '1.5rem', fontWeight: 900 }}>3/5</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Entry Form */}
      <div 
        className="nb-card" 
        ref={formRef}
        id="period-log-form"
        style={{ scrollMarginTop: '80px' }}
      >
        <h2 className="nb-heading-sm mb-4">LOG PERIOD DATA</h2>
        
        {/* Date Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="nb-heading-xs mb-3 block" style={{ fontSize: '0.875rem' }}>START DATE</label>
              <input
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                className="nb-input"
              />
            </div>
            <div>
              <label className="nb-heading-xs mb-3 block" style={{ fontSize: '0.875rem' }}>END DATE (OPTIONAL)</label>
              <input
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                className="nb-input"
                min={startDate ? startDate.toISOString().split('T')[0] : undefined}
              />
            </div>
          </div>
        </div>
        
        {/* Flow Intensity */}
        <div className="mb-6">
          <label className="nb-heading-xs mb-3 block" style={{ fontSize: '0.875rem' }}>FLOW INTENSITY</label>
          <div className="flex gap-3" style={{ flexDirection: 'row' }}>
            {[1, 2, 3, 4, 5].map((level) => {
              const intensityLabels = ['very light', 'light', 'medium', 'heavy', 'very heavy'];
              const intensityValues = ['very-light', 'light', 'medium', 'heavy', 'very-heavy'];
              const intensity = intensityValues[level - 1];
              const label = intensityLabels[level - 1];
              // Check if this intensity level is selected
              const isSelected = flowIntensity === intensity;
              return (
                <button
                  key={level}
                  onClick={() => setFlowIntensity(intensity)}
                  className="nb-card"
                  style={{ 
                    flex: 1,
                    padding: '1.5rem',
                    background: isSelected ? 'var(--nb-black)' : 'var(--nb-white)',
                    color: isSelected ? 'var(--nb-white)' : 'var(--nb-black)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '40px', 
                    background: getFlowColor(intensity),
                    border: '3px solid var(--nb-black)',
                    marginBottom: '0.5rem'
                  }}></div>
                  <p className="nb-body-sm text-center" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    {label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Symptoms */}
        <div className="mb-6">
          <label className="nb-heading-xs mb-3 block" style={{ fontSize: '0.875rem' }}>SYMPTOMS</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SYMPTOMS.map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSymptomToggle(symptom)}
                className="nb-toggle"
                style={{
                  background: selectedSymptoms.includes(symptom) ? 'var(--nb-black)' : 'var(--nb-white)',
                  color: selectedSymptoms.includes(symptom) ? 'var(--nb-white)' : 'var(--nb-black)',
                  padding: '0.75rem',
                  fontSize: '0.875rem'
                }}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="nb-button nb-button-primary nb-button-lg" style={{ width: '100%' }}>
          Save Period Data
        </button>
      </div>

      {/* Cycle Visualization */}
      {menstrualHistory.length > 0 && (
        <div className="nb-card">
          <h2 className="nb-heading-sm mb-4">CYCLE HISTORY & PREDICTIONS</h2>
          <MenstrualCycleChart data={menstrualHistory} />
        </div>
      )}

      {/* Summary Bar */}
      <div className="nb-card nb-card-gradient">
        <div className="flex items-center justify-between">
          <div>
            <p className="nb-body-sm" style={{ color: 'var(--nb-white)', opacity: 0.9 }}>CYCLE DAY</p>
            <p className="nb-heading-md" style={{ color: 'var(--nb-white)', lineHeight: 1 }}>14</p>
          </div>
          <div className="text-center">
            <p className="nb-body-sm" style={{ color: 'var(--nb-white)', opacity: 0.9 }}>PREDICTED PERIOD</p>
            <p className="nb-heading-xs" style={{ color: 'var(--nb-white)' }}>IN 14 DAYS</p>
          </div>
          <div className="text-right">
            <p className="nb-body-sm" style={{ color: 'var(--nb-white)', opacity: 0.9 }}>OVULATION WINDOW</p>
            <p className="nb-heading-xs" style={{ color: 'var(--nb-white)' }}>DAY 12-16</p>
          </div>
        </div>
      </div>
    </div>
  );
}
