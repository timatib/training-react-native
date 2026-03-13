import React, { useState } from 'react';
import { Box, HStack, Text, Pressable, useColorModeValue } from 'native-base';
import { WorkoutPlan } from '../../entities/workout/types';

interface CalendarWidgetProps {
  workouts: WorkoutPlan[];
  onDayPress?: (date: Date, dayWorkouts: WorkoutPlan[]) => void;
}

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export function CalendarWidget({ workouts, onDayPress }: CalendarWidgetProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getWorkoutsForDay = (day: number): WorkoutPlan[] => {
    return workouts.filter((w) => {
      const d = new Date(w.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const getDayStatus = (day: number): 'planned' | 'completed' | 'missed' | null => {
    const dayWorkouts = getWorkoutsForDay(day);
    if (dayWorkouts.length === 0) return null;

    const date = new Date(year, month, day);
    const isPast = date < today;

    if (dayWorkouts.every((w) => w.completed)) return 'completed';
    if (isPast && !dayWorkouts.every((w) => w.completed)) return 'missed';
    return 'planned';
  };

  const statusColors: Record<string, string> = {
    planned: '#3b82f6',
    completed: '#10b981',
    missed: '#ef4444',
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const dayColor = useColorModeValue('gray.700', 'gray.200');
  const todayBg = useColorModeValue('primary.50', 'primary.900');
  const headerColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <Box bg={cardBg} borderRadius="xl" shadow={2} p={4}>
      {/* Header */}
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <Pressable onPress={prevMonth} p={2}>
          <Text fontSize="xl" color={headerColor}>‹</Text>
        </Pressable>
        <Text fontSize="lg" fontWeight="bold" color={headerColor}>
          {MONTHS[month]} {year}
        </Text>
        <Pressable onPress={nextMonth} p={2}>
          <Text fontSize="xl" color={headerColor}>›</Text>
        </Pressable>
      </HStack>

      {/* Week days */}
      <HStack justifyContent="space-around" mb={2}>
        {WEEK_DAYS.map((d) => (
          <Text key={d} fontSize="xs" color="gray.400" fontWeight="600" textAlign="center" flex={1}>
            {d}
          </Text>
        ))}
      </HStack>

      {/* Days grid */}
      <Box>
        {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIdx) => (
          <HStack key={weekIdx} justifyContent="space-around" mb={1}>
            {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, dayIdx) => {
              if (!day) return <Box key={dayIdx} flex={1} h={10} />;

              const status = getDayStatus(day);
              const isToday =
                day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const dayWorkouts = getWorkoutsForDay(day);

              return (
                <Pressable
                  key={dayIdx}
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  h={10}
                  borderRadius="full"
                  bg={isToday ? todayBg : 'transparent'}
                  onPress={() => onDayPress?.(new Date(year, month, day), dayWorkouts)}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={isToday ? 'bold' : 'normal'}
                    color={isToday ? 'primary.500' : dayColor}
                  >
                    {day}
                  </Text>
                  {status && (
                    <Box
                      w={1.5}
                      h={1.5}
                      borderRadius="full"
                      bg={statusColors[status]}
                      mt={0.5}
                    />
                  )}
                </Pressable>
              );
            })}
          </HStack>
        ))}
      </Box>

      {/* Legend */}
      <HStack space={4} mt={4} justifyContent="center">
        {[
          { color: '#3b82f6', label: 'Запланировано' },
          { color: '#10b981', label: 'Выполнено' },
          { color: '#ef4444', label: 'Пропущено' },
        ].map((item) => (
          <HStack key={item.label} space={1} alignItems="center">
            <Box w={2} h={2} borderRadius="full" bg={item.color} />
            <Text fontSize="xs" color="gray.500">
              {item.label}
            </Text>
          </HStack>
        ))}
      </HStack>
    </Box>
  );
}
