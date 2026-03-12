import { useQuery } from '@tanstack/react-query';
import api from '../../shared/api/axios';
import { Streak } from '../../entities/user/types';

export function useStreak() {
  return useQuery<Streak>({
    queryKey: ['streak'],
    queryFn: async () => {
      const { data } = await api.get('/api/progress/streak');
      return data;
    },
  });
}
