import React, { useState } from 'react';
import { Play, Pause, Wind, Heart, Podcast, Phone, ExternalLink, Headphones } from 'lucide-react';

const MEDITATION_EXERCISES = [
  { id: 1, title: 'Morning Mindfulness', duration: '10 min', category: 'Meditation', difficulty: 'Beginner', color: 'var(--nb-lavender)' },
  { id: 2, title: 'Body Scan Relaxation', duration: '15 min', category: 'Meditation', difficulty: 'Intermediate', color: 'var(--nb-lavender)' },
  { id: 3, title: 'Evening Wind Down', duration: '12 min', category: 'Meditation', difficulty: 'Beginner', color: 'var(--nb-lavender)' },
];

const BREATHING_EXERCISES = [
  { id: 4, title: '4-7-8 Breathing', duration: '5 min', category: 'Breathing', difficulty: 'Beginner', description: 'Inhale for 4, hold for 7, exhale for 8', color: 'var(--nb-mint)' },
  { id: 5, title: 'Box Breathing', duration: '8 min', category: 'Breathing', difficulty: 'Beginner', description: 'Equal counts for inhale, hold, exhale, hold', color: 'var(--nb-mint)' },
  { id: 6, title: 'Alternate Nostril', duration: '10 min', category: 'Breathing', difficulty: 'Advanced', description: 'Calming pranayama technique', color: 'var(--nb-mint)' },
];

const YOGA_SESSIONS = [
  { id: 7, title: 'Gentle Morning Flow', duration: '20 min', category: 'Yoga', difficulty: 'Beginner', color: 'var(--nb-peach)' },
  { id: 8, title: 'Stress Relief Yoga', duration: '25 min', category: 'Yoga', difficulty: 'Intermediate', color: 'var(--nb-peach)' },
  { id: 9, title: 'Restorative Evening', duration: '30 min', category: 'Yoga', difficulty: 'Beginner', color: 'var(--nb-peach)' },
];

const PODCASTS = [
  { id: 10, title: 'The Mindful Student', episode: 'Managing Exam Stress', duration: '35 min', category: 'Podcast', color: 'var(--nb-yellow)' },
  { id: 11, title: 'Mental Health Matters', episode: 'Building Resilience', duration: '42 min', category: 'Podcast', color: 'var(--nb-yellow)' },
  { id: 12, title: 'Wellness Weekly', episode: 'Sleep & Success', duration: '28 min', category: 'Podcast', color: 'var(--nb-yellow)' },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<'meditation' | 'breathing' | 'yoga' | 'podcasts'>('meditation');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const handlePlay = (id: number) => {
    if (playingId === id) {
      setPlayingId(null);
      setProgress(0);
    } else {
      setPlayingId(id);
      setProgress(0);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'var(--nb-mint)';
      case 'Intermediate': return 'var(--nb-yellow)';
      case 'Advanced': return 'var(--nb-red-light)';
      default: return 'var(--nb-white)';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="nb-heading-lg">WELLNESS RESOURCES</h1>
        <p className="nb-body mt-2">Access guided exercises and support resources</p>
      </div>

      {/* Emergency Helpline */}
      <div className="nb-card" style={{ background: 'var(--nb-red-light)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center" style={{ 
              background: '#DC2626',
              borderRadius: '50%',
              border: 'var(--nb-border-md)',
              boxShadow: 'var(--nb-shadow-md)'
            }}>
              <Phone className="w-7 h-7" style={{ color: 'var(--nb-white)' }} />
            </div>
            <div>
              <h3 className="nb-heading-sm" style={{ marginBottom: '0.5rem' }}>24/7 EMERGENCY SUPPORT</h3>
              <p className="nb-body-sm">Toll-free helpline for disabled and emergency cases</p>
              <div className="flex gap-4 mt-2">
                <div>
                  <p className="nb-body-sm" style={{ fontSize: '0.75rem', opacity: 0.7 }}>National Suicide Prevention</p>
                  <p className="nb-body" style={{ fontWeight: 800 }}>988</p>
                </div>
                <div>
                  <p className="nb-body-sm" style={{ fontSize: '0.75rem', opacity: 0.7 }}>Crisis Text Line</p>
                  <p className="nb-body" style={{ fontWeight: 800 }}>Text HOME to 741741</p>
                </div>
                <div>
                  <p className="nb-body-sm" style={{ fontSize: '0.75rem', opacity: 0.7 }}>Vishuddhi Helpline</p>
                  <p className="nb-body" style={{ fontWeight: 800 }}>1-800-MINDCARE</p>
                </div>
              </div>
            </div>
          </div>
          <button className="nb-button" style={{ background: '#DC2626', color: 'var(--nb-white)' }}>
            <Phone className="w-4 h-4" />
            Call Now
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('meditation')}
          className={`nb-nav-link ${activeTab === 'meditation' ? 'active' : ''}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Heart className="w-4 h-4" />
          Meditation
        </button>
        <button
          onClick={() => setActiveTab('breathing')}
          className={`nb-nav-link ${activeTab === 'breathing' ? 'active' : ''}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Wind className="w-4 h-4" />
          Breathing
        </button>
        <button
          onClick={() => setActiveTab('yoga')}
          className={`nb-nav-link ${activeTab === 'yoga' ? 'active' : ''}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Heart className="w-4 h-4" />
          Yoga
        </button>
        <button
          onClick={() => setActiveTab('podcasts')}
          className={`nb-nav-link ${activeTab === 'podcasts' ? 'active' : ''}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Podcast className="w-4 h-4" />
          Podcasts
        </button>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'meditation' && MEDITATION_EXERCISES.map((exercise) => (
          <ResourceCard
            key={exercise.id}
            {...exercise}
            playing={playingId === exercise.id}
            onPlay={() => handlePlay(exercise.id)}
            getDifficultyColor={getDifficultyColor}
          />
        ))}
        {activeTab === 'breathing' && BREATHING_EXERCISES.map((exercise) => (
          <ResourceCard
            key={exercise.id}
            {...exercise}
            playing={playingId === exercise.id}
            onPlay={() => handlePlay(exercise.id)}
            getDifficultyColor={getDifficultyColor}
          />
        ))}
        {activeTab === 'yoga' && YOGA_SESSIONS.map((session) => (
          <ResourceCard
            key={session.id}
            {...session}
            playing={playingId === session.id}
            onPlay={() => handlePlay(session.id)}
            getDifficultyColor={getDifficultyColor}
          />
        ))}
        {activeTab === 'podcasts' && PODCASTS.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            {...podcast}
            playing={playingId === podcast.id}
            onPlay={() => handlePlay(podcast.id)}
          />
        ))}
      </div>

      {/* External Resources */}
      <div className="nb-card">
        <h2 className="nb-heading-sm mb-4">ADDITIONAL RESOURCES</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <a
            href="https://www.mentalhealth.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="nb-card"
            style={{ textDecoration: 'none', color: 'var(--nb-black)', padding: '1.5rem' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="nb-heading-xs" style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>MENTALHEALTH.GOV</p>
                <p className="nb-body-sm">Government mental health resources</p>
              </div>
              <ExternalLink className="w-5 h-5" />
            </div>
          </a>
          <a
            href="https://www.nami.org"
            target="_blank"
            rel="noopener noreferrer"
            className="nb-card"
            style={{ textDecoration: 'none', color: 'var(--nb-black)', padding: '1.5rem' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="nb-heading-xs" style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>NAMI</p>
                <p className="nb-body-sm">National Alliance on Mental Illness</p>
              </div>
              <ExternalLink className="w-5 h-5" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ title, duration, difficulty, description, playing, onPlay, getDifficultyColor, color }: any) {
  return (
    <div className="nb-card" style={{ background: color }}>
      <div className="aspect-video flex items-center justify-center mb-3 nb-card-gradient" style={{ borderRadius: '0' }}>
        <button
          onClick={onPlay}
          className="w-16 h-16 flex items-center justify-center nb-button"
          style={{ borderRadius: '50%', background: 'var(--nb-white)', padding: 0 }}
        >
          {playing ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>
      </div>
      <h3 className="nb-heading-xs mb-1" style={{ fontSize: '1rem' }}>{title}</h3>
      {description && <p className="nb-body-sm mb-2" style={{ opacity: 0.8 }}>{description}</p>}
      <div className="flex items-center justify-between">
        <span className="nb-body-sm" style={{ fontWeight: 600 }}>{duration}</span>
        <div className="nb-badge" style={{ background: getDifficultyColor(difficulty) }}>
          {difficulty}
        </div>
      </div>
    </div>
  );
}

function PodcastCard({ title, episode, duration, playing, onPlay, color }: any) {
  return (
    <div className="nb-card" style={{ background: color }}>
      <div className="aspect-video flex items-center justify-center mb-3 nb-card-gradient" style={{ borderRadius: '0' }}>
        <button
          onClick={onPlay}
          className="w-16 h-16 flex items-center justify-center nb-button"
          style={{ borderRadius: '50%', background: 'var(--nb-white)', padding: 0 }}
        >
          {playing ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Headphones className="w-8 h-8" />
          )}
        </button>
      </div>
      <h3 className="nb-heading-xs mb-1" style={{ fontSize: '1rem' }}>{title}</h3>
      <p className="nb-body-sm mb-2" style={{ opacity: 0.8 }}>{episode}</p>
      <div className="flex items-center justify-between">
        <span className="nb-body-sm" style={{ fontWeight: 600 }}>{duration}</span>
        <Podcast className="w-5 h-5" />
      </div>
    </div>
  );
}
