import React from 'react';
import {
  Box, VStack, HStack, Text, Button, Progress, useColorModeValue, ScrollView,
} from 'native-base';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../shared/api/axios';
import { Subscription } from '../../entities/user/types';

const PLANS = [
  {
    type: 'TRIAL',
    name: 'Пробный',
    icon: '🆓',
    features: ['10,000 токенов', 'Основной чат', 'Базовые тренировки'],
    color: '#6b7280',
  },
  {
    type: 'FREE',
    name: 'Бесплатный',
    icon: '⚡',
    features: ['20,000 токенов', 'Всё из Пробного', 'Календарь тренировок', 'Дневник питания'],
    color: '#3b82f6',
  },
  {
    type: 'PRO',
    name: 'Pro',
    icon: '⭐',
    features: ['100,000 токенов', 'Всё из Бесплатного', 'Голосовые сообщения', 'Приоритетная поддержка'],
    color: '#f59e0b',
    highlighted: true,
  },
];

export function SubscriptionPage() {
  const queryClient = useQueryClient();
  const bg = useColorModeValue('gray.50', 'gray.900');

  const { data: subscription } = useQuery<Subscription>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data } = await api.get('/api/subscriptions/current');
      return data;
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/api/subscriptions/upgrade');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const tokenPercent = subscription
    ? Math.min(100, Math.round((subscription.tokensUsed / subscription.tokensLimit) * 100))
    : 0;

  return (
    <Box flex={1} bg={bg} safeArea>
      <ScrollView>
        <Box px={4} py={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>Подписка</Text>
          <Text color="gray.500" mb={6}>Управление вашим планом</Text>

          {/* Current usage */}
          {subscription && (
            <Box bg="white" borderRadius="xl" p={4} shadow={1} mb={6}>
              <HStack justifyContent="space-between" mb={2}>
                <Text fontWeight="600">Использование токенов</Text>
                <Text color="gray.500" fontSize="sm">
                  {subscription.tokensUsed.toLocaleString()} / {subscription.tokensLimit.toLocaleString()}
                </Text>
              </HStack>
              <Progress
                value={tokenPercent}
                colorScheme={tokenPercent > 80 ? 'red' : tokenPercent > 60 ? 'yellow' : 'green'}
                size="sm"
                borderRadius="full"
              />
              {tokenPercent >= 80 && (
                <Box bg="red.50" borderRadius="lg" p={3} mt={3} borderLeftWidth={3} borderLeftColor="red.400">
                  <Text fontSize="sm" color="red.600">
                    ⚠️ Осталось мало токенов. Рекомендуем обновить подписку.
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {/* Plans */}
          <Text fontSize="lg" fontWeight="bold" mb={3}>Тарифы</Text>
          <VStack space={3}>
            {PLANS.map((plan) => {
              const isCurrent = subscription?.type === plan.type;
              return (
                <Box
                  key={plan.type}
                  bg="white"
                  borderRadius="xl"
                  p={4}
                  shadow={plan.highlighted ? 3 : 1}
                  borderWidth={isCurrent ? 2 : plan.highlighted ? 1 : 0}
                  borderColor={isCurrent ? plan.color : plan.highlighted ? '#f59e0b50' : 'transparent'}
                >
                  <HStack justifyContent="space-between" alignItems="center" mb={3}>
                    <HStack space={2} alignItems="center">
                      <Text fontSize="2xl">{plan.icon}</Text>
                      <Text fontSize="lg" fontWeight="bold">{plan.name}</Text>
                    </HStack>
                    {isCurrent && (
                      <Box bg="green.100" borderRadius="full" px={3} py={1}>
                        <Text fontSize="xs" color="green.600" fontWeight="600">Текущий</Text>
                      </Box>
                    )}
                  </HStack>

                  <VStack space={1} mb={3}>
                    {plan.features.map((f) => (
                      <HStack key={f} space={2} alignItems="center">
                        <Text fontSize="xs" color="green.500">✓</Text>
                        <Text fontSize="sm" color="gray.600">{f}</Text>
                      </HStack>
                    ))}
                  </VStack>

                  {plan.type === 'PRO' && !isCurrent && (
                    <Button
                      onPress={() => upgradeMutation.mutate()}
                      isLoading={upgradeMutation.isPending}
                      isLoadingText="Обновление..."
                      colorScheme="yellow"
                      borderRadius="xl"
                    >
                      ⭐ Перейти на Pro
                    </Button>
                  )}
                </Box>
              );
            })}
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}
