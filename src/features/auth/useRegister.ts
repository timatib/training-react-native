import { useState } from 'react';
import { useAuthStore } from './authStore';

export function useRegister() {
  const { register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading, error };
}
