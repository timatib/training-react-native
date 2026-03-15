import React, { useState, useCallback } from 'react';
import {
  Box, VStack, HStack, Text, ScrollView, Button, Pressable, useColorModeValue, Divider,
} from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCalendar, useCompleteWorkout, useDeleteWorkout } from '../../features/calendar/useCalendar';
import { CalendarWidget } from '../../widgets/CalendarWidget';
import { CreateWorkoutModal } from '../../widgets/CalendarWidget/CreateWorkoutModal';
import { WorkoutPlan } from '../../entities/workout/types';

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<WorkoutPlan[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: workouts = [], isLoading, refetch } = useCalendar(currentMonth);
  const completeMutation = useCompleteWorkout();
  const deleteMutation = useDeleteWorkout();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const exerciseBorderColor = useColorModeValue('gray.100', 'gray.700');
  const exerciseNumBg = useColorModeValue('primary.50', 'primary.900');
  const metaBg = useColorModeValue('gray.100', 'gray.700');
  const metaTextColor = useColorModeValue('gray.600', 'gray.300');

  const handleDayPress = (date: Date, dayWorkouts: WorkoutPlan[]) => {
    if (selectedDate?.toDateString() === date.toDateString()) {
      setSelectedDate(null);
      setSelectedWorkouts([]);
    } else {
      setSelectedDate(date);
      setSelectedWorkouts(dayWorkouts);
    }
  };

  const handleComplete = async (workoutId: string) => {
    await completeMutation.mutateAsync(workoutId);
    refetch();
    setSelectedWorkouts((prev) =>
      prev.map((w) => (w.id === workoutId ? { ...w, completed: true } : w))
    );
  };

  const handleDelete = (workoutId: string) => {
    Alert.alert('Удалить тренировку?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await deleteMutation.mutateAsync(workoutId);
          refetch();
          setSelectedWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
        },
      },
    ]);
  };

  return (
    <Box flex={1} bg={bg} safeArea>
      <ScrollView>
        <Box px={4} py={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Календарь тренировок</Text>

          {isLoading ? (
            <Box h={300} alignItems="center" justifyContent="center">
              <Text color="gray.400">Загрузка...</Text>
            </Box>
          ) : (
            <CalendarWidget
              workouts={workouts}
              onDayPress={handleDayPress}
              selectedDate={selectedDate}
            />
          )}

          {/* Inline workout details */}
          {selectedDate && selectedWorkouts.length > 0 && (
            <Box mt={4} bg={cardBg} borderRadius="xl" shadow={1} overflow="hidden">
              <Box px={4} py={3} bg="primary.500">
                <HStack justifyContent="space-between" alignItems="center">
                  <Text color="white" fontWeight="bold" fontSize="md">
                    {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' })}
                  </Text>
                  <Pressable onPress={() => { setSelectedDate(null); setSelectedWorkouts([]); }}>
                    <Ionicons name="close" size={20} color="white" />
                  </Pressable>
                </HStack>
              </Box>

              {selectedWorkouts.map((workout, idx) => (
                <Box key={workout.id} px={4} py={4}>
                  {idx > 0 && <Divider mb={4} />}

                  <HStack justifyContent="space-between" alignItems="center" mb={3}>
                    <Text fontWeight="bold" fontSize="lg" flex={1}>{workout.title}</Text>
                    <HStack space={2} alignItems="center">
                      {workout.completed ? (
                        <HStack space={1} alignItems="center">
                          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                          <Text fontSize="sm" color="green.500" fontWeight="600">Выполнено</Text>
                        </HStack>
                      ) : (
                        <Box bg="blue.50" borderRadius="full" px={3} py={0.5}>
                          <Text fontSize="xs" color="blue.600" fontWeight="500">Запланировано</Text>
                        </Box>
                      )}
                      <Pressable onPress={() => handleDelete(workout.id)}>
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                      </Pressable>
                    </HStack>
                  </HStack>

                  <VStack space={0}>
                    {(workout.exercises as any[]).map((ex, i) => (
                      <HStack
                        key={i}
                        space={3}
                        alignItems="center"
                        py={3}
                        borderBottomWidth={1}
                        borderBottomColor={exerciseBorderColor}
                      >
                        <Box
                          w={7}
                          h={7}
                          borderRadius="full"
                          bg={exerciseNumBg}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="xs" color="primary.600" fontWeight="bold">{i + 1}</Text>
                        </Box>
                        <Text flex={1} fontSize="sm" fontWeight="500">
                          {ex.name || ex.exercise}
                        </Text>
                        <HStack space={1}>
                          {ex.sets && (
                            <Box bg={metaBg} borderRadius="full" px={2} py={0.5}>
                              <Text fontSize="xs" color={metaTextColor}>{ex.sets} подх.</Text>
                            </Box>
                          )}
                          {ex.reps && (
                            <Box bg={metaBg} borderRadius="full" px={2} py={0.5}>
                              <Text fontSize="xs" color={metaTextColor}>{ex.reps} повт.</Text>
                            </Box>
                          )}
                          {ex.duration && (
                            <Box bg={metaBg} borderRadius="full" px={2} py={0.5}>
                              <Text fontSize="xs" color={metaTextColor}>{ex.duration} мин.</Text>
                            </Box>
                          )}
                        </HStack>
                      </HStack>
                    ))}
                  </VStack>

                  {!workout.completed && new Date(workout.date) <= new Date() && (
                    <Button
                      mt={4}
                      onPress={() => handleComplete(workout.id)}
                      isLoading={completeMutation.isPending}
                      colorScheme="green"
                      borderRadius="xl"
                    >
                      Отметить выполненной
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Empty state when empty day tapped */}
          {selectedDate && selectedWorkouts.length === 0 && (
            <Box mt={4} bg={cardBg} borderRadius="xl" p={5} shadow={1} alignItems="center">
              <Ionicons name="calendar-outline" size={32} color="#9ca3af" />
              <Text color="gray.400" mt={2} textAlign="center">
                На {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} тренировок нет
              </Text>
              <Text color="gray.400" fontSize="xs" textAlign="center" mt={1}>
                Нажмите «+» чтобы добавить вручную или попросите Макса в чате
              </Text>
            </Box>
          )}

          {/* Stats */}
          <HStack space={3} mt={6}>
            {[
              { label: 'Всего', count: workouts.length, color: 'primary.500' },
              { label: 'Выполнено', count: workouts.filter((w) => w.completed).length, color: 'green.500' },
              { label: 'Предстоит', count: workouts.filter((w) => !w.completed).length, color: 'blue.500' },
            ].map((item) => (
              <Box key={item.label} flex={1} bg={cardBg} borderRadius="xl" p={3} shadow={1} alignItems="center">
                <Text fontSize="2xl" fontWeight="bold" color={item.color}>{item.count}</Text>
                <Text fontSize="xs" color="gray.500">{item.label}</Text>
              </Box>
            ))}
          </HStack>
        </Box>
      </ScrollView>

      {/* FAB — Add workout manually */}
      <Pressable
        position="absolute"
        bottom={6}
        right={4}
        onPress={() => setShowCreateModal(true)}
        shadow={4}
      >
        <Box
          bg="primary.500"
          borderRadius="full"
          px={4}
          py={3}
          flexDirection="row"
          alignItems="center"
          style={{ gap: 6 }}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text color="white" fontWeight="bold" fontSize="sm">Добавить расписание</Text>
        </Box>
      </Pressable>

      <CreateWorkoutModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => refetch()}
        initialDate={selectedDate ? selectedDate.toISOString().slice(0, 10) : undefined}
      />
    </Box>
  );
}
