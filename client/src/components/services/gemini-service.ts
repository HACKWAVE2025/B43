// Gemini API Service - Mock implementation
// In production, this would call the actual Gemini API

import { getJournalEntries, addTodoItem, clearTodoItems } from './data-service';
import { getStressPrediction } from './ml-service';

export async function generateRecommendations() {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get context
  const journalEntries = getJournalEntries();
  const stressPrediction = await getStressPrediction();

  // Build context for Gemini
  const recentJournals = journalEntries.slice(-3);
  const context = {
    stressLevel: stressPrediction.level,
    stressScore: stressPrediction.score,
    recentJournals: recentJournals.map((e) => e.goodThings).flat(),
    features: stressPrediction.features,
  };

  // Mock Gemini API response - Generate personalized recommendations
  const recommendations = generateMockRecommendations(context);

  // Clear old todos and save new ones
  clearTodoItems();
  recommendations.forEach((rec) => {
    addTodoItem(rec.text, rec.category);
  });

  return recommendations;
}

function generateMockRecommendations(context: any) {
  const recommendations = [];

  // Based on stress level
  if (context.stressScore > 7) {
    recommendations.push(
      { text: 'Practice 10 minutes of deep breathing exercises', category: 'Immediate Relief' },
      { text: 'Take a 15-minute walk outside', category: 'Physical Activity' },
      { text: 'Call a friend or family member for support', category: 'Social Connection' }
    );
  } else if (context.stressScore > 5) {
    recommendations.push(
      { text: 'Complete a guided meditation session', category: 'Mindfulness' },
      { text: 'Journal about one challenging situation today', category: 'Reflection' },
      { text: 'Do 20 minutes of light exercise or yoga', category: 'Physical Activity' }
    );
  } else {
    recommendations.push(
      { text: 'Continue your journaling streak', category: 'Maintenance' },
      { text: 'Try a new wellness activity from resources', category: 'Exploration' },
      { text: 'Set one personal goal for tomorrow', category: 'Growth' }
    );
  }

  // Based on sleep
  if (context.features.sleepHours < 7) {
    recommendations.push(
      { text: 'Set a bedtime alarm for 10 PM tonight', category: 'Sleep Hygiene' },
      { text: 'Avoid screens 1 hour before bed', category: 'Sleep Hygiene' }
    );
  }

  // Based on activity
  if (context.features.activityLevel < 4) {
    recommendations.push(
      { text: 'Take the stairs instead of elevator today', category: 'Physical Activity' },
      { text: 'Do 5 minutes of stretching every hour', category: 'Movement' }
    );
  }

  // Based on journal sentiment
  if (context.features.journalSentiment < 0.4) {
    recommendations.push(
      { text: 'Practice gratitude - write 3 more things you\'re thankful for', category: 'Positivity' },
      { text: 'Listen to an uplifting podcast from resources', category: 'Mood Boost' }
    );
  }

  // Menstrual phase recommendations
  if (context.features.menstrualPhase === 1) {
    recommendations.push(
      { text: 'Take it easy - do gentle yoga or rest', category: 'Self-Care' },
      { text: 'Stay hydrated and eat iron-rich foods', category: 'Nutrition' }
    );
  }

  // Limit to 6 recommendations
  return recommendations.slice(0, 6);
}
