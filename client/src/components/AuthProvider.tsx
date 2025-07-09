'use client';

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { verifyToken } from '@/lib/auth';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else if (token) {
      verifyToken(token)
        .then((decoded) => {
          const userFromToken: User = {
            id: decoded.userId,
            email: decoded.email,
            firstName: decoded.firstName || '',
            lastName: decoded.lastName || '',
          };
          localStorage.setItem('user', JSON.stringify(userFromToken));
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(userFromToken);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('https://formistiq-server.vercel.app/api/auth/login', { email, password });
    const { token, user: userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const signup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const response = await axios.post('https://formistiq-server.vercel.app/api/auth/signup', userData);
    const { token, user: userDataResponse } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userDataResponse));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userDataResponse);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
