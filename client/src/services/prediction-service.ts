import { authenticatedFetch, getAuthToken } from './auth-service';

const API_BASE_URL = 'http://localhost:8080';

interface MLPredictionResponse {
  user: string;
  normal_stress: {
    level: 'No Stress' | 'Low Stress' | 'Moderate Stress' | 'High Stress';
    value: number; // 1-4
  };
  period_stress?: {
    value: number;
  };
}

/**
 * Gets stress prediction from ML model using user survey + wearable data
 */
export async function getMLStressPrediction(): Promise<MLPredictionResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated. Please log in.');
  }

  const response = await authenticatedFetch(`${API_BASE_URL}/api/users/predict`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get stress prediction from ML model');
  }

  return response.json();
}

