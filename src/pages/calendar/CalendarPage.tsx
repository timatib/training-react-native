import React, { useState, useCallback } from 'react';
import {
  Box, VStack, HStack, Text, ScrollView, Modal, Button, useColorModeValue,
} from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { useCalendar, useCompleteWorkout } from '../../features/calendar/useCalendar';
import { CalendarWidget } from '../../widgets/CalendarWidget';
import { WorkoutPlan } from '../../entities/workout/types';
import { WorkoutCard } from '../../widgets/ChatWidget/WorkoutCard';
import { WorkoutCard as WCardType } from '../../entities/message/types';

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedWorkouts, setSelectedWorkouts] = useState<WorkoutPlan[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: workouts = [], isLoading, refetch } = useCalendar(currentMonth);
  const completeMutation = useCompleteWorkout();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const bg = useColorModeValue('gray.50', 'gray.900');

  const handleDayPress = (date: Date, dayWorkouts: WorkoutPlan[]) => {
    if (dayWorkouts.length > 0) {
      setSelectedWorkouts(dayWorkouts);
      setModalOpen(true);
    }
  };

  const handleComplete = async (workoutId: string) => {
    await completeMutation.mutateAsync(workoutId);
    setModalOpen(false);
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
            <CalendarWidget workouts={workouts} onDayPress={handleDayPress} />
          )}

          {/* Stats */}
          <HStack space={3} mt={6}>
            {[
              { label: 'Всего', count: workouts.length, color: 'primary.500' },
              { label: 'Выполнено', count: workouts.filter((w) => w.completed).length, color: 'green.500' },
              { label: 'Предстоит', count: workouts.filter((w) => !w.completed).length, color: 'blue.500' },
            ].map((item) => (
              <Box key={item.label} flex={1} bg="white" borderRadius="xl" p={3} shadow={1} alignItems="center">
                <Text fontSize="2xl" fontWeight="bold" color={item.color}>
                  {item.count}
                </Text>
                <Text fontSize="xs" color="gray.500">{item.label}</Text>
              </Box>
            ))}
          </HStack>
        </Box>
      </ScrollView>

      {/* Workout detail modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="xl">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            {selectedWorkouts[0]?.title || 'Тренировка'}
          </Modal.Header>
          <Modal.Body>
            <ScrollView>
              {selectedWorkouts.map((workout) => (
                <VStack key={workout.id} space={3}>
                  <HStack justifyContent="space-between">
                    <Text fontSize="sm" color="gray.500">
                      {new Date(workout.date).toLocaleDateString('ru-RU')}
                    </Text>
                    {workout.completed && (
                      <Text fontSize="sm" color="green.500" fontWeight="600">✅ Выполнено</Text>
                    )}
                  </HStack>

                  {(workout.exercises as any[]).map((ex, i) => (
                    <WorkoutCard
                      key={i}
                      card={{
                        type: 'workout_card',
                        exercise: ex.name || ex.exercise,
                        sets: ex.sets || 3,
                        reps: ex.reps || 12,
                        icon: ex.icon || 'dumbbell',
                      } as WCardType}
                    />
                  ))}

                  {!workout.completed && (
                    <Button
                      onPress={() => handleComplete(workout.id)}
                      isLoading={completeMutation.isPending}
                      colorScheme="green"
                      borderRadius="xl"
                    >
                      ✅ Отметить выполненной
                    </Button>
                  )}
                </VStack>
              ))}
            </ScrollView>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
