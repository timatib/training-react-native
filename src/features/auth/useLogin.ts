import { useState } from 'react';
import { useAuthStore } from './authStore';

export function useLogin() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка входа. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}
