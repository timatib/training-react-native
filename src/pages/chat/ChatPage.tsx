import React, { useState, useEffect } from 'react';
import {
  Box, HStack, VStack, Text, Input, Pressable,
  useColorModeValue,
} from 'native-base';
import { KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useMessages } from '../../features/chat/useMessages';
import { useSendMessage } from '../../features/chat/useSendMessage';
import { useTranscribe } from '../../features/chat/useTranscribe';
import { ChatWidget } from '../../widgets/ChatWidget';
import { RobotAvatar } from '../../widgets/RobotAvatar';

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^[-•]\s/gm, '')
    .replace(/^\d+\.\s/gm, '')
    .trim();
}

export function ChatPage() {
  const [inputText, setInputText] = useState('');
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);

  const { data: messages = [], isLoading } = useMessages();
  const sendMutation = useSendMessage();
  const { isRecording, isTranscribing, recordingDuration, startRecording, stopAndTranscribe } = useTranscribe();

  const bg = useColorModeValue('gray.50', 'gray.900');
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const boredBg = useColorModeValue('primary.50', 'primary.900');
  const boredBorder = useColorModeValue('primary.200', 'primary.700');
  const primaryTextColor = useColorModeValue('primary.600', 'primary.300');
  const primaryIconColor = useColorModeValue('#870BF4', '#B263F8');
  const headerBg = useColorModeValue('white', 'gray.800');

  const isResponding = sendMutation.isPending;

  // Auto-play AI response when voice output is enabled
  useEffect(() => {
    if (!voiceOutputEnabled || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last?.role === 'ASSISTANT') {
      Speech.speak(stripMarkdown(last.content), { language: 'ru-RU', rate: 1.0 });
    }
  }, [messages, voiceOutputEnabled]);

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
    Speech.stop();
    setInputText('');
    try {
      await sendMutation.mutateAsync(text);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Ошибка отправки';
      Alert.alert('Ошибка', errMsg);
    }
  };

  const handleMicPress = async () => {
    if (isRecording) {
      const text = await stopAndTranscribe('ru');
      if (text) setInputText(text);
    } else {
      Speech.stop();
      await startRecording();
    }
  };

  const handleBored = () => {
    setInputText('Дай мне случайный вызов на день');
  };

  const toggleVoiceOutput = () => {
    if (voiceOutputEnabled) Speech.stop();
    setVoiceOutputEnabled((v) => !v);
  };

  return (
    <Box flex={1} bg={bg} safeAreaTop pb={4}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <Box
          bg={headerBg}
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

            {/* Voice output toggle */}
            <Pressable onPress={toggleVoiceOutput} ml="auto" p={2}>
              <Ionicons
                name={voiceOutputEnabled ? 'volume-high' : 'volume-mute'}
                size={22}
                color={voiceOutputEnabled ? primaryIconColor : '#9ca3af'}
              />
            </Pressable>
          </HStack>
        </Box>

        {/* Messages */}
        <Box flex={1}>
          <ChatWidget messages={messages} isLoading={isLoading} isResponding={isResponding} />
        </Box>

        {/* Input area */}
        <Box
          bg={headerBg}
          px={3}
          pt={2}
          pb={0}
          borderTopWidth={1}
          borderTopColor={borderColor}
        >
          {/* Bored button */}
          <Pressable onPress={handleBored} mb={2} alignSelf="flex-start">
            <Box
              bg={boredBg}
              borderRadius="full"
              px={3}
              py={1}
              borderWidth={1}
              borderColor={boredBorder}
              flexDirection="row"
              alignItems="center"
              style={{ gap: 4 }}
            >
              <Ionicons name="moon-outline" size={12} color={primaryIconColor} />
              <Text fontSize="xs" color={primaryTextColor}>Мне скучно</Text>
            </Box>
          </Pressable>

          {/* Recording indicator */}
          {(isRecording || isTranscribing) && (
            <HStack space={2} alignItems="center" mb={1} px={1}>
              <Box w={2} h={2} borderRadius="full" bg="red.500" />
              <Text fontSize="xs" color="red.500">
                {isTranscribing ? 'Распознаю...' : `Запись ${recordingDuration}с`}
              </Text>
            </HStack>
          )}

          <HStack space={2} alignItems="flex-end" mb={2}>
            <Input
              flex={1}
              value={inputText}
              onChangeText={setInputText}
              placeholder={isRecording ? 'Говорите...' : 'Напишите сообщение...'}
              multiline
              maxH="100px"
              bg={inputBg}
              borderRadius="2xl"
              px={4}
              py={2}
              fontSize="md"
              onSubmitEditing={handleSend}
              isDisabled={isRecording}
            />

            {inputText.trim() ? (
              <Pressable
                onPress={handleSend}
                isDisabled={isResponding}
                opacity={isResponding ? 0.5 : 1}
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
            ) : (
              <Pressable
                onPress={handleMicPress}
                isDisabled={isResponding || isTranscribing}
                opacity={isResponding || isTranscribing ? 0.5 : 1}
              >
                <Box
                  bg={isRecording ? 'red.500' : 'primary.500'}
                  borderRadius="full"
                  w={10}
                  h={10}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons
                    name={isRecording ? 'stop' : 'mic'}
                    size={22}
                    color="white"
                  />
                </Box>
              </Pressable>
            )}
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}
