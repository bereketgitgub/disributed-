import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user data from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log('Checking auth with token:', token.substring(0, 20) + '...');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        console.log('Auth check response:', response.data);
        setUser(response.data);
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setError('Authentication failed. Please login again.');
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      console.log('Attempting login for:', username);
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      setError(null);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  // Add helper methods for role checking with debug logs
  const isAdmin = () => {
    const result = user?.role_id === 1;
    console.log('isAdmin check:', { user, result }); // Debug log
    return result;
  };

  const isLibrarian = () => {
    const result = user?.role_id === 2;
    console.log('isLibrarian check:', { user, result }); // Debug log
    return result;
  };

  const isMember = () => {
    const result = user?.role_id === 3;
    console.log('isMember check:', { user, result }); // Debug log
    return result;
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: isAdmin(),
    isLibrarian: isLibrarian(),
    isMember: isMember(),
    error
  };

  console.log('AuthContext value:', value); // Debug log

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};