import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../shared/api/axios';
import { NutritionLog, DailySummary } from '../../entities/meal/types';

export function useNutritionLogs(date?: string) {
  return useQuery<NutritionLog[]>({
    queryKey: ['nutrition', date],
    queryFn: async () => {
      const params = date ? `?date=${date}` : '';
      const { data } = await api.get(`/api/nutrition${params}`);
      return data;
    },
  });
}

export function useDailySummary(date?: string) {
  return useQuery<DailySummary>({
    queryKey: ['nutrition-summary', date],
    queryFn: async () => {
      const params = date ? `?date=${date}` : '';
      const { data } = await api.get(`/api/nutrition/daily-summary${params}`);
      return data;
    },
  });
}

export function useLogMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meal: string) => {
      const { data } = await api.post('/api/nutrition/log', { meal });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });
      queryClient.invalidateQueries({ queryKey: ['nutrition-summary'] });
    },
  });
}
