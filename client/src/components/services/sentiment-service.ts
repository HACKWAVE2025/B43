// Sentiment Analysis Service - Mock implementation
// In production, this would use a real NLP model

export async function analyzeSentiment(text: string): Promise<number> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Simple mock sentiment analysis
  const positiveWords = [
    'good', 'great', 'happy', 'excellent', 'wonderful', 'amazing', 'love',
    'joy', 'excited', 'grateful', 'thankful', 'blessed', 'peaceful', 'calm',
    'accomplished', 'proud', 'success', 'friend', 'fun', 'beautiful'
  ];

  const negativeWords = [
    'bad', 'terrible', 'awful', 'sad', 'angry', 'hate', 'stress', 'anxious',
    'worried', 'depressed', 'tired', 'exhausted', 'overwhelmed', 'difficult',
    'hard', 'struggle', 'pain', 'hurt', 'lonely', 'frustrated'
  ];

  const words = text.toLowerCase().split(/\s+/);
  let score = 0.5; // Neutral baseline

  words.forEach((word) => {
    if (positiveWords.includes(word)) score += 0.05;
    if (negativeWords.includes(word)) score -= 0.05;
  });

  // Normalize to 0-1
  return Math.max(0, Math.min(1, score));
}
