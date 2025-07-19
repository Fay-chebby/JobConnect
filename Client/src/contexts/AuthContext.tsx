import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { User, ProfileUpdateData } from '@/types';

// Define the structure of our auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'jobSeeker' | 'employer';
  // Employer specific fields
  companyName?: string;
  industry?: string;
  description?: string;
  location?: string;
  companySize?: string;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Create the API base URL
const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  // Configure axios to include the token in every request
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/auth/me`);
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        setError('Authentication expired, please login again');
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setIsAuthenticated(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'Registration failed');
      } else {
        setError('Registration failed. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setIsAuthenticated(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        token,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);