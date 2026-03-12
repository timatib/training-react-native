import React, { useRef, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Box } from 'native-base';
import { Message } from '../../entities/message/types';
import { MessageBubble } from './MessageBubble';
import { ChatSkeleton } from './ChatSkeleton';

interface ChatWidgetProps {
  messages: Message[];
  isLoading: boolean;
  isResponding: boolean;
}

export function ChatWidget({ messages, isLoading, isResponding }: ChatWidgetProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  if (isLoading) {
    return <ChatSkeleton />;
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingVertical: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isResponding && (
        <Box alignSelf="flex-start" mx={3} my={1}>
          <Box bg="gray.100" borderRadius="2xl" px={4} py={3} borderBottomLeftRadius="sm">
            <Box flexDirection="row" style={{ gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg="gray.400"
                  style={{
                    opacity: 0.6 + i * 0.2,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </ScrollView>
  );
}
