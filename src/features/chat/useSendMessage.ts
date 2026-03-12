import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../shared/api/axios';

interface SendMessageResult {
  message: any;
  tokensUsed: number;
  subscriptionWarning?: string;
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<SendMessageResult, Error, string>({
    mutationFn: async (content: string) => {
      const { data } = await api.post('/api/chat/message', { content });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}
