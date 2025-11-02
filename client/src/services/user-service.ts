import { authenticatedFetch, getAuthToken } from './auth-service';

const API_BASE_URL = 'http://localhost:8080';

interface MentalHealthProfileData {
  anxietyLevel: number;
  mentalHealthHistory: boolean;
  headache: number;
  financialCondition: boolean;
  safety: number;
}

interface SaveSurveyResponse {
  message: string;
  survey: {
    anxiety_level: number;
    mental_health_history: number;
    headache: number;
    financial_condition: string;
    safety: number;
    academic_performance?: number;
    extracurricular_activities?: number;
    gender?: number;
  };
}

/**
 * Saves mental health profile data to the backend database
 * @param data - Mental health profile form data
 * @param userData - Optional user data (cgpa, extracurricularActivities, gender) to include in survey
 */
export async function saveMentalHealthProfile(
  data: MentalHealthProfileData,
  userData?: { cgpa?: number; extracurricularActivities?: string[]; gender?: number }
): Promise<SaveSurveyResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated. Please log in.');
  }

  // Calculate academic_performance from CGPA if available
  // CGPA scale: 0-10, academic_performance scale: 1-5
  let academic_performance: number | undefined;
  if (userData?.cgpa !== undefined && userData.cgpa !== null) {
    const cgpa = userData.cgpa;
    if (cgpa >= 9) academic_performance = 5;
    else if (cgpa >= 8) academic_performance = 4;
    else if (cgpa >= 7) academic_performance = 3;
    else if (cgpa >= 6) academic_performance = 2;
    else academic_performance = 1;
  }

  // Calculate extracurricular_activities count
  const extracurricular_activities = userData?.extracurricularActivities
    ? userData.extracurricularActivities.filter(a => a && a.trim() !== '').length
    : undefined;

  // Map frontend field names to backend field names
  const surveyData: any = {
    anxiety_level: data.anxietyLevel,
    mental_health_history: data.mentalHealthHistory ? 1 : 0,
    headache: data.headache,
    financial_condition: data.financialCondition ? 'yes' : 'no',
    safety: Number(data.safety), // Explicitly convert to number
  };

  console.log('🔍 Safety value being sent:', surveyData.safety, 'Type:', typeof surveyData.safety);

  // Add optional fields if provided
  if (academic_performance !== undefined) {
    surveyData.academic_performance = academic_performance;
  }
  if (extracurricular_activities !== undefined) {
    surveyData.extracurricular_activities = extracurricular_activities;
  }
  if (userData?.gender !== undefined && userData.gender !== null) {
    surveyData.gender = userData.gender;
  }

  console.log('📤 Sending survey data to backend:', surveyData);

  const response = await authenticatedFetch(`${API_BASE_URL}/api/users/survey`, {
    method: 'POST',
    body: JSON.stringify(surveyData),
  });

  console.log('📥 Response status:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save mental health profile');
  }

  return response.json();
}

