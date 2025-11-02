// Mock ML Service - Simulates Random Forest Classifier and Regression
// In production, this would connect to a backend ML service

interface StressPrediction {
  level: 'No Stress' | 'Low Stress' | 'Moderate Stress' | 'High Stress';
  confidence: number;
  score: number; // 0-10
  features: {
    sleepHours: number;
    heartRate: number;
    activityLevel: number;
    journalSentiment: number;
    menstrualPhase?: number; // For female users
  };
  suicideRisk: number; // 0-1
}

export async function getStressPrediction(): Promise<StressPrediction> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get user data
  const userData = getUserData();
  const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
  const menstrualData = JSON.parse(localStorage.getItem('menstrualData') || '[]');

  // Mock feature extraction
  const features = {
    sleepHours: userData.sleepHours || 7,
    heartRate: userData.heartRate || 75,
    activityLevel: userData.activityLevel || 5,
    journalSentiment: calculateAverageSentiment(journalEntries),
    menstrualPhase: calculateMenstrualPhase(menstrualData),
  };

  // Mock Random Forest Classifier prediction
  const stressScore = calculateStressScore(features);
  const level = classifyStressLevel(stressScore);
  const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence

  // Mock Hugging Face suicidality classifier
  const suicideRisk = analyzeSuicidalityRisk(journalEntries);

  // Save prediction to history
  savePredictionToHistory({ level, score: stressScore, timestamp: new Date().toISOString() });

  return {
    level,
    confidence,
    score: stressScore,
    features,
    suicideRisk,
  };
}

function getUserData() {
  const stored = localStorage.getItem('userData');
  if (stored) return JSON.parse(stored);

  // Generate mock wearable data
  const mockData = {
    sleepHours: 6 + Math.random() * 3, // 6-9 hours
    heartRate: 65 + Math.random() * 20, // 65-85 bpm
    activityLevel: Math.random() * 10, // 0-10
  };

  localStorage.setItem('userData', JSON.stringify(mockData));
  return mockData;
}

function calculateAverageSentiment(entries: any[]): number {
  if (entries.length === 0) return 0.5;

  const recentEntries = entries.slice(-7); // Last 7 days
  const sentiments = recentEntries.map((e) => e.sentiment || 0.5);
  return sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
}

function calculateMenstrualPhase(data: any[]): number | undefined {
  if (data.length === 0) return undefined;

  const latestEntry = data[data.length - 1];
  const startDate = new Date(latestEntry.startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Cycle phase: 1=menstrual, 2=follicular, 3=ovulation, 4=luteal, 5=premenstrual
  const cycleDay = daysSinceStart % 28;

  if (cycleDay < 5) return 1; // Menstrual
  if (cycleDay < 13) return 2; // Follicular
  if (cycleDay < 17) return 3; // Ovulation
  if (cycleDay < 25) return 4; // Luteal
  return 5; // Premenstrual
}

function calculateStressScore(features: any): number {
  // Mock Random Forest Regression
  let score = 5; // Base score

  // Sleep impact
  if (features.sleepHours < 6) score += 2;
  else if (features.sleepHours < 7) score += 1;
  else if (features.sleepHours > 8) score -= 1;

  // Heart rate impact
  if (features.heartRate > 80) score += 1.5;
  else if (features.heartRate < 70) score -= 0.5;

  // Activity impact
  if (features.activityLevel < 3) score += 1;
  else if (features.activityLevel > 7) score -= 1;

  // Journal sentiment impact
  if (features.journalSentiment < 0.3) score += 2;
  else if (features.journalSentiment < 0.5) score += 1;
  else if (features.journalSentiment > 0.7) score -= 1.5;

  // Menstrual phase impact (for female users)
  if (features.menstrualPhase === 1) score += 1.5; // Menstrual phase
  if (features.menstrualPhase === 5) score += 1; // Premenstrual phase

  // Normalize to 0-10
  return Math.max(0, Math.min(10, score));
}

function classifyStressLevel(score: number): StressPrediction['level'] {
  if (score < 2.5) return 'No Stress';
  if (score < 5) return 'Low Stress';
  if (score < 7.5) return 'Moderate Stress';
  return 'High Stress';
}

function analyzeSuicidalityRisk(entries: any[]): number {
  // Mock Hugging Face suicidality classifier
  if (entries.length === 0) return 0;

  const recentEntries = entries.slice(-3); // Last 3 days
  const text = recentEntries
    .flatMap((e: any) => e.goodThings)
    .join(' ')
    .toLowerCase();

  // Simple keyword-based mock classifier
  const negativeKeywords = ['hopeless', 'give up', 'no point', 'worthless', 'end it'];
  const riskScore = negativeKeywords.reduce((score, keyword) => {
    return text.includes(keyword) ? score + 0.3 : score;
  }, 0);

  return Math.min(1, riskScore);
}

function savePredictionToHistory(prediction: any) {
  const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
  history.push(prediction);

  // Keep only last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const filtered = history.filter((p: any) => new Date(p.timestamp) > cutoff);

  localStorage.setItem('predictionHistory', JSON.stringify(filtered));
}

export function getStressTrends() {
  const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');

  // Generate mock data if empty
  if (history.length === 0) {
    const mockData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      mockData.push({
        timestamp: date.toISOString(),
        score: 3 + Math.random() * 4,
        level: ['No Stress', 'Low Stress', 'Moderate Stress'][Math.floor(Math.random() * 3)],
      });
    }
    return mockData;
  }

  return history.slice(-7); // Last 7 days
}

export function getFeatureImportance() {
  // Mock feature importance from Random Forest
  return [
    { feature: 'Sleep Hours', importance: 0.28 },
    { feature: 'Journal Sentiment', importance: 0.24 },
    { feature: 'Heart Rate', importance: 0.18 },
    { feature: 'Activity Level', importance: 0.16 },
    { feature: 'Menstrual Phase', importance: 0.14 },
  ];
}
