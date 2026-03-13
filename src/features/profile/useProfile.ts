import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../shared/api/axios';
import { User } from '../../entities/user/types';

export function useProfile() {
  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/api/users/me');
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const { data } = await api.patch('/api/users/me', updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['nutrition-summary'] });
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}
