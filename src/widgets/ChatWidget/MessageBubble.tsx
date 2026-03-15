import React from 'react';
import { Box, Text, VStack } from 'native-base';
import Markdown from 'react-native-markdown-display';
import { Message } from '../../entities/message/types';

interface MessageBubbleProps {
  message: Message;
}

const markdownStyles = {
  body: { color: '#1f2937', fontSize: 15, lineHeight: 22 },
  paragraph: { marginTop: 0, marginBottom: 4 },
  strong: { fontWeight: 'bold' },
  bullet_list: { marginBottom: 4 },
  ordered_list: { marginBottom: 4 },
  list_item: { marginBottom: 2 },
  code_inline: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    paddingHorizontal: 4,
    fontFamily: 'monospace',
    fontSize: 13,
  },
};

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
        <Box
          bg={isUser ? 'primary.500' : 'gray.100'}
          borderRadius="2xl"
          borderBottomRightRadius={isUser ? 'sm' : '2xl'}
          borderBottomLeftRadius={isUser ? '2xl' : 'sm'}
          px={4}
          py={3}
        >
          {isUser ? (
            <Text color="white" fontSize="md" lineHeight="lg">
              {message.content}
            </Text>
          ) : (
            <Markdown style={markdownStyles}>
              {message.content}
            </Markdown>
          )}
        </Box>

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
