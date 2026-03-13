import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../../shared/api/axios';
import { User } from '../../entities/user/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const { data } = await api.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setState({ user: data, accessToken: token, isLoading: false, isAuthenticated: true });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      await SecureStore.deleteItemAsync('accessToken');
      setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    setState({ user: data.user, accessToken: data.accessToken, isLoading: false, isAuthenticated: true });
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    setState({ user: data.user, accessToken: data.accessToken, isLoading: false, isAuthenticated: true });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    setState({ user: null, accessToken: null, isLoading: false, isAuthenticated: false });
  };

  const updateUser = (user: User) => {
    setState((s) => ({ ...s, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within AuthProvider');
  return ctx;
}
