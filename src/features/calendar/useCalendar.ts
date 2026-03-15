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

export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: {
      title: string;
      date: string;
      place: string;
      exercises: { name: string; sets: number; reps: number }[];
    }) => {
      const { data } = await api.post('/api/workouts', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/workouts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
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
