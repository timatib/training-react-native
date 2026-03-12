import { useQuery } from '@tanstack/react-query';
import api from '../../shared/api/axios';
import { Message } from '../../entities/message/types';

export function useMessages() {
  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data } = await api.get('/api/chat/messages?limit=50');
      return data;
    },
  });
}
