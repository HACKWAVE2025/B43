// backend/services/ml_client.js
import axios from "axios";

// Support both ML_SERVICE_URL (preferred) and ML_API_URL (older .env key) for compatibility
const baseURL = process.env.ML_SERVICE_URL || process.env.ML_API_URL || "http://localhost:5000";

export async function predictClassifier(features) {
  const { data } = await axios.post(`${baseURL}/predict/classifier`, { features });
  return data;
}

export async function predictRegressor(features) {
  const { data } = await axios.post(`${baseURL}/predict/regressor`, { features });
  return data;
}
