import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../shared/api/axios';
import { WorkoutPlan } from '../../entities/workout/types';

export function useCalendar(month: string) {
  return useQuery<WorkoutPlan[]>({
    queryKey: ['calendar', month],
    queryFn: async () => {
      const { data } = await api.get(`/api/calendar?month=${month}`);
      return data;
    },
  });
}

export function useCompleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutId: string) => {
      const { data } = await api.patch(`/api/workouts/${workoutId}/complete`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
    },
  });
}
