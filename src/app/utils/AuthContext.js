'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); // 🔥 NEW

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/user/me', {
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

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await fetchUserData(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token invalid or API failed");
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false); // ✅ Done checking auth
    };
    checkAuth();
  }, []);

  const login = async (userData, token) => {
    try {
      const fetchedUserData = await fetchUserData(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(fetchedUserData));
      setIsAuthenticated(true);
      setUser(fetchedUserData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData, token) => {
    try {
      const fetchedUserData = await fetchUserData(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(fetchedUserData));
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
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, token, loading }}>
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
