import React from 'react';
import MentalHealthProfile from './mental-health-profile';

export default function MentalHealthDemo() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef5e7 0%, #e8f5e9 100%)' }}>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 900, 
            color: '#000',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textShadow: '4px 4px 0px rgba(0,0,0,0.2)'
          }}>
            Vishuddhi Mental Health System
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '1rem' }}>
            Neubrutalism Design • Student Wellness • AI-Powered
          </p>
        </div>
        
        <MentalHealthProfile />

        <div className="text-center mt-5" style={{ padding: '2rem' }}>
          <div style={{
            background: '#fff',
            border: '3px solid #000',
            boxShadow: '6px 6px 0px #000',
            padding: '2rem',
            display: 'inline-block',
            maxWidth: '600px'
          }}>
            <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>🎯 About Vishuddhi</h3>
            <p style={{ color: '#333', lineHeight: 1.8 }}>
              Vishuddhi is a comprehensive mental health management system designed specifically for students. 
              It uses machine learning to analyze your well-being indicators and provides personalized 
              recommendations for stress management, anxiety reduction, and overall mental wellness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
