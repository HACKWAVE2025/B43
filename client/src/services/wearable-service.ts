// Service for interacting with wearable data endpoints

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Upload Excel file to backend
 */
export async function uploadExcelFile(file: File): Promise<{
  success: boolean;
  records: number;
  headers: string[];
  message: string;
}> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/wearable/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload file');
  }

  return response.json();
}

/**
 * Get all uploaded wearable data for the current user
 */
export async function getUserWearableData(): Promise<{
  success: boolean;
  count: number;
  data: Array<{
    _id: string;
    raw: {
      headers: string[];
      data: any[];
      totalRows: number;
      uploadedAt: string;
    };
    source: string;
    uploadedAt: string;
  }>;
}> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/wearable/data`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch wearable data');
  }

  return response.json();
}

/**
 * Get specific wearable data by ID
 */
export async function getWearableDataById(id: string): Promise<{
  success: boolean;
  data: {
    _id: string;
    raw: {
      headers: string[];
      data: any[];
      totalRows: number;
      uploadedAt: string;
    };
    source: string;
    uploadedAt: string;
  };
}> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/wearable/data/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch wearable data');
  }

  return response.json();
}



