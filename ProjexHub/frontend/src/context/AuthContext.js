import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
  try {
    console.log('Sending login request for:', email);
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    console.log('Full response:', res);
    console.log('Response data:', res.data);
    console.log('Success:', res.data.success);
    
    if (res.data.success === true) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      console.log('Login successful, redirecting...');
      return { success: true };
    } else {
      console.log('Success false');
      return { success: false, error: 'Login failed' };
    }
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    return { 
      success: false, 
      error: err.response?.data?.msg || 'Login failed' 
    };
  }
};

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      return { success: true, message: res.data.msg };
    } catch (err) {
      return { success: false, error: err.response?.data?.msg || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};