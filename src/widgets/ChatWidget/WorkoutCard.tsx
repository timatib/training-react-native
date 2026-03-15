import React from 'react';
import { Box, HStack, VStack, Text } from 'native-base';
import { WorkoutCard as WorkoutCardType } from '../../entities/message/types';

interface WorkoutCardProps {
  card: WorkoutCardType;
}

export function WorkoutCard({ card }: WorkoutCardProps) {
  return (
    <Box
      bg="primary.500"
      borderRadius="xl"
      p={4}
      mx={2}
      my={1}
      shadow={3}
      style={{ maxWidth: 260 }}
    >
      <VStack space={2}>
        <Text color="white" fontWeight="bold" fontSize="md" numberOfLines={2}>
          {card.exercise}
        </Text>
        <HStack space={3}>
          <Box bg="white" borderRadius="full" px={2} py={0.5}>
            <Text color="primary.600" fontSize="xs" fontWeight="bold">
              {card.sets} подх.
            </Text>
          </Box>
          <Box bg="white" borderRadius="full" px={2} py={0.5}>
            <Text color="primary.600" fontSize="xs" fontWeight="bold">
              {card.reps} повт.
            </Text>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}
