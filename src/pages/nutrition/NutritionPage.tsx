import React, { useState } from 'react';
import {
  Box, VStack, HStack, Text, ScrollView, Input, Button,
  Progress, useColorModeValue, Pressable, Modal,
} from 'native-base';
import { useDailySummary, useLogMeal } from '../../features/nutrition/useNutrition';

export function NutritionPage() {
  const [mealInput, setMealInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: summary, isLoading, refetch } = useDailySummary();
  const logMealMutation = useLogMeal();

  const bg = useColorModeValue('gray.50', 'gray.900');

  const handleLogMeal = async () => {
    if (!mealInput.trim()) return;
    await logMealMutation.mutateAsync(mealInput.trim());
    setMealInput('');
    setModalOpen(false);
    refetch();
  };

  const caloriePercent = summary
    ? Math.min(100, Math.round((summary.totals.calories / summary.calorieGoal) * 100))
    : 0;

  return (
    <Box flex={1} bg={bg} safeArea>
      <ScrollView>
        <Box px={4} py={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Питание</Text>

          {/* Calorie summary */}
          <Box bg="white" borderRadius="xl" p={4} shadow={1} mb={4}>
            <HStack justifyContent="space-between" mb={3}>
              <VStack>
                <Text fontSize="sm" color="gray.500">Съедено</Text>
                <Text fontSize="2xl" fontWeight="bold" color="primary.600">
                  {Math.round(summary?.totals.calories || 0)} ккал
                </Text>
              </VStack>
              <VStack alignItems="flex-end">
                <Text fontSize="sm" color="gray.500">Цель</Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  {summary?.calorieGoal || 2000} ккал
                </Text>
              </VStack>
            </HStack>

            <Progress
              value={caloriePercent}
              colorScheme={caloriePercent > 90 ? 'red' : 'primary'}
              size="sm"
              borderRadius="full"
            />

            <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
              Осталось: {Math.max(0, Math.round((summary?.calorieGoal || 2000) - (summary?.totals.calories || 0)))} ккал
            </Text>
          </Box>

          {/* Macros */}
          {summary && (
            <HStack space={3} mb={4}>
              {[
                { label: 'Белки', value: summary.totals.protein, unit: 'г', color: '#3b82f6' },
                { label: 'Жиры', value: summary.totals.fat, unit: 'г', color: '#f59e0b' },
                { label: 'Углев.', value: summary.totals.carbs, unit: 'г', color: '#10b981' },
              ].map((macro) => (
                <Box key={macro.label} flex={1} bg="white" borderRadius="xl" p={3} shadow={1} alignItems="center">
                  <Box w={2} h={2} borderRadius="full" bg={macro.color} mb={1} />
                  <Text fontSize="lg" fontWeight="bold">{Math.round(macro.value)}{macro.unit}</Text>
                  <Text fontSize="xs" color="gray.500">{macro.label}</Text>
                </Box>
              ))}
            </HStack>
          )}

          {/* Add meal button */}
          <Pressable onPress={() => setModalOpen(true)} mb={4}>
            <Box
              bg="primary.500"
              borderRadius="xl"
              p={4}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              space={2}
            >
              <Text fontSize="xl" color="white">+</Text>
              <Text fontSize="md" fontWeight="600" color="white">Добавить приём пищи</Text>
            </Box>
          </Pressable>

          {/* Meal logs */}
          <Text fontSize="lg" fontWeight="bold" mb={3}>Сегодня</Text>

          {isLoading ? (
            <Text color="gray.400">Загрузка...</Text>
          ) : summary?.logs.length === 0 ? (
            <Box bg="white" borderRadius="xl" p={6} alignItems="center">
              <Text fontSize="3xl" mb={2}>🥗</Text>
              <Text color="gray.400">Пока нет записей</Text>
              <Text fontSize="sm" color="gray.300">Добавьте первый приём пищи</Text>
            </Box>
          ) : (
            <VStack space={3}>
              {summary?.logs.map((log) => (
                <Box key={log.id} bg="white" borderRadius="xl" p={4} shadow={1}>
                  <HStack justifyContent="space-between" mb={1}>
                    <Text fontWeight="600" flex={1} mr={2}>{log.meal}</Text>
                    {log.calories && (
                      <Text color="primary.600" fontWeight="600">
                        {Math.round(log.calories)} ккал
                      </Text>
                    )}
                  </HStack>
                  {log.aiAnalysis && (
                    <Text fontSize="sm" color="gray.500">{log.aiAnalysis}</Text>
                  )}
                  <HStack space={3} mt={1}>
                    {log.protein && <Text fontSize="xs" color="blue.500">Б: {Math.round(log.protein)}г</Text>}
                    {log.fat && <Text fontSize="xs" color="yellow.600">Ж: {Math.round(log.fat)}г</Text>}
                    {log.carbs && <Text fontSize="xs" color="green.500">У: {Math.round(log.carbs)}г</Text>}
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </ScrollView>

      {/* Add meal modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Добавить приём пищи</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Text fontSize="sm" color="gray.500">
                Опишите что вы съели, ИИ автоматически рассчитает КБЖУ
              </Text>
              <Input
                value={mealInput}
                onChangeText={setMealInput}
                placeholder="Например: овсянка 200г с бананом, кофе с молоком"
                multiline
                numberOfLines={3}
                size="lg"
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => setModalOpen(false)}>Отмена</Button>
              <Button
                onPress={handleLogMeal}
                isLoading={logMealMutation.isPending}
                isLoadingText="Анализирую..."
              >
                Добавить
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
