import React, { useState, useRef } from 'react';
import {
  Box, HStack, VStack, Text, Input, IconButton, Pressable,
  useColorModeValue, SafeAreaView,
} from 'native-base';
import { KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMessages } from '../../features/chat/useMessages';
import { useSendMessage } from '../../features/chat/useSendMessage';
import { ChatWidget } from '../../widgets/ChatWidget';
import { RobotAvatar } from '../../widgets/RobotAvatar';

export function ChatPage() {
  const [inputText, setInputText] = useState('');
  const { data: messages = [], isLoading } = useMessages();
  const sendMutation = useSendMessage();

  const bg = useColorModeValue('gray.50', 'gray.900');
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const boredBg = useColorModeValue('primary.50', 'primary.900');
  const boredBorder = useColorModeValue('primary.200', 'primary.700');
  const primaryTextColor = useColorModeValue('primary.600', 'primary.300');
  const primaryIconColor = useColorModeValue('#870BF4', '#B263F8');

  const isResponding = sendMutation.isPending;

  const getEmotion = () => {
    if (isResponding) return 'thinking';
    if (messages.length === 0) return 'default';
    const lastMsg = messages[messages.length - 1];
    const content = lastMsg?.content?.toLowerCase() || '';
    if (content.includes('молодец') || content.includes('отлично') || content.includes('супер')) return 'happy';
    if (content.includes('давай') || content.includes('вперёд') || content.includes('можешь')) return 'motivated';
    if (content.includes('пропустил') || content.includes('не тренировался')) return 'sad';
    return 'default';
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isResponding) return;
    setInputText('');
    try {
      await sendMutation.mutateAsync(text);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Ошибка отправки';
      Alert.alert('Ошибка', errMsg);
    }
  };

  const handleBored = () => {
    setInputText('Дай мне случайный вызов на день');
  };

  return (
    <Box flex={1} bg={bg} safeArea>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Header with Robot */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          px={4}
          py={3}
          borderBottomWidth={1}
          borderBottomColor={borderColor}
          shadow={1}
        >
          <HStack alignItems="center" space={3}>
            <RobotAvatar emotion={getEmotion()} isThinking={isResponding} size={48} />
            <VStack>
              <Text fontSize="lg" fontWeight="bold" color={primaryTextColor}>
                Макс
              </Text>
              <HStack alignItems="center" space={1}>
                <Ionicons
                  name={isResponding ? 'ellipsis-horizontal' : 'checkmark-circle'}
                  size={12}
                  color={isResponding ? '#f97316' : '#22c55e'}
                />
                <Text fontSize="xs" color={isResponding ? 'orange.500' : 'green.500'}>
                  {isResponding ? 'Думаю...' : 'Онлайн'}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Box>

        {/* Messages */}
        <Box flex={1}>
          <ChatWidget messages={messages} isLoading={isLoading} isResponding={isResponding} />
        </Box>

        {/* Input area */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          px={3}
          pt={2}
          pb={Platform.OS === 'ios' ? 4 : 2}
          borderTopWidth={1}
          borderTopColor={borderColor}
        >
          {/* Bored button */}
          <Pressable onPress={handleBored} mb={2} alignSelf="flex-start">
            <Box bg={boredBg} borderRadius="full" px={3} py={1} borderWidth={1} borderColor={boredBorder} flexDirection="row" alignItems="center" style={{ gap: 4 }}>
              <Ionicons name="moon-outline" size={12} color={primaryIconColor} />
              <Text fontSize="xs" color={primaryTextColor}>Мне скучно</Text>
            </Box>
          </Pressable>

          <HStack space={2} alignItems="flex-end">
            <Input
              flex={1}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Напишите сообщение..."
              multiline
              maxH="100px"
              bg={inputBg}
              borderRadius="2xl"
              px={4}
              py={2}
              fontSize="md"
              onSubmitEditing={handleSend}
            />
            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim() || isResponding}
              opacity={!inputText.trim() || isResponding ? 0.5 : 1}
            >
              <Box
                bg="primary.500"
                borderRadius="full"
                w={10}
                h={10}
                alignItems="center"
                justifyContent="center"
              >
                <Ionicons name="arrow-up" size={22} color="white" />
              </Box>
            </Pressable>
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}
