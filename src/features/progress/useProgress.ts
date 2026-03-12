import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../shared/api/axios';

export interface ProgressLog {
  id: string;
  note: string;
  aiResponse: string;
  createdAt: string;
}

export function useProgressLogs() {
  return useQuery<ProgressLog[]>({
    queryKey: ['progress'],
    queryFn: async () => {
      const { data } = await api.get('/api/progress');
      return data;
    },
  });
}

export function useAddProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: string) => {
      const { data } = await api.post('/api/progress', { note });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
}
