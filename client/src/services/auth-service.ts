const API_BASE_URL = 'http://localhost:8080';

interface RegisterData {
    username: string;
    password: string;
    role?: string;
    email?: string;
    fullName?: string;
    gender?: 'male' | 'female' | 'other';
    cgpa?: number;
    extracurricularActivities?: string[];
}

interface LoginData {
    username: string;
    password: string;
}

interface RegisterResponse {
    message: string;
    userId: string;
    username: string;
    roles: string[];
}

interface LoginResponse {
    token: string;
    user?: {
        id: string;
        username: string;
        email: string;
        displayName: string;
        gender?: 'male' | 'female' | 'other';
        cgpa?: number;
        extracurricularActivities?: string[];
        roles?: string[];
    };
}

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: data.username,
            password: data.password,
            role: data.role || 'user',
            email: data.email,
            fullName: data.fullName,
            gender: data.gender,
            cgpa: data.cgpa,
            extracurricularActivities: data.extracurricularActivities,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    return response.json();
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: data.username,
            password: data.password,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return response.json();
}

// Helper to get auth token from localStorage
export function getAuthToken(): string | null {
    return localStorage.getItem('authToken');
}

// Helper to set auth token in localStorage
export function setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
}

// Helper to remove auth token from localStorage
export function removeAuthToken(): void {
    localStorage.removeItem('authToken');
}

// Helper to make authenticated requests
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
}

