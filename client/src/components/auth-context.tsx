import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, getAuthToken, setAuthToken, removeAuthToken } from '../services/auth-service';

interface User {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  photoURL?: string;
  gender?: 'male' | 'female' | 'other';
  isAdmin?: boolean;
  cgpa?: number;
  extracurricularActivities?: string[];
  roles?: string[];
}

interface ProfileData {
  email?: string;
  fullName?: string;
  gender?: 'male' | 'female' | 'other';
  cgpa?: number;
  extracurricularActivities?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
  register: (username: string, password: string, profileData?: ProfileData, role?: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    const token = getAuthToken();

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const register = async (username: string, password: string, profileData?: ProfileData, role: string = 'user') => {
    try {
      const response = await registerUser({
        username,
        password,
        role,
        email: profileData?.email,
        fullName: profileData?.fullName,
        gender: profileData?.gender,
        cgpa: profileData?.cgpa,
        extracurricularActivities: profileData?.extracurricularActivities,
      });

      // After successful registration, automatically log in
      // This will fetch the full user profile from backend
      await login(username, password);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await loginUser({ username, password });

      // Store the token
      setAuthToken(response.token);

      // Use user data from response or create a basic user object
      const userData: User = response.user ? {
        uid: response.user.id,
        username: response.user.username,
        displayName: response.user.displayName,
        email: response.user.email,
        gender: response.user.gender,
        cgpa: response.user.cgpa,
        extracurricularActivities: response.user.extracurricularActivities,
        isAdmin: response.user.roles?.includes('admin') || false,
        roles: response.user.roles,
      } : {
        uid: username,
        username: username,
        displayName: username,
        email: '',
        isAdmin: false,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signInWithGoogle = async () => {
    // Mock Google Sign-In
    const mockUser: User = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      email: 'student@example.com',
      displayName: 'Student User',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signOut = async () => {
    setUser(null);
    removeAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('journalEntries');
    localStorage.removeItem('menstrualData');
    localStorage.removeItem('todoItems');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, updateUserProfile, register, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
