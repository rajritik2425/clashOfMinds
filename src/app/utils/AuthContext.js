'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  // Function to fetch user data
  const fetchUserData = async (token) => {
    try {
      const response = await fetch('api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setToken(token);
          const userData = await fetchUserData(token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // If token is invalid, clear storage
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  const login = async (userData, token) => {
    try {
      // Fetch user data from API
      const fetchedUserData = await fetchUserData(token);
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(fetchedUserData));
      
      // Update state
      setIsAuthenticated(true);
      setUser(fetchedUserData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData, token) => {
    try {
      // Fetch user data from API
      const fetchedUserData = await fetchUserData(token);
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(fetchedUserData));
      
      // Update state
      setIsAuthenticated(true);
      setUser(fetchedUserData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 