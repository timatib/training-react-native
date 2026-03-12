import React from 'react';
import { Box, Text, VStack } from 'native-base';
import { Message } from '../../entities/message/types';
import { WorkoutCard } from './WorkoutCard';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'USER';

  const time = new Date(message.createdAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Box
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      maxW="80%"
      mb={2}
      mx={3}
    >
      <VStack space={1}>
        {/* Workout cards */}
        {message.metadata?.workoutCards?.map((card, i) => (
          <WorkoutCard key={i} card={card} />
        ))}

        {/* Text bubble */}
        {message.content && (
          <Box
            bg={isUser ? 'primary.500' : 'gray.100'}
            borderRadius="2xl"
            borderBottomRightRadius={isUser ? 'sm' : '2xl'}
            borderBottomLeftRadius={isUser ? '2xl' : 'sm'}
            px={4}
            py={3}
          >
            <Text
              color={isUser ? 'white' : 'gray.800'}
              fontSize="md"
              lineHeight="lg"
            >
              {message.content}
            </Text>
          </Box>
        )}

        {/* Timestamp */}
        <Text
          fontSize="xs"
          color="gray.400"
          alignSelf={isUser ? 'flex-end' : 'flex-start'}
          px={1}
        >
          {time}
        </Text>
      </VStack>
    </Box>
  );
}
