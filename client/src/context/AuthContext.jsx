import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('civicwatch_token') || localStorage.getItem('token');
      const savedUser = localStorage.getItem('civicwatch_user');

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (err) {
            console.error('Failed to parse saved user credentials', err);
          }
        }
        try {
          const res = await authAPI.getProfile();
          if (res && res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('civicwatch_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to sync user profile:', err);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const saveSession = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('civicwatch_token', newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('civicwatch_user', JSON.stringify(newUser));
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('civicwatch_token');
    localStorage.removeItem('token');
    localStorage.removeItem('civicwatch_user');
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        const payload = data.data || data;
        const token = payload.token || data.token;
        const userObj = payload.user || payload.admin || data.user || data.admin || { role: 'user' };
        saveSession(token, userObj);
        return { success: true, user: userObj };
      }
      return {
        success: false,
        error: data.error || 'Login failed',
        requiresOtp: data.requiresOtp,
        email: data.email || email
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      if (data.success) {
        const payload = data.data || data;
        const token = payload.token || data.token;
        const userObj = payload.user || data.user;
        if (token && userObj) {
          saveSession(token, userObj);
        }
        return { success: true, user: userObj, data };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    clearSession();
  };

  const loginWithToken = (newToken, newUser) => {
    saveSession(newToken, newUser);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('civicwatch_user', JSON.stringify(updatedUser));
  };

  const isAdmin = () => user?.role === 'admin';

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAdmin,
    loading,
    updateUser,
    loginWithToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};