import { useState, useEffect, useCallback } from 'react';
import { checkAdminAuth, adminLogin, adminLogout } from '@/lib/admin-api';

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  error: string | null;
}

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isLoading: true,
    username: null,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const result = await checkAdminAuth();
      setState({
        isAuthenticated: result.authenticated === true,
        isLoading: false,
        username: result.username || null,
        error: null,
      });
    } catch {
      setState({
        isAuthenticated: false,
        isLoading: false,
        username: null,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    setState(prev => ({ ...prev, error: null, isLoading: true }));
    try {
      const result = await adminLogin(username, password);
      if (result.error) {
        setState(prev => ({ ...prev, error: result.error, isLoading: false }));
        return false;
      }
      setState({
        isAuthenticated: true,
        isLoading: false,
        username: result.username,
        error: null,
      });
      return true;
    } catch {
      setState(prev => ({
        ...prev,
        error: 'Login failed. Make sure you are on the live site.',
        isLoading: false,
      }));
      return false;
    }
  };

  const logout = async () => {
    await adminLogout();
    setState({
      isAuthenticated: false,
      isLoading: false,
      username: null,
      error: null,
    });
  };

  return { ...state, login, logout, checkAuth };
};
